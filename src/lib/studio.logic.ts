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
  problem: string;
  approach: string;
  keyFeatures: string;
  stack: string;
  outcome: string;
  status: string;
  liveUrl: string;
  githubUrl: string;
  coverImageUrl: string;
  published: boolean;
  sortOrder: string;
};

export const PROJECT_STATUSES = ["Live", "In Progress", "Archived"] as const;
export const MESSAGE_STATUSES = ["New", "Read", "Archived"] as const;

export function isMessageStatus(value: string): value is (typeof MESSAGE_STATUSES)[number] {
  return MESSAGE_STATUSES.includes(value as (typeof MESSAGE_STATUSES)[number]);
}

export function linesToArray(value: string) {
  return value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}

function isOptionalUrlValid(value: string) {
  if (!value.trim()) return true;
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateProjectDraft(draft: ProjectDraft) {
  if (!draft.title.trim() || !draft.slug.trim() || !draft.summary.trim()) {
    return "Title, slug, and summary are required.";
  }
  if (!PROJECT_STATUSES.includes(draft.status as (typeof PROJECT_STATUSES)[number])) {
    return "Choose a valid project status.";
  }
  if (![draft.liveUrl, draft.githubUrl, draft.coverImageUrl].every(isOptionalUrlValid)) {
    return "Project URLs must be valid http or https URLs.";
  }
  return null;
}

export const studioQueryKeys = {
  posts: [["studio", "posts"], ["posts", "published"]] as const,
  projects: [["studio", "projects"], ["projects", "published"]] as const,
  messages: [["studio", "messages"]] as const,
  profile: [["studio", "profile"], ["site-profile"]] as const,
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
    title: draft.title.trim(),
    slug: draft.slug.trim(),
    summary: draft.summary.trim(),
    problem: draft.problem.trim() || null,
    approach: draft.approach.trim() || null,
    key_features: linesToArray(draft.keyFeatures),
    stack: linesToArray(draft.stack),
    outcome: draft.outcome.trim() || null,
    status: draft.status,
    live_url: draft.liveUrl.trim() || null,
    github_url: draft.githubUrl.trim() || null,
    cover_image_url: draft.coverImageUrl.trim() || null,
    published: draft.published,
    sort_order: Number.parseInt(draft.sortOrder, 10) || 0,
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
