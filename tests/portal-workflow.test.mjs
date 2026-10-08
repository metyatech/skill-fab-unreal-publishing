import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const skill = await readFile(new URL("../SKILL.md", import.meta.url), "utf8");
const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");
const normalize = (value) => value.replace(/\s+/g, " ").toLowerCase();

test("workflow distinguishes Additional Files from Media Gallery and accepts documented name normalization evidence", () => {
  const text = normalize(skill);
  assert.match(text, /add new format` → `additional files`/);
  assert.match(text, /media gallery .* is a different feature/);
  assert.match(
    text,
    /normalized displayed filename alone does not disprove file identity/,
  );
  assert.match(text, /fail closed on role or size contradictions/);
  assert.match(
    text,
    /record each completed upload in `fabportaluploadevidence\.json`/,
  );
  assert.match(
    text,
    /a visible same-size row alone does not prove which artifact was uploaded/,
  );
  assert.match(
    text,
    /never claim fab-side hash verification without an observed portal hash/,
  );
});

test("workflow defers publication mode to submission and preserves consequential action boundary", () => {
  const text = normalize(skill);
  assert.match(text, /not in the normal listing editor/);
  assert.match(
    text,
    /do not fail pre-submit because the control is absent there/,
  );
  assert.match(
    text,
    /automatic publication is selected, do not also manually publish or activate/,
  );
  assert.match(
    text,
    /if the user explicitly says to submit, continue through the submission flow/,
  );
});

test("Description Preview gate checks structure without prescribing whitespace workarounds", () => {
  const text = normalize(skill);
  assert.match(
    text,
    /check description structure in the rendered portal preview/,
  );
  assert.match(text, /a collapsed continuous line fails/);
  assert.match(
    text,
    /tight heading\/paragraph spacing controlled by fab styling is a platform limitation/,
  );
  assert.match(text, /do not add repeated line breaks, spaces, or blank lines/);
});

test("demo guidance follows product type and distribution facts rather than fixed copy", () => {
  const text = normalize(skill);
  for (const detail of [
    "what the demo is",
    "how it relates to the product",
    "whether it contains the product binary",
    "how to try it",
    "where quick start is",
  ]) {
    assert.ok(text.includes(detail), `Missing demo guidance: ${detail}`);
  }
  assert.match(text, /do not force one fixed description on every product/);
  assert.match(
    normalize(readme),
    /based on that product's facts rather than using fixed copy/,
  );
});

test("readiness evidence and pre-submit versus submitted remain separate", () => {
  const text = normalize(skill);
  assert.match(
    text,
    /generated artifacts ready, portal inputs ready, portal values directly verified, human preview acceptance, ready to submit, and submitted/,
  );
  assert.match(
    text,
    /treat human or computer use preview checks as `unknown` until evidence exists/,
  );
});
