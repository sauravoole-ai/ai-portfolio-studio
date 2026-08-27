import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { getProjectHighlights, getRouteDirections, selectFeaturedProjects, selectLatestGenuinePost } from "./apex.logic.ts";

describe("Apex public presentation behavior", () => {
  test("selects the first two projects by sort order", () => assert.deepEqual(selectFeaturedProjects([{ title: "C", sort_order: 3 }, { title: "A", sort_order: 1 }, { title: "B", sort_order: 2 }]).map((item) => item.title), ["A", "B"]));
  test("selects one latest genuine post and hides when none exists", () => {
    assert.equal(selectLatestGenuinePost([{ title: "Journal QA Test", slug: "journal-qa-test" }, { title: "Real note", slug: "real-note" }])?.title, "Real note");
    assert.equal(selectLatestGenuinePost([]), null);
    assert.equal(selectLatestGenuinePost([{ title: "Journal QA Test", slug: "journal-qa-test" }]), null);
  });
  test("uses locked highlights with a safe stored-stack fallback", () => {
    assert.deepEqual(getProjectHighlights("AI Internship Match Assistant", []), [
      "Document Chunking",
      "Lexical Retrieval",
      "RAG-style Follow-up",
    ]);
    assert.deepEqual(getProjectHighlights("Future project", ["React", "Supabase", "Flask", "Render"]), ["React", "Supabase", "Flask"]);
  });
  test("uses ACComplish's curated Work-card highlights", () => {
    assert.deepEqual(getProjectHighlights("ACComplish", ["Fallback one", "Fallback two", "Fallback three"]), [
      "Adaptive Study Planning",
      "Search & Resource Curation",
      "LLM Reliability & Validation",
    ]);
  });
  test("keeps Home forward-only and maps top-level routes", () => {
    assert.deepEqual(getRouteDirections("/"), { previous: null, next: { to: "/projects", label: "Next: Work" } });
    assert.deepEqual(getRouteDirections("/projects"), { previous: { to: "/", label: "Previous: Home" }, next: { to: "/writing", label: "Next: Journal" } });
    assert.deepEqual(getRouteDirections("/writing"), { previous: { to: "/projects", label: "Previous: Work" }, next: { to: "/about", label: "Next: About" } });
    assert.deepEqual(getRouteDirections("/about"), { previous: { to: "/writing", label: "Previous: Journal" }, next: { to: "/contact", label: "Next: Contact" } });
    assert.deepEqual(getRouteDirections("/contact"), { previous: { to: "/about", label: "Previous: About" }, next: { to: "/", label: "Next: Home" } });
  });
  test("maps detail routes to their parent sections", () => {
    assert.deepEqual(getRouteDirections("/projects/accomplish").previous, { to: "/projects", label: "Back to Work" });
    assert.deepEqual(getRouteDirections("/writing/example-post").previous, { to: "/writing", label: "Back to Journal" });
    assert.equal(getRouteDirections("/projects/example").next, null);
    assert.deepEqual(getRouteDirections("/writing/example").next, { to: "/about", label: "Next: About" });
  });
});
