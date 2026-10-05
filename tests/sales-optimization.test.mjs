import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const guidance = await readFile(
  new URL("../references/sales-optimization.md", import.meta.url),
  "utf8",
);
const skill = await readFile(new URL("../SKILL.md", import.meta.url), "utf8");

const compact = (text) => text.replace(/\s+/g, " ").toLowerCase();

function assertNoSalesOverclaims(text) {
  const overclaims = [
    /\bproven optimal\b/i,
    /guaranteed to maximize sales/i,
    /three (?:thumbnail )?variants? (?:is|are) (?:proven )?optimal/i,
    /low complexity always (?:wins|maximizes sales)/i,
    /\b(?:red|blue|green)\b.{0,20}\b(?:best-selling|best selling|best)\b.{0,10}\bcolor\b/i,
    /(?:a )?video (?:always )?increases sales/i,
  ];
  for (const pattern of overclaims) {
    assert.doesNotMatch(text, pattern, `Unsupported sales claim: ${pattern}`);
  }
}

test("sales goals route through current evidence and an independent review", () => {
  const normalizedSkill = compact(skill);
  assert.match(normalizedSkill, /sales-optimization\.md/);
  assert.match(normalizedSkill, /references\/evidence\.md/);
  assert.match(normalizedSkill, /inspect current fab alternatives/);
  assert.match(
    normalizedSkill,
    /independent `sales_optimization_review` before human approval/,
  );

  const normalizedGuidance = compact(guidance);
  assert.match(
    normalizedGuidance,
    /a media-design pass does not imply a sales-optimization pass/,
  );
  assert.match(normalizedGuidance, /does not imply human approval/);
  assert.match(normalizedGuidance, /technicalvalidation: reviewstate/);
  assert.match(normalizedGuidance, /mediadesignreview: reviewstate/);
  assert.match(normalizedGuidance, /salesoptimizationreview: reviewstate/);
  assert.match(normalizedGuidance, /humanapproval: reviewstate/);
});

test("market audit, actual evidence, and ordered pre-launch workflow are required", () => {
  const normalized = compact(guidance);
  assert.match(
    normalized,
    /for every sales-optimization request, search current fab listings/,
  );
  assert.match(normalized, /none found in current search/);
  assert.match(
    normalized,
    /show truthful actual product ui, output, or behavior as evidence/,
  );
  assert.match(
    normalized,
    /missing current market inspection, unsupported claims, absent actual product evidence, or poor competitive salience is fail/,
  );

  const steps = [
    "define the buyer's job and problem",
    "inspect current fab direct competitors and nearest substitutes",
    "define one primary outcome that differentiates the product",
    "review title, available categories and tags, and buyer search intent",
    "design thumbnail treatments",
    "compare treatments at actual browse/card scale",
    "design the gallery narrative",
    "review listing copy, faq, price",
    "run `sales_optimization_review`",
    "proceed to human approval only after sales review passes",
  ];
  let lastIndex = -1;
  for (const step of steps) {
    const index = normalized.indexOf(step);
    assert.ok(
      index > lastIndex,
      `Workflow step is missing or out of order: ${step}`,
    );
    lastIndex = index;
  }
});

test("whole-funnel review prevents click-through from standing in for purchase", () => {
  const normalized = compact(guidance);
  for (const field of [
    "searchandfilterrelevance",
    "thumbnailattention",
    "primaryvalueclear",
    "differentiatedfromalternatives",
    "realproductevidence",
    "strongestbenefitsearly",
    "limitationsclear",
    "trustsignalspresent",
    "pricevaluecoherent",
    "buyerriskreduced",
  ]) {
    assert.ok(
      normalized.includes(field),
      `Missing sales-funnel field: ${field}`,
    );
  }
  assert.match(normalized, /click-through alone is not success/);
});

test("thumbnail heuristics preserve truth, competitive salience, and bounded complexity claims", () => {
  const normalized = compact(guidance);
  assert.match(normalized, /same browse\/card context/);
  assert.match(normalized, /actual card scale/);
  assert.match(normalized, /fail sales review when it visually disappears/);
  assert.match(
    normalized,
    /lower visual complexity is a starting hypothesis, not a universal winning rule/,
  );
  assert.match(normalized, /no color is universally best for sales/);
  assert.match(
    normalized,
    /two or three materially different thumbnail treatments is a useful operational heuristic/,
  );
  assert.match(normalized, /not a research-proven optimum/);
  assert.match(
    normalized,
    /same card dimensions, competitor grid, and product facts/,
  );
  assert.match(
    normalized,
    /primary-value comprehension, competitive salience, truthfulness, real product evidence/,
  );
  assert.match(normalized, /not simply the flashiest one/);
});

test("gallery, video, listing copy, discovery, and price stay buyer- and evidence-focused", () => {
  const normalized = compact(guidance);
  assert.match(
    normalized,
    /each gallery image must serve one buyer outcome or proof purpose/,
  );
  assert.match(
    normalized,
    /strongest differentiated value in the first one to three images/,
  );
  assert.match(normalized, /avoid near-duplicates/);
  assert.match(
    normalized,
    /use video only when motion explains value better than stills/,
  );
  assert.match(normalized, /video does not inherently increase sales/);
  assert.match(
    normalized,
    /lead with buyer problem → outcome → differentiator/,
  );
  assert.match(
    normalized,
    /check the categories and tags currently available in fab/,
  );
  assert.match(normalized, /do not keyword-stuff/);
  assert.match(normalized, /fab-generated tags from thumbnails/);
  assert.match(normalized, /do not infer price elasticity without evidence/);
  assert.match(normalized, /recorded reason/);
});

test("post-launch observations are not misreported as controlled experiments", () => {
  const normalized = compact(guidance);
  assert.match(
    normalized,
    /do not call sequential before\/after changes a controlled experiment/,
  );
  assert.match(normalized, /treat them as observational data/);
  assert.match(
    normalized,
    /when traffic is low, do not call small differences a winner/,
  );
  assert.match(normalized, /major confounders/);
});

test("all required review criteria and independent human approval state are present", () => {
  const normalized = compact(guidance);
  for (const field of [
    "marketcontextchecked",
    "currentcompetitorsinspected",
    "buyerjobdefined",
    "differentiatedoutcomedefined",
    "discoveryfieldsreviewed",
    "thumbnailcomparedincompetitivecontext",
    "cardscalereviewed",
    "actualproductevidencepresent",
    "strongestoutcomesearly",
    "listingcopyaligned",
    "pricingcontextreviewed",
    "unsupportedclaimsabsent",
    "evidencelimitationsrecorded",
  ]) {
    assert.ok(normalized.includes(field), `Missing review criterion: ${field}`);
  }
  assert.match(
    normalized,
    /every applicable sales-review criterion must be true for pass/,
  );
  assert.match(
    normalized,
    /a fixed or free price may be `not_applicable` only with a recorded reason/,
  );
  assert.match(
    normalized,
    /human approval rules .* remain unchanged and mandatory/,
  );
});

test("unsupported optimality claims fail a negative mutation check", () => {
  assertNoSalesOverclaims(guidance);
  const invalidTreatments = [
    `${guidance}\nThree variants are proven optimal and guaranteed to maximize sales.`,
    `${guidance}\nLow complexity always maximizes sales.`,
    `${guidance}\nBlue is always the best-selling color.`,
    `${guidance}\nA video always increases sales.`,
  ];
  for (const [index, invalid] of invalidTreatments.entries()) {
    assert.throws(
      () => assertNoSalesOverclaims(invalid),
      undefined,
      `invalid mutation ${index}`,
    );
  }
});
