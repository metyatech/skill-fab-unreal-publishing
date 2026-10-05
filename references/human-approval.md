# Human approval for Fab media

Human Approval is a distinct human decision about a specific media set. It must not be inferred from validation results, an AI recommendation, or a general conversation response.

## Keep four formal review states separate

The four formal gates are Technical Validation, Media Design Review, Sales
Optimization Review, and Human Approval:

```ts
type ReviewState = "PASS" | "FAIL" | "PENDING" | "NOT_APPLICABLE";

interface FabListingReviewState {
  technicalValidation: ReviewState;
  mediaDesignReview: ReviewState;
  salesOptimizationReview: ReviewState;
  humanApproval: ReviewState;
}

interface FabAdvisoryReview {
  aiReview?: {
    performed: boolean;
    findings: string[];
  };
}
```

Technical Validation checks machine-verifiable properties such as image
decoding, dimensions, file size, duplicate files, paths, order, and SHA-256
values. Media Design Review checks the media against
[media-design.md](media-design.md). Sales Optimization Review is `NOT_APPLICABLE`
only when sales optimization is outside the user's goal. Human Approval exists
only after the user has inspected the identified media and explicitly approved
that media set.

AI review is advisory, not a fifth gate. It may provide visual or content
findings but creates no formal review state and satisfies none of the four
formal gates. An AI review PASS or positive recommendation is not Human
Approval. Positive AI findings may coexist with
`HUMAN_APPROVAL=PENDING` until the user explicitly approves the identified set.

For example, `MEDIA_TECHNICAL=PASS`, `MEDIA_DESIGN_REVIEW=PASS`,
`SALES_OPTIMIZATION_REVIEW=NOT_APPLICABLE` (only when out of scope), and
`HUMAN_APPROVAL=PENDING` is a valid state. If sales, revenue, conversion,
discoverability, click-through, pricing, or competitive positioning is in scope,
`SALES_OPTIMIZATION_REVIEW=NOT_APPLICABLE` is invalid.

## Preconditions for approval

- Show or open the actual media being approved in its listing order. Make the target set identifiable, including the thumbnail and gallery count.
- Ask for or receive explicit approval that clearly identifies the reviewed set. Examples: “この6枚でOK” or “このThumbnail + Gallery 5枚を承認する”. A generic “進めましょう” does not identify the media and is not approval.
- Record the exact media identity for every item: relative path, order, role, dimensions, file size, and bytes or a cryptographic hash. Include product and version when the approval contract supports them.
- Use the release tool's approval command only after the explicit human approval precondition has been satisfied. A flag such as `-ConfirmHumanApproval` confirms the human precondition to the tool; it does not authorize the agent to create that approval itself.
- If media bytes, hash, path, order, role, dimensions, or file size change after approval, treat the approval as stale. Present the changed set for review and obtain new explicit approval before recording or using approval for it.

## Never infer approval from

- An AI's positive visual judgment or a passing AI review.
- Passing automated checks or technical validation.
- A user's generic agreement such as “next”, “go ahead”, or “そうしましょう” when the media set is not clearly identified.
- Approval of a different deliverable, release, listing field, or previous media version.
- The existence of an approval script, a populated flag, a review manifest, or a prior approval record.

If it is unclear whether the user saw the exact ordered media set or what set they approved, keep the state `PENDING` and ask them to review and explicitly approve the identified media. Never write, edit, or commit the product's `FabMediaApproval.json` on the assumption that the user intended approval.

## Release-tools contract

Use `New-FabMediaReview.ps1` to create the technical review artifact and display it for human inspection. It reports technical status and pending approval; it cannot decide whether the media is attractive, suitable, or accepted by Fab. `Approve-FabMedia.ps1 -ConfirmHumanApproval` must be invoked only after the user has inspected that exact review and explicitly said OK. The command binds the approval to the current media and compares it with the reviewed manifest. Inspect the current `fab-plugin-release-tools` README and schema before each workflow because command and contract details can change.

This separation is an agent-side invariant. The current CLI flag itself is not proof of who made the decision or whether a user saw the review. Do not treat successful command execution as evidence that the human precondition occurred.
