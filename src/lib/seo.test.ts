import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { describe, test } from "node:test";
import {
  PRODUCTION_ORIGIN,
  SOCIAL_IMAGE_URL,
  absoluteUrl,
  buildProfilePageJsonLd,
  buildPublicPageHead,
  buildSitemapXml,
} from "./seo.ts";

describe("production discoverability", () => {
  test("builds absolute canonical and fallback social metadata", () => {
    const head = buildPublicPageHead({ path: "/projects/example", title: "Example", description: "Summary" });
    assert.equal(head.links[0]?.href, `${PRODUCTION_ORIGIN}/projects/example`);
    assert(head.meta.some((item) => item.property === "og:image" && item.content === SOCIAL_IMAGE_URL));
  });

  test("uses a valid public cover and rejects a local cover", () => {
    const publicHead = buildPublicPageHead({ path: "/writing/post", title: "Post", description: "Excerpt", type: "article", image: "https://images.example.com/post.webp" });
    assert(publicHead.meta.some((item) => item.property === "og:image" && item.content === "https://images.example.com/post.webp"));
    const localHead = buildPublicPageHead({ path: "/writing/post", title: "Post", description: "Excerpt", image: "http://localhost/post.webp" });
    assert(localHead.meta.some((item) => item.property === "og:image" && item.content === SOCIAL_IMAGE_URL));
  });

  test("sitemap includes published content and excludes drafts and Studio", () => {
    const xml = buildSitemapXml(
      [{ slug: "published-project", published: true }, { slug: "draft-project", published: false }],
      [{ slug: "published-post", published: true }, { slug: "draft-post", published: false }],
    );
    assert.match(xml, new RegExp(absoluteUrl("/projects/published-project")));
    assert.match(xml, new RegExp(absoluteUrl("/writing/published-post")));
    assert.doesNotMatch(xml, /draft-project|draft-post|\/studio/);
  });

  test("ProfilePage keeps only validated public social URLs", () => {
    const data = buildProfilePageJsonLd({ name: "Saurav Kumar Jha", role: "AI Product Builder", github_url: "https://github.com/sauravoole-ai", linkedin_url: "not-a-url", instagram_url: "https://www.instagram.com/sauravjha_ai/" });
    assert.equal(data["@type"], "ProfilePage");
    assert.deepEqual(data.mainEntity.sameAs, ["https://github.com/sauravoole-ai", "https://www.instagram.com/sauravjha_ai/"]);
  });

  test("robots references the production sitemap", () => {
    const robots = readFileSync(new URL("../../public/robots.txt", import.meta.url), "utf8");
    assert.match(robots, new RegExp(`${PRODUCTION_ORIGIN}/sitemap\\.xml`));
    assert.match(robots, /Allow: \/(?:\r?\n|$)/);
  });

  test("portfolio SVG favicon replaces the obsolete Lovable icon", () => {
    assert.equal(existsSync(new URL("../../public/favicon.svg", import.meta.url)), true);
    assert.equal(existsSync(new URL("../../public/favicon.ico", import.meta.url)), false);
    const rootSource = readFileSync(new URL("../routes/__root.tsx", import.meta.url), "utf8");
    assert.match(rootSource, /href: "\/favicon\.svg"/);
    assert.doesNotMatch(rootSource, /favicon\.ico/);
  });
});
