import assert from "node:assert/strict";
import { test } from "node:test";
import { submitContactMessage, type ContactDataClient } from "./contact.data.ts";

function mockClient(error: { message: string } | null = null) {
  let inserted: unknown;
  const client = { from(table: string) { assert.equal(table, "contact_messages"); return { insert(values: unknown) { inserted = values; return Promise.resolve({ error }); } }; } } as unknown as ContactDataClient;
  return { client, inserted: () => inserted };
}

test("inserts only the controlled contact payload", async () => {
  const mock = mockClient();
  const payload = { name: "Name", email: "email@example.com", message: "Message" };
  await submitContactMessage(mock.client, payload);
  assert.deepEqual(mock.inserted(), payload);
});

test("returns a controlled database failure", async () => {
  const mock = mockClient({ message: "sensitive database detail" });
  const original = console.error;
  console.error = () => undefined;
  try { await assert.rejects(submitContactMessage(mock.client, { name: "N", email: "e@example.com", message: "M" }), { message: "Your message could not be sent. Please try again." }); }
  finally { console.error = original; }
});
