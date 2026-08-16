import { queryOptions, useQuery } from "@tanstack/react-query";
import { SITE } from "@/lib/content";
import { getSiteProfile } from "@/lib/site-profile.functions";

export const fallbackSiteProfile = {
  id: true, name: SITE.name, role: SITE.role, location: SITE.location,
  degree: SITE.degree, university: SITE.university, graduation_year: SITE.graduationYear,
  updated_at: "",
} as const;

export const siteProfileQueryOptions = queryOptions({ queryKey: ["site-profile"], queryFn: () => getSiteProfile() });

export function useSiteProfile() {
  const query = useQuery(siteProfileQueryOptions);
  return query.data ?? fallbackSiteProfile;
}
