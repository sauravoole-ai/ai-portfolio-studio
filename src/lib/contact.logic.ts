export const CONTACT_LIMITS = { name: 100, email: 254, message: 5000 } as const;

export type ContactDraft = { name: string; email: string; message: string; website: string };

export function validateContactDraft(draft: ContactDraft) {
  const name = draft.name.trim();
  const email = draft.email.trim();
  const message = draft.message.trim();
  if (!name || !email || !message) return "Name, email, and message are required.";
  if (name.length > CONTACT_LIMITS.name || email.length > CONTACT_LIMITS.email || message.length > CONTACT_LIMITS.message) return "One or more fields are too long.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address.";
  return null;
}

export function isHoneypotFilled(draft: ContactDraft) {
  return Boolean(draft.website.trim());
}

export function buildContactPayload(draft: ContactDraft) {
  return { name: draft.name.trim(), email: draft.email.trim(), message: draft.message.trim() };
}
