import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { sanitizePortfolioAnalyticsEvent } from "./analytics.ts";

describe("portfolio analytics privacy policy", () => {
  test("drops the private Studio route", () => {
    assert.equal(
      sanitizePortfolioAnalyticsEvent({ url: "https://sauravkrjha.vercel.app/studio" }),
      null,
    );
  });

  test("drops nested Studio paths without over-matching public paths", () => {
    assert.equal(
      sanitizePortfolioAnalyticsEvent({ url: "https://sauravkrjha.vercel.app/studio/messages" }),
      null,
    );
    assert.deepEqual(
      sanitizePortfolioAnalyticsEvent({
        url: "https://sauravkrjha.vercel.app/studio-notes?source=test",
      }),
      { url: "https://sauravkrjha.vercel.app/studio-notes" },
    );
  });

  test("redacts query strings and fragments on public pages", () => {
    assert.deepEqual(
      sanitizePortfolioAnalyticsEvent({
        url: "https://sauravkrjha.vercel.app/projects/accomplish?ref=private#section",
      }),
      { url: "https://sauravkrjha.vercel.app/projects/accomplish" },
    );
  });

  test("supports relative URLs defensively", () => {
    assert.deepEqual(sanitizePortfolioAnalyticsEvent({ url: "/about?from=test#bio" }), {
      url: "/about",
    });
  });
});
