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
  type PostDraft,
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
  test("uses only actual project fields and trims nullable values", () => {
    assert.deepEqual(
      buildProjectPayload({ title: " Project ", slug: " project ", summary: " Summary ", published: true }),
      { title: "Project", slug: "project", summary: "Summary", published: true },
    );
  });

  test("converts empty optional project values to null", () => {
    assert.deepEqual(buildProjectPayload({ title: " ", slug: "", summary: " ", published: false }), {
      title: null,
      slug: null,
      summary: null,
      published: false,
    });
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
  });
});
