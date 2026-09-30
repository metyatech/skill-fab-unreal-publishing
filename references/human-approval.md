# Human approval for Fab media

Human Approval is a distinct human decision about a specific media set. It must not be inferred from validation results, an AI recommendation, or a general conversation response.

## Keep four review states separate

1. **Technical validation** checks machine-verifiable properties such as image decoding, dimensions, file size, duplicate files, paths, order, and SHA-256 values.
2. **AI review** may identify legibility, clarity, consistency, unsupported claims, or design concerns. It is advice only.
3. **Design-standard review** checks the media against [media-design.md](media-design.md) and reports PASS or findings. It is not Human Approval.
4. **Human Approval** exists only after the user has inspected the identified media and explicitly approved that media set.

For example, `MEDIA_TECHNICAL=PASS`, `MEDIA_DESIGN_REVIEW=PASS`, and `MEDIA_HUMAN_APPROVAL=PENDING` is a valid state.

## Preconditions for approval

- Show or open the actual media being approved in its listing order. Make the target set identifiable, including the thumbnail and gallery count.
- Ask for or receive explicit approval that clearly identifies the reviewed set. Examples: “この6枚でOK” or “このThumbnail + Gallery 5枚を承認する”. A generic “進めましょう” does not identify the media and is not approval.
- Record the exact ordered media identity: order, relative path, and bytes or a cryptographic hash. Include product and version when the approval contract supports them.
- Use the release tool's approval command only after the explicit human approval precondition has been satisfied. A flag such as `-ConfirmHumanApproval` confirms the human precondition to the tool; it does not authorize the agent to create that approval itself.
- If media bytes, hash, path, or order changes after approval, treat the approval as stale. Present the changed set for review and obtain new explicit approval before recording or using approval for it.

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
