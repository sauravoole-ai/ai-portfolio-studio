export const CONTACT_LIMITS = { name: 100, email: 254, projectType: 100, buildIdea: 2000, message: 5000 } as const;

export type ContactDraft = { name: string; email: string; projectType: string; buildIdea: string; message: string; website: string };

export type ContactField = "name" | "email" | "projectType" | "buildIdea" | "message";
export type ContactFieldErrors = Partial<Record<ContactField, string>>;

export function getContactFieldErrors(draft: ContactDraft): ContactFieldErrors {
  const errors: ContactFieldErrors = {};
  const name = draft.name.trim();
  const email = draft.email.trim();
  const projectType = draft.projectType.trim();
  const buildIdea = draft.buildIdea.trim();
  const message = draft.message.trim();

  if (!name) errors.name = "Enter your name.";
  else if (name.length > CONTACT_LIMITS.name) errors.name = "Name is too long.";
  if (!email) errors.email = "Enter your email address.";
  else if (email.length > CONTACT_LIMITS.email) errors.email = "Email address is too long.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
  if (projectType.length > CONTACT_LIMITS.projectType) errors.projectType = "Project type is too long.";
  if (!buildIdea) errors.buildIdea = "Describe what you’re looking to build.";
  else if (buildIdea.length > CONTACT_LIMITS.buildIdea) errors.buildIdea = "Build description is too long.";
  if (!message) errors.message = "Add brief context for your message.";
  else if (message.length > CONTACT_LIMITS.message) errors.message = "Context is too long.";
  return errors;
}

export function validateContactDraft(draft: ContactDraft) {
  const name = draft.name.trim();
  const email = draft.email.trim();
  const buildIdea = draft.buildIdea.trim();
  const message = draft.message.trim();
  if (!name || !email || !buildIdea || !message) return "Name, email, build idea, and context are required.";
  if (name.length > CONTACT_LIMITS.name || email.length > CONTACT_LIMITS.email || draft.projectType.trim().length > CONTACT_LIMITS.projectType || buildIdea.length > CONTACT_LIMITS.buildIdea || message.length > CONTACT_LIMITS.message) return "One or more fields are too long.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address.";
  return null;
}

export function isHoneypotFilled(draft: ContactDraft) {
  return Boolean(draft.website.trim());
}

export function buildContactPayload(draft: ContactDraft) {
  return { name: draft.name.trim(), email: draft.email.trim(), project_type: draft.projectType.trim() || null, build_idea: draft.buildIdea.trim(), message: draft.message.trim() };
}
