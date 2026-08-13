import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { buildContactPayload, CONTACT_LIMITS, isHoneypotFilled, validateContactDraft, type ContactDraft } from "./contact.logic.ts";

const valid: ContactDraft = { name: " Saurav ", email: " hello@example.com ", message: " A project note. ", website: "" };

describe("Contact form logic", () => {
  test("requires name, email, and message", () => {
    for (const field of ["name", "email", "message"] as const) assert.match(validateContactDraft({ ...valid, [field]: " " }) ?? "", /required/);
  });
  test("validates email", () => assert.match(validateContactDraft({ ...valid, email: "invalid" }) ?? "", /valid email/));
  test("trims the insert payload", () => assert.deepEqual(buildContactPayload(valid), { name: "Saurav", email: "hello@example.com", message: "A project note." }));
  test("enforces maximum lengths", () => assert.match(validateContactDraft({ ...valid, message: "x".repeat(CONTACT_LIMITS.message + 1) }) ?? "", /too long/));
  test("detects the honeypot without changing valid fields", () => {
    assert.equal(isHoneypotFilled(valid), false);
    assert.equal(isHoneypotFilled({ ...valid, website: "spam.example" }), true);
  });
});
