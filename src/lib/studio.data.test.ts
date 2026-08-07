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
    const payload = { title: "Project", slug: "project", summary: "Summary", published: true };
    const created = mockClient({ data: { id: 1 } });
    await createStudioData(created.client).createProject(payload);
    assert.deepEqual(created.calls.find((call) => call.method === "insert")?.args, [payload]);

    const updated = mockClient({ data: { id: 1 } });
    await createStudioData(updated.client).updateProject(1, { published: false });
    assert.deepEqual(updated.calls.find((call) => call.method === "update")?.args, [{ published: false }]);
    assert.deepEqual(updated.calls.find((call) => call.method === "eq")?.args, ["id", 1]);
  });

  test("deletes only the selected project", async () => {
    const { client, calls } = mockClient();
    await createStudioData(client).deleteProject(7);
    assert.deepEqual(calls.find((call) => call.method === "eq")?.args, ["id", 7]);
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
