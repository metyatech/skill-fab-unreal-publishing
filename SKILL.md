---
name: fab-unreal-publishing
description: Use when preparing, designing, or reviewing an Unreal Engine plugin listing for Fab; planning Fab pricing, documentation, media, submission readiness, human media approval, or checking a published Fab listing. Do not use for ordinary package releases or GitHub Releases.
---

# Fab Unreal publishing

Use this skill for Fab listings that sell or distribute Unreal Engine tools and plugins. Keep advice grounded in the product's real behavior and in current Fab requirements. No listing or media treatment guarantees sales or Fab approval.

## Responsibilities

- This skill owns Fab-specific listing, media, and submission guidance.
- `skill-release-publish` owns general release and publication practices. Keep Fab-specific guidance here.
- `agent-rules` owns the short Human Approval invariants that apply across agent work.
- `fab-plugin-release-tools` owns package, technical validation, capture, media review manifest, approval artifact, and portal automation mechanics. Read its current README and use its commands; do not copy its implementation or replace its product-specific metadata.
- Each product repository owns its listing metadata, media, package configuration, and approval record.

## Workflow

1. Identify the product repository and its supported Unreal versions, actual capabilities, demo project, documentation, support path, and current listing state. Treat its metadata and built product as the factual source of truth.
2. Check the current [Fab publishing guidance](https://dev.epicgames.com/documentation/fab/publishing-assets-for-sale-or-free-download-in-fab) and the release-tools README for current listing fields, media constraints, pricing and submission requirements. Portal labels and requirements can change; verify them at the time of work.
3. Shape the listing around the buyer's task and outcome. Keep product name, included functionality, compatibility, license, price, documentation, support, and media consistent. State exclusions and dependencies plainly. Do not claim features or included content that the product does not provide.
4. When the goal includes sales, revenue, conversion, discoverability, click-through, pricing, or competitive positioning, read [references/sales-optimization.md](references/sales-optimization.md) and [references/evidence.md](references/evidence.md), inspect current Fab alternatives, and complete the independent `SALES_OPTIMIZATION_REVIEW` before Human Approval. A pre-launch PASS is a best-supported hypothesis under current evidence and market context, not proof of higher sales.
5. Design and review the thumbnail and gallery against [references/media-design.md](references/media-design.md). Read [references/evidence.md](references/evidence.md) when explaining or revising design standards, and re-check linked sources when requirements may have changed.
6. Keep technical validation, media-design review, sales-optimization review, and Human Approval separate. Any AI review is advisory and is not a formal gate. Before recording or acting on approval, follow [references/human-approval.md](references/human-approval.md) and the cross-agent invariants in `agent-rules`.
7. Use `fab-plugin-release-tools` for supported packaging, validation, media review, preparation, and portal operations. Inspect its current README and command help before invoking it. Do not recreate its validators, schemas, manifests, media-capture pipeline, or portal automation in this skill.
8. Before submission, confirm the product package and listing metadata agree, all required fields and links are complete, media is current and approved, and the portal preview communicates the actual offer. Report readiness only for states directly verified.
9. After publication, open the live Fab listing and verify the published name, price, media order, description, supported versions, documentation/support links, and available product files. Report any difference from the approved submission.

## Reference routing

- Read `references/media-design.md` for any thumbnail, gallery, caption, or video design or review.
- Read `references/sales-optimization.md` for sales, revenue, conversion, discoverability, click-through, pricing, or competitive-positioning goals.
- Read `references/evidence.md` when grounding a design choice, updating the standard, or distinguishing direct evidence from operational choices.
- Read `references/human-approval.md` before any media approval is recorded, approval flag is used, or approval-bound media changes.
