export type PostDraft = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  cover: string;
  published: boolean;
  publishedAt: string;
};

export type ProjectDraft = {
  title: string;
  slug: string;
  summary: string;
  published: boolean;
};

export const studioQueryKeys = {
  posts: [["studio", "posts"], ["posts", "published"]] as const,
  projects: [["studio", "projects"], ["projects", "published"]] as const,
};

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function nextCreateSlug(title: string, currentSlug: string, slugEdited: boolean) {
  return slugEdited ? currentSlug : slugify(title);
}

export function validatePostDraft(draft: PostDraft) {
  return Boolean(
    draft.title.trim() &&
      draft.slug.trim() &&
      draft.excerpt.trim() &&
      draft.content.trim(),
  );
}

export function buildPostPayload(draft: PostDraft, now = () => new Date()) {
  const timestamp =
    draft.published && !draft.publishedAt
      ? now().toISOString()
      : draft.publishedAt
        ? new Date(draft.publishedAt).toISOString()
        : null;
  return {
    title: draft.title.trim(),
    slug: draft.slug.trim(),
    excerpt: draft.excerpt.trim(),
    content: draft.content.trim(),
    category: draft.category.trim() || null,
    cover_image_url: draft.cover.trim() || null,
    published: draft.published,
    published_at: timestamp,
  };
}

export function buildProjectPayload(draft: ProjectDraft) {
  return {
    title: draft.title.trim() || null,
    slug: draft.slug.trim() || null,
    summary: draft.summary.trim() || null,
    published: draft.published,
  };
}

export type StudioAuthState = "loading" | "signed-out" | "checking-admin" | "denied" | "authorized" | "error";

export function resolveStudioAuthState(
  sessionLoading: boolean,
  hasSession: boolean,
  adminState: "idle" | "pending" | "allowed" | "denied" | "error",
): StudioAuthState {
  if (sessionLoading) return "loading";
  if (!hasSession) return "signed-out";
  if (adminState === "error") return "error";
  if (adminState === "allowed") return "authorized";
  if (adminState === "denied") return "denied";
  return "checking-admin";
}

export function isDeleteConfirmed(confirmingId: string | number | null, recordId: string | number) {
  return confirmingId === recordId;
}
