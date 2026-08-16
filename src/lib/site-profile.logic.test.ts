import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { buildSiteProfileUpdate, SITE_PROFILE_ID, validateSiteProfile, type SiteProfileDraft } from "./site-profile.logic.ts";

const valid: SiteProfileDraft = { name: " Saurav Kumar Jha ", role: " AI Product Builder ", location: " India ", degree: " B.Tech in Electronics & Communication Engineering ", university: " Tezpur University ", graduation_year: " 2027 " };

describe("Site profile behavior", () => {
  test("uses one fixed singleton identity", () => assert.equal(SITE_PROFILE_ID, true));
  test("validates required profile fields and a four-digit year", () => {
    assert.equal(validateSiteProfile(valid), null);
    assert.match(validateSiteProfile({ ...valid, university: " " }) ?? "", /required/);
    assert.match(validateSiteProfile({ ...valid, graduation_year: "27" }) ?? "", /four digits/);
  });
  test("builds a trimmed admin update payload", () => {
    const now = new Date("2026-08-16T10:00:00.000Z");
    assert.deepEqual(buildSiteProfileUpdate(valid, () => now), { name: "Saurav Kumar Jha", role: "AI Product Builder", location: "India", degree: "B.Tech in Electronics & Communication Engineering", university: "Tezpur University", graduation_year: "2027", updated_at: now.toISOString() });
  });
});
