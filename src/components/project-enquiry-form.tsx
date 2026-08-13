import { useState, type FormEvent } from "react";
import { createContactMessage } from "@/lib/contact";
import { buildContactPayload, CONTACT_LIMITS, isHoneypotFilled, validateContactDraft } from "@/lib/contact.logic";

const inputClass = "mt-2 min-h-12 w-full rounded-xl border border-border bg-surface-inset px-4 py-3 text-base text-foreground outline-none transition-[border-color,background-color] placeholder:text-quiet-foreground hover:border-border-strong focus:border-accent-muted";
const emptyDraft = { name: "", email: "", message: "", website: "" };

function RequiredMark() {
  return <span className="text-accent" aria-hidden> *</span>;
}

export function ProjectEnquiryForm() {
  const [draft, setDraft] = useState(emptyDraft);
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  function setField(field: keyof typeof draft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (state === "submitting") return;
    setFeedback("");
    if (isHoneypotFilled(draft)) {
      setDraft(emptyDraft);
      setState("success");
      setFeedback("Thanks—your message has been received.");
      return;
    }
    const validationError = validateContactDraft(draft);
    if (validationError) {
      setState("error");
      setFeedback(validationError);
      return;
    }
    setState("submitting");
    try {
      await createContactMessage(buildContactPayload(draft));
      setDraft(emptyDraft);
      setState("success");
      setFeedback("Thanks—your message has been received.");
    } catch {
      setState("error");
      setFeedback("Your message could not be sent. Please try again.");
    }
  }

  return (
    <form className="surface-feature p-6 sm:p-8 md:p-10" aria-describedby="enquiry-status" onSubmit={submit} noValidate>
      <div className="border-b border-border-subtle pb-7">
        <p className="eyebrow text-accent">Project enquiry</p>
        <h2 className="mt-4 text-2xl tracking-[-0.035em] sm:text-3xl">Share the shape of the work.</h2>
        <p id="enquiry-status" className="mt-4 max-w-2xl text-sm leading-6 text-foreground-soft">Send a concise note and I’ll respond when I can.</p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <label className="text-sm font-medium text-foreground">Name<RequiredMark /><input className={inputClass} autoComplete="name" maxLength={CONTACT_LIMITS.name} value={draft.name} onChange={(event) => setField("name", event.target.value)} /></label>
        <label className="text-sm font-medium text-foreground">Email<RequiredMark /><input className={inputClass} type="email" autoComplete="email" maxLength={CONTACT_LIMITS.email} value={draft.email} onChange={(event) => setField("email", event.target.value)} /></label>
      </div>
      <label className="mt-6 block text-sm font-medium text-foreground">Message<RequiredMark /><textarea className={`${inputClass} min-h-44 resize-y`} rows={7} maxLength={CONTACT_LIMITS.message} value={draft.message} onChange={(event) => setField("message", event.target.value)} /></label>
      <div className="contact-honeypot" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={draft.website} onChange={(event) => setField("website", event.target.value)} /></label></div>

      <div className="mt-8 border-t border-border-subtle pt-6">
        {feedback ? <p className={`text-sm leading-6 ${state === "error" ? "text-[color:oklch(0.8_0.09_28)]" : "text-foreground-soft"}`} role="status" aria-live="polite">{feedback}</p> : null}
        <button type="submit" disabled={state === "submitting"} className="button-primary mt-5">{state === "submitting" ? "Sending…" : "Send message"}</button>
      </div>
    </form>
  );
}
