import { SITE } from "./content.ts";

export const PRODUCTION_ORIGIN =
  "https://studio.sauravkrjha.workers.dev";
export const SOCIAL_IMAGE_PATH = "/home-studio-master-hq.webp";
export const SOCIAL_IMAGE_URL = `${PRODUCTION_ORIGIN}${SOCIAL_IMAGE_PATH}`;
export const SOCIAL_IMAGE_WIDTH = "2400";
export const SOCIAL_IMAGE_HEIGHT = "1800";
export const SOCIAL_IMAGE_TYPE = "image/webp";

export function absoluteUrl(path = "/") {
  if (path === "/") return PRODUCTION_ORIGIN;
  return new URL(path, `${PRODUCTION_ORIGIN}/`).toString();
}

export function isPublicHttpsUrl(value: string | null | undefined) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname !== "localhost" && !url.hostname.endsWith(".local");
  } catch {
    return false;
  }
}

export function buildPublicPageHead({
  path,
  title,
  description,
  type = "website",
  image,
  imageAlt = title,
  publishedAt,
}: {
  path: string;
  title: string;
  description: string;
  type?: "website" | "article";
  image?: string | null;
  imageAlt?: string;
  publishedAt?: string | null;
}) {
  const canonical = absoluteUrl(path);
  const useSpecificImage = isPublicHttpsUrl(image);
  const socialImage = useSpecificImage ? image! : SOCIAL_IMAGE_URL;
  const meta = [
    { title },
    { name: "description", content: description },
    { property: "og:type", content: type },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: canonical },
    { property: "og:image", content: socialImage },
    { property: "og:image:alt", content: imageAlt },
    ...(!useSpecificImage
      ? [
          { property: "og:image:width", content: SOCIAL_IMAGE_WIDTH },
          { property: "og:image:height", content: SOCIAL_IMAGE_HEIGHT },
          { property: "og:image:type", content: SOCIAL_IMAGE_TYPE },
        ]
      : []),
    ...(type === "article" && publishedAt
      ? [{ property: "article:published_time", content: publishedAt }]
      : []),
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: socialImage },
    { name: "twitter:image:alt", content: imageAlt },
  ];

  return { meta, links: [{ rel: "canonical", href: canonical }] };
}

type SitemapRecord = { slug: string | null; published?: boolean };

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function buildSitemapXml(projects: readonly SitemapRecord[], posts: readonly SitemapRecord[]) {
  const staticPaths = ["/", "/projects", "/writing", "/about", "/contact"];
  const projectPaths = projects
    .filter((item) => item.published !== false && Boolean(item.slug))
    .map((item) => `/projects/${encodeURIComponent(item.slug!)}`);
  const postPaths = posts
    .filter((item) => item.published !== false && Boolean(item.slug))
    .map((item) => `/writing/${encodeURIComponent(item.slug!)}`);
  const paths = [...new Set([...staticPaths, ...projectPaths, ...postPaths])];
  const urls = paths.map((path) => `  <url><loc>${escapeXml(absoluteUrl(path))}</loc></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

type ProfileJsonLdInput = {
  name: string;
  role: string;
  github_url: string;
  linkedin_url: string;
  instagram_url: string;
};

export function buildProfilePageJsonLd(profile: ProfileJsonLdInput) {
  const sameAs = [profile.github_url, profile.linkedin_url, profile.instagram_url].filter(
    isPublicHttpsUrl,
  );
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: absoluteUrl("/about"),
    mainEntity: {
      "@type": "Person",
      name: profile.name,
      description: profile.role,
      ...(sameAs.length ? { sameAs } : {}),
    },
  };
}

export const HOME_TITLE = `${SITE.name} — ${SITE.role}`;
export const HOME_DESCRIPTION = `${SITE.name}, ${SITE.role}. ${SITE.tagline}`;
