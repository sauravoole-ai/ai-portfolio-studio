import assert from "node:assert/strict";
import { test } from "node:test";
import { selectJournalPreviousDirection } from "./posts.logic.ts";

test("maps Journal previous navigation in canonical incoming order without wrapping or mutation", () => {
  const posts = [
    { title: "First Post", slug: "z-first" },
    { title: "Second Post", slug: "a-second" },
    { title: "Final Post", slug: "m-final" },
  ];
  const originalOrder = [...posts];

  assert.deepEqual(selectJournalPreviousDirection(posts, "z-first"), {
    to: "/writing",
    label: "Back to Journal",
  });
  assert.deepEqual(selectJournalPreviousDirection(posts, "a-second"), {
    to: "/writing/z-first",
    label: "Previous: First Post",
  });
  assert.deepEqual(selectJournalPreviousDirection(posts, "m-final"), {
    to: "/writing/a-second",
    label: "Previous: Second Post",
  });
  assert.deepEqual(posts, originalOrder);
});
