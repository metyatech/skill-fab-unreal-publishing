import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const guidance = await readFile(
  new URL("../references/sales-optimization.md", import.meta.url),
  "utf8",
);
const mediaDesign = await readFile(
  new URL("../references/media-design.md", import.meta.url),
  "utf8",
);
const humanApproval = await readFile(
  new URL("../references/human-approval.md", import.meta.url),
  "utf8",
);
const skill = await readFile(new URL("../SKILL.md", import.meta.url), "utf8");

const compact = (text) => text.replace(/\s+/g, " ").toLowerCase();
const formalGateFields = [
  "technicalValidation",
  "mediaDesignReview",
  "salesOptimizationReview",
  "humanApproval",
];

function reviewStateFields(text) {
  const state = text.match(/interface FabListingReviewState\s*\{([^}]+)\}/s);
  assert.ok(state, "FabListingReviewState interface is required");
  return [...state[1].matchAll(/^\s*(\w+):\s*ReviewState\s*;/gm)].map(
    ([, field]) => field,
  );
}

function assertNoSemanticRegressions(text) {
  const statements = text.split(/(?<=[.!?])\s+/);
  const forbidden = [
    /^(?:product(?:-specific)? |(?:a |an )?(?:product-specific )?)?experiments?\b.{0,100}\b(?:may|can|will|does|takes precedence over)\b.{0,70}\b(?:current )?(?:mandatory )?fab (?:policy|requirement)/i,
    /^(?:higher )?(?:sales|ctr|revenue)(?: data| evidence| results)?\b.{0,80}\b(?:may|can|will|justifies|permits|allows)\b.{0,70}\b(?:misleading|false|untruthful|truthfulness)/i,
    /^ai review is (?:a )?formal approval gate/i,
    /^ai review pass counts as human approval/i,
    /^a positive ai (?:review|assessment|recommendation|finding)\b.{0,80}\b(?:is|are|establishes|counts as|constitutes|creates)\b.{0,50}\bhuman approval/i,
    /^competitive salience is required for media_design_review pass/i,
    /^sales_optimization_review may pass when buyerRiskReduced is false/i,
    /^sales_optimization_review may pass when limitationsClear is false/i,
    /^sales_optimization_review proves higher sales/i,
  ];
  for (const statement of statements) {
    for (const pattern of forbidden) {
      assert.doesNotMatch(
        statement.trim(),
        pattern,
        `Semantic regression: ${pattern}`,
      );
    }
  }
}

