import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { createStudioData, type StudioDataClient } from "./studio.data.ts";

type Call = { method: string; args: unknown[] };

function mockClient(result: { data?: unknown; error?: { message: string } | null } = {}) {
  const calls: Call[] = [];
  const response = { data: result.data ?? null, error: result.error ?? null };
  const builder: Record<string, (...args: unknown[]) => unknown> = {};
  for (const method of ["select", "eq", "maybeSingle", "order", "insert", "update", "delete", "single"]) {
    builder[method] = (...args: unknown[]) => {
      calls.push({ method, args });
      return builder;
    };
  }
  Object.assign(builder, {
    then(resolve: (value: typeof response) => void) {
      resolve(response);
    },
  });
  const client = {
    from(table: string) {
      calls.push({ method: "from", args: [table] });
      return builder;
    },
  } as unknown as StudioDataClient;
  return { client, calls };
}

describe("Studio mocked Supabase data paths", () => {
  test("checks only the signed-in user's admin membership", async () => {
    const { client, calls } = mockClient({ data: { user_id: "user-1" } });
    assert.equal(await createStudioData(client).isAdmin("user-1"), true);
    assert.deepEqual(calls.find((call) => call.method === "eq")?.args, ["user_id", "user-1"]);
  });

  test("creates a post with the supplied payload", async () => {
    const payload = { title: "Post", slug: "post" };
    const { client, calls } = mockClient({ data: { id: "post-1", ...payload } });
    await createStudioData(client).createPost(payload);
    assert.deepEqual(calls.find((call) => call.method === "insert")?.args, [payload]);
  });

  test("updates the selected post and refreshes updated_at", async () => {
    const now = new Date("2026-08-07T12:00:00.000Z");
    const { client, calls } = mockClient({ data: { id: "post-1" } });
    await createStudioData(client, () => now).updatePost("post-1", { title: "Updated" });
    assert.deepEqual(calls.find((call) => call.method === "update")?.args, [
      { title: "Updated", updated_at: now.toISOString() },
    ]);
    assert.deepEqual(calls.find((call) => call.method === "eq")?.args, ["id", "post-1"]);
  });

  test("deletes only the selected post", async () => {
    const { client, calls } = mockClient();
    await createStudioData(client).deletePost("post-1");
    assert.deepEqual(calls.find((call) => call.method === "eq")?.args, ["id", "post-1"]);
  });

  test("creates and updates projects using the actual schema payload", async () => {
    const payload = { title: "Project", slug: "project", summary: "Summary", problem: null, approach: "Built iteratively", key_features: ["Search"], stack: ["React"], outcome: null, status: "Live", live_url: null, github_url: null, cover_image_url: null, published: true, sort_order: 2 };
    const created = mockClient({ data: { id: 1 } });
    await createStudioData(created.client).createProject(payload);
    assert.deepEqual(created.calls.find((call) => call.method === "insert")?.args, [payload]);

    const updated = mockClient({ data: { id: 1 } });
    await createStudioData(updated.client).updateProject(1, { published: false });
    assert.deepEqual(updated.calls.find((call) => call.method === "update")?.args, [{ published: false }]);
    assert.deepEqual(updated.calls.find((call) => call.method === "eq")?.args, ["id", 1]);
  });

  test("lists projects in sort order with a stable secondary order", async () => {
    const { client, calls } = mockClient({ data: [] });
    await createStudioData(client).listProjects();
    assert.deepEqual(calls.filter((call) => call.method === "order").map((call) => call.args), [["sort_order", { ascending: true }], ["created_at", { ascending: false }]]);
  });

  test("deletes only the selected project", async () => {
    const { client, calls } = mockClient();
    await createStudioData(client).deleteProject(7);
    assert.deepEqual(calls.find((call) => call.method === "eq")?.args, ["id", 7]);
  });

  test("lists newest messages first and updates only the selected status", async () => {
    const listed = mockClient({ data: [] });
    await createStudioData(listed.client).listMessages();
    assert.deepEqual(listed.calls.find((call) => call.method === "order")?.args, ["created_at", { ascending: false }]);
    const updated = mockClient({ data: { id: "message-1", status: "Read" } });
    await createStudioData(updated.client).updateMessageStatus("message-1", "Read");
    assert.deepEqual(updated.calls.find((call) => call.method === "update")?.args, [{ status: "Read" }]);
    assert.deepEqual(updated.calls.find((call) => call.method === "eq")?.args, ["id", "message-1"]);
  });

  test("deletes only the selected message", async () => {
    const { client, calls } = mockClient();
    await createStudioData(client).deleteMessage("message-2");
    assert.deepEqual(calls.find((call) => call.method === "eq")?.args, ["id", "message-2"]);
  });

  test("loads and updates only the singleton site profile", async () => {
    const loaded = mockClient({ data: { id: true, name: "Saurav" } });
    await createStudioData(loaded.client).getSiteProfile();
    assert.deepEqual(loaded.calls.find((call) => call.method === "eq")?.args, ["id", true]);
    const updated = mockClient({ data: { id: true, name: "Updated" } });
    await createStudioData(updated.client).updateSiteProfile({ name: "Updated" });
    assert.deepEqual(updated.calls.find((call) => call.method === "update")?.args, [{ name: "Updated" }]);
    assert.deepEqual(updated.calls.find((call) => call.method === "eq")?.args, ["id", true]);
  });

  test("returns controlled errors without exposing raw Supabase messages", async () => {
    const { client } = mockClient({ error: { message: "sensitive database detail" } });
    const originalError = console.error;
    console.error = () => undefined;
    try {
      await assert.rejects(createStudioData(client).deletePost("post-1"), {
        message: "The operation could not be completed.",
      });
    } finally {
      console.error = originalError;
    }
  });
});
