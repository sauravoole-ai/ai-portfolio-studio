import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

type WebhookRecord = { id?: string } | null;
type DatabaseWebhookPayload = {
  type?: string;
  table?: string;
  schema?: string;
  record?: WebhookRecord;
};

type ContactRecord = {
  id: string;
  name: string;
  email: string;
  project_type: string | null;
  build_idea: string | null;
  message: string;
  status: string;
  created_at: string;
};

const ALERT_TO = "sauravoole@gmail.com";
const STUDIO_MESSAGES_URL = "https://studio.sauravkrjha.workers.dev/studio";
const RESEND_ENDPOINT = "https://api.resend.com/emails";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalize(value: string | null | undefined, fallback = "Not provided") {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

function getBackendKey() {
  const modern = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (modern) {
    try {
      const parsed = JSON.parse(modern) as Record<string, string>;
      if (parsed.default) return parsed.default;
    } catch {
      // Fall through to the legacy service-role key.
    }
  }
  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const backendKey = getBackendKey();
  const webhookSecret = req.headers.get("x-portfolio-webhook-secret") ?? "";

  if (!resendApiKey || !supabaseUrl || !backendKey) {
    return Response.json({ error: "Notification service is not configured." }, { status: 503 });
  }

  if (!webhookSecret) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabase = createClient(supabaseUrl, backendKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: secretOk, error: secretError } = await supabase.rpc(
    "verify_portfolio_enquiry_webhook",
    { candidate: webhookSecret },
  );

  if (secretError || secretOk !== true) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  let payload: DatabaseWebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const recordId = payload.record?.id;
  if (
    payload.type !== "INSERT" ||
    payload.schema !== "public" ||
    payload.table !== "contact_messages" ||
    typeof recordId !== "string" ||
    !recordId
  ) {
    return Response.json({ error: "Unsupported webhook payload." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("contact_messages")
    .select("id,name,email,project_type,build_idea,message,status,created_at")
    .eq("id", recordId)
    .maybeSingle<ContactRecord>();

  if (error || !data) {
    return Response.json({ error: "Contact message could not be verified." }, { status: 404 });
  }

  const name = normalize(data.name, "Unknown sender");
  const email = normalize(data.email, "Unknown email");
  const projectType = normalize(data.project_type);
  const buildIdea = normalize(data.build_idea);
  const message = normalize(data.message);
  const createdAt = normalize(data.created_at);
  const subjectName = name.replace(/[\r\n]+/g, " ").slice(0, 100);

  const text = [
    `New portfolio enquiry from ${name}`,
    "",
    `Email: ${email}`,
    `Project type: ${projectType}`,
    `What they want to build: ${buildIdea}`,
    `Submitted at: ${createdAt}`,
    "",
    "Brief / context:",
    message,
    "",
    `Review in Studio: ${STUDIO_MESSAGES_URL}`,
  ].join("\n");

  const html = `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;color:#111827;line-height:1.6"><h2>New portfolio enquiry</h2><p><strong>From:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Project type:</strong> ${escapeHtml(projectType)}</p><p><strong>What they want to build:</strong><br>${escapeHtml(buildIdea).replaceAll("\n", "<br>")}</p><p><strong>Brief / context:</strong><br>${escapeHtml(message).replaceAll("\n", "<br>")}</p><p><strong>Submitted at:</strong> ${escapeHtml(createdAt)}</p><p><a href="${STUDIO_MESSAGES_URL}">Open Studio Messages</a></p></body></html>`;

  const resendResponse = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Portfolio Alerts <onboarding@resend.dev>",
      to: [ALERT_TO],
      reply_to: email,
      subject: `New portfolio enquiry from ${subjectName}`,
      text,
      html,
    }),
  });

  if (!resendResponse.ok) {
    console.error("[notify-portfolio-enquiry] Resend returned a non-2xx response.");
    return Response.json({ error: "Email notification failed." }, { status: 502 });
  }

  return Response.json({ ok: true });
});

