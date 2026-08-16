import type { Tables, TablesUpdate } from "@/integrations/supabase/types";

export type SiteProfile = Tables<"site_profile">;

export const SITE_PROFILE_ID = true as const;
export const SITE_PROFILE_LIMITS = { name: 100, role: 100, location: 100, degree: 160, university: 160 } as const;

export type SiteProfileDraft = Pick<SiteProfile, "name" | "role" | "location" | "degree" | "university" | "graduation_year">;

export function validateSiteProfile(draft: SiteProfileDraft) {
  const fields = [draft.name, draft.role, draft.location, draft.degree, draft.university];
  if (fields.some((value) => !value.trim())) return "All profile fields are required.";
  if (draft.name.trim().length > SITE_PROFILE_LIMITS.name || draft.role.trim().length > SITE_PROFILE_LIMITS.role || draft.location.trim().length > SITE_PROFILE_LIMITS.location || draft.degree.trim().length > SITE_PROFILE_LIMITS.degree || draft.university.trim().length > SITE_PROFILE_LIMITS.university) return "One or more profile fields are too long.";
  if (!/^\d{4}$/.test(draft.graduation_year.trim())) return "Graduation year must use four digits.";
  return null;
}

export function buildSiteProfileUpdate(draft: SiteProfileDraft, now = () => new Date()): TablesUpdate<"site_profile"> {
  return {
    name: draft.name.trim(), role: draft.role.trim(), location: draft.location.trim(),
    degree: draft.degree.trim(), university: draft.university.trim(),
    graduation_year: draft.graduation_year.trim(), updated_at: now().toISOString(),
  };
}
