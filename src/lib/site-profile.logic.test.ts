import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { buildSiteProfileUpdate, parseBioFragments, parseCapabilities, parseTechnologyGroups, SITE_PROFILE_ID, validateSiteProfile, type SiteProfileDraft } from "./site-profile.logic.ts";

const valid: SiteProfileDraft = {
  name: " Saurav Kumar Jha ", role: " AI Product Builder ", location: " India ", degree: " B.Tech in Electronics & Communication Engineering ", university: " Tezpur University ", graduation_year: " 2027 ",
  hero_tagline: " Translating ideas into AI products. ", hero_supporting: " A personal space for products and writing. ", connect_cta: " Connect for work ",
  github_url: " https://github.com/sauravoole-ai ", linkedin_url: " https://www.linkedin.com/in/saurav-kumarjha/ ", instagram_url: " https://www.instagram.com/sauravjha_ai/ ",
  bio_fragments: [" First fragment ", " Second fragment "],
  capabilities: [{ title: " AI Product Development ", description: " Product work. " }],
  technology_groups: [{ title: " Languages ", items: [{ label: null, content: " Python · TypeScript " }] }],
};

describe("Site profile behavior", () => {
  test("uses one fixed singleton identity", () => assert.equal(SITE_PROFILE_ID, true));
  test("validates required profile fields and a four-digit year", () => {
    assert.equal(validateSiteProfile(valid), null);
    assert.match(validateSiteProfile({ ...valid, university: " " }) ?? "", /required/);
    assert.match(validateSiteProfile({ ...valid, graduation_year: "27" }) ?? "", /four digits/);
    assert.match(validateSiteProfile({ ...valid, github_url: "not-a-url" }) ?? "", /valid URLs/);
    assert.match(validateSiteProfile({ ...valid, bio_fragments: [] }) ?? "", /Biography/);
    assert.match(validateSiteProfile({ ...valid, capabilities: [{ title: "", description: "Copy" }] }) ?? "", /Capabilities/);
  });
  test("builds a trimmed admin update payload", () => {
    const now = new Date("2026-08-16T10:00:00.000Z");
    assert.deepEqual(buildSiteProfileUpdate(valid, () => now), { name: "Saurav Kumar Jha", role: "AI Product Builder", location: "India", degree: "B.Tech in Electronics & Communication Engineering", university: "Tezpur University", graduation_year: "2027", hero_tagline: "Translating ideas into AI products.", hero_supporting: "A personal space for products and writing.", connect_cta: "Connect for work", github_url: "https://github.com/sauravoole-ai", linkedin_url: "https://www.linkedin.com/in/saurav-kumarjha/", instagram_url: "https://www.instagram.com/sauravjha_ai/", bio_fragments: ["First fragment", "Second fragment"], capabilities: [{ title: "AI Product Development", description: "Product work." }], technology_groups: [{ title: "Languages", items: [{ label: null, content: "Python · TypeScript" }] }], updated_at: now.toISOString() });
  });
  test("validates structured branding and falls back safely", () => {
    assert.deepEqual(parseBioFragments(["One", "Two"], ["Fallback"]), ["One", "Two"]);
    assert.deepEqual(parseBioFragments({ invalid: true }, ["Fallback"]), ["Fallback"]);
    assert.deepEqual(parseCapabilities([{ title: "Build", description: "Useful products" }], []), [{ title: "Build", description: "Useful products" }]);
    assert.deepEqual(parseTechnologyGroups([{ title: "Web", items: [{ label: null, content: "React" }] }], []), [{ title: "Web", items: [{ label: null, content: "React" }] }]);
  });
});
