import assert from "node:assert/strict";
import { test } from "node:test";
import { normalizePublishedProject } from "./projects.logic.ts";

test("safely consumes a partially populated legacy project row", () => {
  assert.deepEqual(normalizePublishedProject({ id: 1, title: "AI Internship Match Assistant", slug: "ai-internship-match-assistant", summary: "Summary" }), {
    id: 1,
    title: "AI Internship Match Assistant",
    slug: "ai-internship-match-assistant",
    summary: "Summary",
    problem: null,
    approach: null,
    key_features: [],
    stack: [],
    outcome: null,
    status: "Live",
    live_url: null,
    github_url: null,
    cover_image_url: null,
    sort_order: 0,
  });
});
