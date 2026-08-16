import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  buildPostPayload,
  buildProjectPayload,
  isDeleteConfirmed,
  nextCreateSlug,
  resolveStudioAuthState,
  slugify,
  studioQueryKeys,
  validatePostDraft,
  validateProjectDraft,
  linesToArray,
  isMessageStatus,
  type PostDraft,
  type ProjectDraft,
} from "./studio.logic.ts";

const validPost: PostDraft = {
  title: "  A Journal Entry  ",
  slug: "  a-journal-entry  ",
  excerpt: "  An excerpt.  ",
  content: "  Body text.  ",
  category: "  Notes  ",
  cover: "  https://example.test/cover.webp  ",
  published: false,
  publishedAt: "",
};

describe("Studio post behavior", () => {
  test("generates normalized slugs from titles", () => {
    assert.equal(slugify("  Café & Product Notes  "), "cafe-product-notes");
  });

  test("updates an untouched create slug from the title", () => {
    assert.equal(nextCreateSlug("New Entry", "", false), "new-entry");
  });

  test("preserves a manually edited slug", () => {
    assert.equal(nextCreateSlug("Changed Title", "manual-slug", true), "manual-slug");
  });

  test("rejects each missing required post field", () => {
    for (const field of ["title", "slug", "excerpt", "content"] as const) {
      assert.equal(validatePostDraft({ ...validPost, [field]: "  " }), false);
    }
  });

  test("accepts a complete post draft", () => {
    assert.equal(validatePostDraft(validPost), true);
  });

  test("trims draft payload fields and keeps a null publication date", () => {
    assert.deepEqual(buildPostPayload(validPost), {
      title: "A Journal Entry",
      slug: "a-journal-entry",
      excerpt: "An excerpt.",
      content: "Body text.",
      category: "Notes",
      cover_image_url: "https://example.test/cover.webp",
      published: false,
      published_at: null,
    });
  });

  test("assigns the current timestamp when publishing without one", () => {
    const now = new Date("2026-08-07T10:30:00.000Z");
    const payload = buildPostPayload({ ...validPost, published: true }, () => now);
    assert.equal(payload.published_at, now.toISOString());
  });

  test("preserves an existing publication timestamp", () => {
    const existing = "2026-07-01T09:15:00.000Z";
    const payload = buildPostPayload(
      { ...validPost, published: true, publishedAt: existing },
      () => new Date("2026-08-07T10:30:00.000Z"),
    );
    assert.equal(payload.published_at, existing);
  });
});

describe("Studio project and authorization behavior", () => {
  const validProject: ProjectDraft = { title: " Project ", slug: " project ", summary: " Summary ", problem: " Problem ", approach: " Approach ", keyFeatures: " Search\n Alerts ", stack: " React\nSupabase", outcome: " Learning ", status: "Live", liveUrl: "", githubUrl: " https://github.com/example/project ", coverImageUrl: "", published: true, sortOrder: "4" };

  test("builds every project field and converts human-editable arrays", () => {
    assert.deepEqual(buildProjectPayload(validProject), { title: "Project", slug: "project", summary: "Summary", problem: "Problem", approach: "Approach", key_features: ["Search", "Alerts"], stack: ["React", "Supabase"], outcome: "Learning", status: "Live", live_url: null, github_url: "https://github.com/example/project", cover_image_url: null, published: true, sort_order: 4 });
    assert.deepEqual(linesToArray(" first\n\n second \r\n"), ["first", "second"]);
  });

  test("requires title, slug, and summary", () => {
    for (const field of ["title", "slug", "summary"] as const) assert.match(validateProjectDraft({ ...validProject, [field]: " " }) ?? "", /required/);
  });

  test("accepts allowed statuses and rejects invalid statuses", () => {
    for (const status of ["Live", "In Progress", "Archived"]) assert.equal(validateProjectDraft({ ...validProject, status }), null);
    assert.match(validateProjectDraft({ ...validProject, status: "Planned" }) ?? "", /valid project status/);
  });

  test("accepts blank optional URLs and rejects invalid supplied URLs", () => {
    assert.equal(validateProjectDraft({ ...validProject, githubUrl: "" }), null);
    assert.match(validateProjectDraft({ ...validProject, liveUrl: "not-a-url" }) ?? "", /valid http or https/);
  });

  test("represents all authorization states without authorizing early", () => {
    assert.equal(resolveStudioAuthState(true, false, "idle"), "loading");
    assert.equal(resolveStudioAuthState(false, false, "idle"), "signed-out");
    assert.equal(resolveStudioAuthState(false, true, "pending"), "checking-admin");
    assert.equal(resolveStudioAuthState(false, true, "denied"), "denied");
    assert.equal(resolveStudioAuthState(false, true, "allowed"), "authorized");
    assert.equal(resolveStudioAuthState(false, true, "error"), "error");
  });

  test("requires the selected record id before confirming deletion", () => {
    assert.equal(isDeleteConfirmed(null, "post-1"), false);
    assert.equal(isDeleteConfirmed("post-2", "post-1"), false);
    assert.equal(isDeleteConfirmed("post-1", "post-1"), true);
  });

  test("declares Studio and public invalidation keys for both resources", () => {
    assert.deepEqual(studioQueryKeys.posts, [["studio", "posts"], ["posts", "published"]]);
    assert.deepEqual(studioQueryKeys.projects, [["studio", "projects"], ["projects", "published"]]);
    assert.deepEqual(studioQueryKeys.messages, [["studio", "messages"]]);
    assert.deepEqual(studioQueryKeys.profile, [["studio", "profile"], ["site-profile"]]);
  });

  test("accepts only allowed message statuses", () => {
    for (const status of ["New", "Read", "Archived"]) assert.equal(isMessageStatus(status), true);
    assert.equal(isMessageStatus("Deleted"), false);
  });
});