function assertCompetitiveSalienceIsNotAMediaGate(text) {
  const mediaMust = text.split("## MUST")[1]?.split("### Gallery")[0];
  assert.ok(mediaMust, "Media Design MUST section is required");
  assert.doesNotMatch(
    compact(mediaMust),
    /current fab alternatives|relative salience|competitor grid|visually disappears|must stand out among (?:current )?competitors/,
  );
}

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
  assert.match(normalized, /a missing market inspection/);
  assert.match(
    normalized,
    /poor competitive salience, unclear limitations, missing trust signal/,
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
  assert.match(normalized, /non-blank reason/);
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
    "listingcopyaligned",
    "pricingcontextreviewed",
    "unsupportedclaimsabsent",
    "evidencelimitationsrecorded",
  ]) {
    assert.ok(normalized.includes(field), `Missing review criterion: ${field}`);
  }
  assert.match(
    normalized,
    /pass requires every hard-constraint field to be true/,
  );
  assert.match(
    normalized,
    /`not_applicable` is permitted only .* non-blank reason/,
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

test("hard constraints are outside the evidence hierarchy and gate every candidate", () => {
  const normalized = compact(guidance);
  const constraintsIndex = normalized.indexOf(
    "interface fabnonoverrideableconstraints",
  );
  const evidenceIndex = normalized.indexOf("type evidencetier");
  assert.ok(constraintsIndex >= 0 && evidenceIndex > constraintsIndex);
  for (const field of [
    "currentFabMandatoryRequirementsSatisfied",
    "truthfulRepresentationSatisfied",
    "productAndListingConsistencySatisfied",
    "releaseToolsContractSatisfied",
    "humanApprovalInvariantPreserved",
  ]) {
    assert.match(normalized, new RegExp(`${field.toLowerCase()}: boolean`));
  }
  assert.match(normalized, /only after all non-overrideable constraints pass/);
  assert.match(
    normalized,
    /fab official recommendations and other non-mandatory guidance/,
  );
  assert.match(
    normalized,
    /no experiment, sales data, competitor pattern, or heuristic may override/,
  );
  assert.match(normalized, /never justifies misleading product claims/);
  assert.match(normalized, /release-tools contract must not be bypassed/);

  const tierType = guidance.match(/type EvidenceTier =([\s\S]*?);/);
  assert.ok(tierType, "EvidenceTier contract is required");
  assert.deepEqual(
    [...tierType[1].matchAll(/"([a-z_]+)"/g)].map(([, tier]) => tier),
    [
      "product_specific_controlled_experiment",
      "product_specific_observational_data",
      "current_fab_market_context",
      "fab_official_guidance",
      "peer_reviewed_cross_marketplace_research",
      "other_marketplace_official_guidance",
      "operational_heuristic",
    ],
  );
});

test("four formal gates match across documents and AI review stays advisory", () => {
  assert.deepEqual(reviewStateFields(guidance), formalGateFields);
  assert.deepEqual(reviewStateFields(humanApproval), formalGateFields);

  for (const text of [guidance, humanApproval]) {
    const normalized = compact(text);
    assert.match(
      normalized,
      /type reviewstate = "pass" \| "fail" \| "pending" \| "not_applicable"/,
    );
    assert.match(normalized, /ai review is advisory, not a fifth gate/);
    assert.match(
      normalized,
      /does not create a formal pass state|creates no formal review state/,
    );
    assert.match(
      normalized,
      /does not satisfy technical validation, media design review, sales optimization review, or human approval|satisfies none of the four formal gates/,
    );
    assert.match(
      normalized,
      /positive ai recommendation is not human approval|ai review pass or positive recommendation is not human approval/,
    );
    assert.match(normalized, /interface fabadvisoryreview/);
    assert.match(normalized, /performed: boolean/);
    assert.match(normalized, /findings: string\[\]/);
  }

  const normalizedSkill = compact(skill);
  assert.match(
    normalizedSkill,
    /technical validation, media-design review, sales-optimization review, and human approval separate/,
  );
  assert.match(
    normalizedSkill,
    /ai review is advisory and is not a formal gate/,
  );
});

test("media craft and competitive salience belong to separate review gates", () => {
  const mediaMust = mediaDesign.split("## MUST")[1].split("### Gallery")[0];
  const normalizedMediaMust = compact(mediaMust);
  assert.match(normalizedMediaMust, /by itself at actual fab card scale/);
  assert.match(
    normalizedMediaMust,
    /primary message and genuine product evidence/,
  );
  assert.match(
    normalizedMediaMust,
    /visual hierarchy, figure-ground contrast, and composition/,
  );
  assert.match(normalizedMediaMust, /truthful representation and legibility/);
  assertCompetitiveSalienceIsNotAMediaGate(mediaDesign);

  const normalizedMedia = compact(mediaDesign);
  assert.match(
    normalizedMedia,
    /relative salience beside current fab alternatives is evaluated by `sales_optimization_review`/,
  );
  assert.match(
    normalizedMedia,
    /does not by itself determine `media_design_review`/,
  );
  assert.match(
    normalizedMedia,
    /may therefore pass media design while competitive salience fails the sales review/,
  );

  const salesThumbnail = compact(
    guidance.split("## Thumbnail")[1].split("## Gallery and video")[0],
  );
  assert.match(salesThumbnail, /same browse\/card context/);
  assert.match(
    salesThumbnail,
    /fail sales review when it visually disappears among relevant alternatives/,
  );
});

test("sales review PASS requires applicable fields across the complete funnel", () => {
  const normalized = compact(guidance);
  assert.match(normalized, /hardconstraints: fabnonoverrideableconstraints/);
  assert.match(normalized, /funnel: fabsalesfunnel/);
  assert.match(
    normalized,
    /pass requires every hard-constraint field to be true/,
  );
  assert.match(normalized, /every applicable boolean in `funnel` to be true/);

  for (const field of [
    "searchAndFilterRelevance",
    "thumbnailAttention",
    "primaryValueClear",
    "differentiatedFromAlternatives",
    "realProductEvidence",
    "strongestBenefitsEarly",
    "limitationsClear",
    "trustSignalsPresent",
    "priceValueCoherent",
    "buyerRiskReduced",
  ]) {
    assert.ok(
      normalized.includes(field.toLowerCase()),
      `Missing funnel field ${field}`,
    );
  }

  assert.match(
    normalized,
    /unclear limitations, missing trust signal, incoherent price-value fit, or unreduced buyer risk is fail, not pass/,
  );
  assert.match(
    normalized,
    /strong click or thumbnail-attention results do not compensate/,
  );
  assert.match(normalized, /pricevaluecoherent: boolean \| "not_applicable"/);
  assert.match(normalized, /pricevaluenotapplicablereason\?: string/);
  assert.match(
    normalized,
    /pricingcontextreviewed: boolean \| "not_applicable"/,
  );
  assert.match(normalized, /pricingnotapplicablereason\?: string/);
  assert.match(
    normalized,
    /`not_applicable` is permitted only .* non-blank reason/,
  );
});

test("Human Approval and release-tools boundaries remain explicit and hash-bound", () => {
  const normalized = compact(humanApproval);
  assert.match(
    normalized,
    /user has inspected the identified media and explicitly approved that media set/,
  );
  assert.match(
    normalized,
    /if media bytes, hash, path, order, role, dimensions, or file size change after approval, treat the approval as stale/,
  );
  assert.match(
    normalized,
    /relative path, order, role, dimensions, file size, and bytes or a cryptographic hash/,
  );
  assert.match(
    normalized,
    /never write, edit, or commit the product's `fabmediaapproval\.json`/,
  );
  assert.match(
    normalized,
    /cannot decide whether the media is attractive, suitable, or accepted by fab/,
  );
  assert.match(
    normalized,
    /only after the user has inspected that exact review and explicitly said ok/,
  );
  assert.match(normalized, /compares it with the reviewed manifest/);
});

test("scope and state boundaries allow media PASS with sales FAIL and advisory AI with pending approval", () => {
  const normalizedSales = compact(guidance);
  const normalizedHuman = compact(humanApproval);
  const normalizedMedia = compact(mediaDesign);

  assert.match(
    normalizedSales,
    /when it is outside scope, it may be `not_applicable`/,
  );
  assert.match(
    normalizedSales,
    /when any of those goals is in scope, `not_applicable` must not be used/,
  );
  assert.match(normalizedHuman, /only when out of scope/);
  assert.match(
    normalizedHuman,
    /if sales, revenue, conversion, discoverability, click-through, pricing, or competitive positioning is in scope, `sales_optimization_review=not_applicable` is invalid/,
  );
  assert.match(normalizedSales, /treat them as observational data/);
  assert.match(
    normalizedSales,
    /when traffic is low, do not call small differences a winner/,
  );
  assert.match(
    normalizedHuman,
    /positive ai findings may coexist with `human_approval=pending`/,
  );
  assert.match(
    normalizedMedia,
    /may therefore pass media design while competitive salience fails the sales review/,
  );
});

test("cross-document negative mutations reject policy, approval, ownership, and funnel regressions", () => {
  const combined = `${guidance}\n${mediaDesign}\n${humanApproval}\n${skill}`;
  assertNoSemanticRegressions(combined);

  const invalidMutations = [
    "Product experiments may override current mandatory Fab policy.",
    "A product-specific experiment with superior revenue takes precedence over a mandatory Fab requirement.",
    "Sales data may override truthfulness.",
    "Higher CTR permits a misleading image claim.",
    "AI review is a formal approval gate.",
    "AI review PASS counts as Human Approval.",
    "A positive AI assessment establishes Human Approval.",
    "Competitive salience is required for MEDIA_DESIGN_REVIEW PASS.",
    "SALES_OPTIMIZATION_REVIEW may PASS when buyerRiskReduced is false.",
    "SALES_OPTIMIZATION_REVIEW may PASS when limitationsClear is false.",
    "SALES_OPTIMIZATION_REVIEW proves higher sales.",
  ];
  for (const invalid of invalidMutations) {
    assert.throws(
      () => assertNoSemanticRegressions(`${combined}\n${invalid}`),
      invalid,
    );
  }

  const invalidMediaMust = mediaDesign.replace(
    "### Thumbnail",
    "### Thumbnail\n\n- A thumbnail MUST stand out among current competitors to pass media design.",
  );
  assert.throws(
    () => assertCompetitiveSalienceIsNotAMediaGate(invalidMediaMust),
    /relative salience|competitor grid|visually disappears|must stand out among competitors/i,
  );
});
