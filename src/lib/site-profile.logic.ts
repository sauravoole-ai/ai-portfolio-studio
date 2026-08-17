import type { Json, Tables, TablesUpdate } from "@/integrations/supabase/types";

export type SiteProfile = Tables<"site_profile">;

export const SITE_PROFILE_ID = true as const;
export const SITE_PROFILE_LIMITS = { name: 100, role: 100, location: 100, degree: 160, university: 160, heroTagline: 160, heroSupporting: 300, connectCta: 80, url: 500 } as const;

export type Capability = { title: string; description: string };
export type TechnologyItem = { label: string | null; content: string };
export type TechnologyGroup = { title: string; items: TechnologyItem[] };

export type SiteProfileDraft = Pick<SiteProfile, "name" | "role" | "location" | "degree" | "university" | "graduation_year" | "hero_tagline" | "hero_supporting" | "connect_cta" | "github_url" | "linkedin_url" | "instagram_url"> & {
  bio_fragments: string[];
  capabilities: Capability[];
  technology_groups: TechnologyGroup[];
};

export function parseBioFragments(value: Json, fallback: readonly string[]): string[] {
  return Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === "string" && item.trim()) ? value.map((item) => String(item)) : [...fallback];
}

export function parseCapabilities(value: Json, fallback: readonly Capability[]): Capability[] {
  if (!Array.isArray(value) || value.length === 0) return fallback.map((item) => ({ ...item }));
  const valid = value.every((item) => item && typeof item === "object" && !Array.isArray(item) && typeof item.title === "string" && item.title.trim() && typeof item.description === "string" && item.description.trim());
  return valid ? value.map((item) => ({ title: String((item as { title: Json }).title), description: String((item as { description: Json }).description) })) : fallback.map((item) => ({ ...item }));
}

export function parseTechnologyGroups(value: Json, fallback: readonly TechnologyGroup[]): TechnologyGroup[] {
  if (!Array.isArray(value) || value.length === 0) return fallback.map((group) => ({ title: group.title, items: group.items.map((item) => ({ ...item })) }));
  const valid = value.every((group) => group && typeof group === "object" && !Array.isArray(group) && typeof group.title === "string" && group.title.trim() && Array.isArray(group.items) && group.items.length > 0 && group.items.every((item) => item && typeof item === "object" && !Array.isArray(item) && (item.label === null || typeof item.label === "string") && typeof item.content === "string" && item.content.trim()));
  return valid ? value.map((group) => ({ title: String((group as { title: Json }).title), items: ((group as { items: Json[] }).items).map((item) => ({ label: (item as { label: string | null }).label, content: String((item as { content: Json }).content) })) })) : fallback.map((group) => ({ title: group.title, items: group.items.map((item) => ({ ...item })) }));
}

function isUrl(value: string) {
  try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:"; } catch { return false; }
}

export function validateSiteProfile(draft: SiteProfileDraft) {
  const fields = [draft.name, draft.role, draft.location, draft.degree, draft.university, draft.hero_tagline, draft.hero_supporting, draft.connect_cta];
  if (fields.some((value) => !value.trim())) return "All profile fields are required.";
  if (draft.name.trim().length > SITE_PROFILE_LIMITS.name || draft.role.trim().length > SITE_PROFILE_LIMITS.role || draft.location.trim().length > SITE_PROFILE_LIMITS.location || draft.degree.trim().length > SITE_PROFILE_LIMITS.degree || draft.university.trim().length > SITE_PROFILE_LIMITS.university) return "One or more profile fields are too long.";
  if (!/^\d{4}$/.test(draft.graduation_year.trim())) return "Graduation year must use four digits.";
  if (draft.hero_tagline.trim().length > SITE_PROFILE_LIMITS.heroTagline || draft.hero_supporting.trim().length > SITE_PROFILE_LIMITS.heroSupporting || draft.connect_cta.trim().length > SITE_PROFILE_LIMITS.connectCta) return "One or more branding fields are too long.";
  if (![draft.github_url, draft.linkedin_url, draft.instagram_url].every((value) => value.length <= SITE_PROFILE_LIMITS.url && isUrl(value.trim()))) return "Social links must be valid URLs.";
  if (!draft.bio_fragments.length || draft.bio_fragments.some((item) => !item.trim())) return "Biography fragments cannot be empty.";
  if (!draft.capabilities.length || draft.capabilities.some((item) => !item.title.trim() || !item.description.trim())) return "Capabilities need a title and description.";
  if (!draft.technology_groups.length || draft.technology_groups.some((group) => !group.title.trim() || !group.items.length || group.items.some((item) => !item.content.trim()))) return "Technology groups and items cannot be empty.";
  return null;
}

export function buildSiteProfileUpdate(draft: SiteProfileDraft, now = () => new Date()): TablesUpdate<"site_profile"> {
  return {
    name: draft.name.trim(), role: draft.role.trim(), location: draft.location.trim(),
    degree: draft.degree.trim(), university: draft.university.trim(),
    graduation_year: draft.graduation_year.trim(), hero_tagline: draft.hero_tagline.trim(),
    hero_supporting: draft.hero_supporting.trim(), connect_cta: draft.connect_cta.trim(),
    github_url: draft.github_url.trim(), linkedin_url: draft.linkedin_url.trim(), instagram_url: draft.instagram_url.trim(),
    bio_fragments: draft.bio_fragments.map((item) => item.trim()),
    capabilities: draft.capabilities.map((item) => ({ title: item.title.trim(), description: item.description.trim() })),
    technology_groups: draft.technology_groups.map((group) => ({ title: group.title.trim(), items: group.items.map((item) => ({ label: item.label?.trim() || null, content: item.content.trim() })) })),
    updated_at: now().toISOString(),
  };
}
