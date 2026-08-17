import { queryOptions, useQuery } from "@tanstack/react-query";
import { SITE, bioFragments, capabilities, technologyGroups } from "@/lib/content";
import { getSiteProfile } from "@/lib/site-profile.functions";
import { parseBioFragments, parseCapabilities, parseTechnologyGroups } from "@/lib/site-profile.logic";

export const fallbackSiteProfile = {
  id: true, name: SITE.name, role: SITE.role, location: SITE.location,
  degree: SITE.degree, university: SITE.university, graduation_year: SITE.graduationYear,
  hero_tagline: SITE.tagline,
  hero_supporting: "A personal space for products, writing, experiments, and ideas in progress.",
  home_bridge_text: "Some ideas become products. Others become writing, experiments, or questions worth following.",
  home_work_blurb: "Products, prototypes, and applied AI in practice.",
  home_journal_blurb: "Writing, observations, experiments, and ideas in progress.",
  footer_connect_context: "AI product builds, prototypes, and product-focused collaboration.",
  connect_cta: "Connect for work",
  github_url: SITE.githubUrl, linkedin_url: SITE.linkedinUrl, instagram_url: SITE.instagramUrl,
  bio_fragments: [...bioFragments], capabilities: capabilities.map(({ heading, description }) => ({ title: heading, description })),
  technology_groups: technologyGroups.map((group) => ({ title: group.title, items: group.items.map((item) => ({ ...item })) })),
  updated_at: "",
} as const;

export const siteProfileQueryOptions = queryOptions({ queryKey: ["site-profile"], queryFn: () => getSiteProfile() });

export function useSiteProfile() {
  const query = useQuery(siteProfileQueryOptions);
  const profile = query.data ?? fallbackSiteProfile;
  return {
    ...profile,
    bio_fragments: parseBioFragments(profile.bio_fragments, fallbackSiteProfile.bio_fragments),
    capabilities: parseCapabilities(profile.capabilities, fallbackSiteProfile.capabilities),
    technology_groups: parseTechnologyGroups(profile.technology_groups, fallbackSiteProfile.technology_groups),
  };
}
