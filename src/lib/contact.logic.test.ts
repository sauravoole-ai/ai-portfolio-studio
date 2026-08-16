import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { buildContactPayload, CONTACT_LIMITS, isHoneypotFilled, validateContactDraft, type ContactDraft } from "./contact.logic.ts";

const valid: ContactDraft = { name: " Saurav ", email: " hello@example.com ", projectType: " AI-powered web app ", buildIdea: " A retrieval assistant. ", message: " A project note. ", website: "" };

describe("Contact form logic", () => {
  test("requires name, email, build idea, and context", () => {
    for (const field of ["name", "email", "buildIdea", "message"] as const) assert.match(validateContactDraft({ ...valid, [field]: " " }) ?? "", /required/);
  });
  test("validates email", () => assert.match(validateContactDraft({ ...valid, email: "invalid" }) ?? "", /valid email/));
  test("trims the structured insert payload", () => assert.deepEqual(buildContactPayload(valid), { name: "Saurav", email: "hello@example.com", project_type: "AI-powered web app", build_idea: "A retrieval assistant.", message: "A project note." }));
  test("keeps project type optional", () => assert.equal(validateContactDraft({ ...valid, projectType: "" }), null));
  test("enforces maximum lengths", () => {
    assert.match(validateContactDraft({ ...valid, buildIdea: "x".repeat(CONTACT_LIMITS.buildIdea + 1) }) ?? "", /too long/);
    assert.match(validateContactDraft({ ...valid, message: "x".repeat(CONTACT_LIMITS.message + 1) }) ?? "", /too long/);
  });
  test("detects the honeypot without changing valid fields", () => {
    assert.equal(isHoneypotFilled(valid), false);
    assert.equal(isHoneypotFilled({ ...valid, website: "spam.example" }), true);
  });
});
