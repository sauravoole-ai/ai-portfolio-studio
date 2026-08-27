import assert from "node:assert/strict";
import { test } from "node:test";
import { normalizePublishedProject, selectLauncherProducts, selectProjectDetailDirections } from "./projects.logic.ts";
import type { PublishedProject } from "./projects.functions.ts";

function launcherProject(overrides: Partial<PublishedProject>): PublishedProject {
  return normalizePublishedProject({
    id: overrides.id ?? 1,
    title: overrides.title ?? "Product",
    live_url: "https://example.com",
    show_in_product_launcher: true,
    ...overrides,
  });
}

function navigationProject(id: number, title: string, slug: string, sortOrder: number): PublishedProject {
  return normalizePublishedProject({ id, title, slug, sort_order: sortOrder });
}

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
    show_in_product_launcher: false,
    product_sort_order: 0,
  });
});

test("selects eligible launcher products in deterministic launcher order without mutating input", () => {
  const excludedHidden = launcherProject({ id: 1, title: "Hidden", show_in_product_launcher: false });
  const excludedMissingUrl = launcherProject({ id: 2, title: "Missing URL", live_url: null });
  const excludedBlankUrl = launcherProject({ id: 3, title: "Blank URL", live_url: "   " });
  const alpha = launcherProject({ id: 4, title: "Alpha", product_sort_order: 2, sort_order: 3 });
  const beta = launcherProject({ id: 5, title: "Beta", product_sort_order: 1, sort_order: 5 });
  const gamma = launcherProject({ id: 6, title: "Gamma", product_sort_order: 2, sort_order: 1 });
  const zeta = launcherProject({ id: 7, title: "Zeta", product_sort_order: 2, sort_order: 3 });
  const input = [alpha, excludedHidden, zeta, excludedMissingUrl, beta, excludedBlankUrl, gamma];
  const originalOrder = [...input];

  assert.deepEqual(selectLauncherProducts(input).map((project) => project.title), ["Beta", "Gamma", "Alpha", "Zeta"]);
  assert.deepEqual(input, originalOrder);
});

test("maps project-detail navigation in the supplied published-project order without wrapping", () => {
  const projects = [
    navigationProject(1, "First Project", "z-first", 30),
    navigationProject(2, "Second Project", "a-second", 10),
    navigationProject(3, "Final Project", "m-final", 20),
  ];
  const originalOrder = [...projects];

  assert.deepEqual(selectProjectDetailDirections(projects, "z-first"), {
    previous: { to: "/projects", label: "Back to Work" },
    next: { to: "/projects/a-second", label: "Next: Second Project" },
  });
  assert.deepEqual(selectProjectDetailDirections(projects, "a-second"), {
    previous: { to: "/projects/z-first", label: "Previous: First Project" },
    next: { to: "/projects/m-final", label: "Next: Final Project" },
  });
  assert.deepEqual(selectProjectDetailDirections(projects, "m-final"), {
    previous: { to: "/projects/a-second", label: "Previous: Second Project" },
    next: null,
  });
  assert.deepEqual(projects, originalOrder);
});
