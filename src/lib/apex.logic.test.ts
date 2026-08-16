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
    assert.deepEqual(getProjectHighlights("AI Internship Match Assistant", []), ["Embeddings", "Vector Retrieval", "pypdf"]);
    assert.deepEqual(getProjectHighlights("Future project", ["React", "Supabase", "Flask", "Render"]), ["React", "Supabase", "Flask"]);
  });
  test("keeps Home forward-only and maps top-level routes", () => {
    assert.equal(getRouteDirections("/").previous, null);
    assert.deepEqual(getRouteDirections("/projects"), { previous: { to: "/", label: "Previous: Home" }, next: { to: "/writing", label: "Next: Journal" } });
    assert.deepEqual(getRouteDirections("/contact").next, { to: "/", label: "Next: Home" });
  });
  test("uses contextual detail-route back links", () => {
    assert.deepEqual(getRouteDirections("/projects/example").previous, { to: "/projects", label: "Back to Work" });
    assert.deepEqual(getRouteDirections("/writing/example").previous, { to: "/writing", label: "Back to Journal" });
  });
});
