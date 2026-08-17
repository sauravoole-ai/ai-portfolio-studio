import { useState, type FormEvent } from "react";
import { createContactMessage } from "@/lib/contact";
import { buildContactPayload, CONTACT_LIMITS, getContactFieldErrors, isHoneypotFilled, validateContactDraft } from "@/lib/contact.logic";

const inputClass = "mt-2 min-h-12 w-full rounded-xl border border-border bg-surface-inset px-4 py-3 text-base text-foreground outline-none transition-[border-color,background-color] placeholder:text-quiet-foreground hover:border-border-strong focus:border-accent-muted";
const emptyDraft = { name: "", email: "", projectType: "", buildIdea: "", message: "", website: "" };
const projectTypes = ["AI assistant / chatbot", "AI-powered web app", "Document / retrieval tool", "Workflow prototype", "AIoT / connected product", "Improve an existing AI product", "Other / Not sure yet"];

function RequiredMark() {
  return <span className="text-accent" aria-hidden> *</span>;
}

export function ProjectEnquiryForm() {
  const [draft, setDraft] = useState(emptyDraft);
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [validationAttempted, setValidationAttempted] = useState(false);
  const fieldErrors = validationAttempted ? getContactFieldErrors(draft) : {};

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
      setValidationAttempted(false);
      setFeedback("Your message has been received.");
      return;
    }
    const validationError = validateContactDraft(draft);
    if (validationError) {
      setValidationAttempted(true);
      setState("error");
      setFeedback("Please review the highlighted fields.");
      return;
    }
    setState("submitting");
    try {
      await createContactMessage(buildContactPayload(draft));
      setDraft(emptyDraft);
      setState("success");
      setValidationAttempted(false);
      setFeedback("Your message has been received.");
    } catch {
      setState("error");
      setFeedback("Your message could not be sent. Please try again.");
    }
  }

  return (
    <form className="surface-feature p-6 sm:p-8 md:p-10" aria-describedby={feedback ? "enquiry-status" : undefined} onSubmit={submit} noValidate>
      <div className="border-b border-border-subtle pb-7">
        <p className="eyebrow text-accent">Project enquiry</p>
        <h2 className="mt-4 font-sans text-2xl font-medium tracking-[-0.035em] sm:text-3xl">Enquiry details</h2>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <label className="text-sm font-medium text-foreground">Name<RequiredMark /><input className={inputClass} required aria-invalid={fieldErrors.name ? true : undefined} aria-describedby={fieldErrors.name ? "contact-name-error" : undefined} autoComplete="name" maxLength={CONTACT_LIMITS.name} value={draft.name} onChange={(event) => setField("name", event.target.value)} />{fieldErrors.name ? <span id="contact-name-error" className="contact-field-error">{fieldErrors.name}</span> : null}</label>
        <label className="text-sm font-medium text-foreground">Email<RequiredMark /><input className={inputClass} required aria-invalid={fieldErrors.email ? true : undefined} aria-describedby={fieldErrors.email ? "contact-email-error" : undefined} type="email" autoComplete="email" maxLength={CONTACT_LIMITS.email} value={draft.email} onChange={(event) => setField("email", event.target.value)} />{fieldErrors.email ? <span id="contact-email-error" className="contact-field-error">{fieldErrors.email}</span> : null}</label>
      </div>
      <label className="mt-6 block text-sm font-medium text-foreground">Project type <span className="font-normal text-muted-foreground">— optional</span><select className={inputClass} aria-invalid={fieldErrors.projectType ? true : undefined} aria-describedby={fieldErrors.projectType ? "contact-project-type-error" : undefined} value={draft.projectType} onChange={(event) => setField("projectType", event.target.value)}><option value="">Select a project type</option>{projectTypes.map((item) => <option key={item}>{item}</option>)}</select>{fieldErrors.projectType ? <span id="contact-project-type-error" className="contact-field-error">{fieldErrors.projectType}</span> : null}</label>
      <label className="mt-6 block text-sm font-medium text-foreground">What are you looking to build?<RequiredMark /><textarea className={`${inputClass} contact-field--build resize-y`} required aria-invalid={fieldErrors.buildIdea ? true : undefined} aria-describedby={fieldErrors.buildIdea ? "contact-build-error" : undefined} rows={5} maxLength={CONTACT_LIMITS.buildIdea} value={draft.buildIdea} onChange={(event) => setField("buildIdea", event.target.value)} />{fieldErrors.buildIdea ? <span id="contact-build-error" className="contact-field-error">{fieldErrors.buildIdea}</span> : null}</label>
      <label className="mt-6 block text-sm font-medium text-foreground">Brief / context<RequiredMark /><textarea className={`${inputClass} contact-field--context resize-y`} required aria-invalid={fieldErrors.message ? true : undefined} aria-describedby={fieldErrors.message ? "contact-context-error" : undefined} rows={7} maxLength={CONTACT_LIMITS.message} value={draft.message} onChange={(event) => setField("message", event.target.value)} />{fieldErrors.message ? <span id="contact-context-error" className="contact-field-error">{fieldErrors.message}</span> : null}</label>
      <div className="contact-honeypot" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={draft.website} onChange={(event) => setField("website", event.target.value)} /></label></div>

      <div className="mt-8 border-t border-border-subtle pt-6">
        {feedback ? <p id="enquiry-status" className={`text-sm leading-6 ${state === "error" ? "text-[color:oklch(0.8_0.09_28)]" : "text-foreground-soft"}`} role="status" aria-live="polite">{feedback}</p> : null}
        <button type="submit" disabled={state === "submitting"} className="button-primary mt-5">{state === "submitting" ? "Sending…" : "Send enquiry"}</button>
      </div>
    </form>
  );
}
