# Fab media design standard for Unreal Engine tools

Use this standard to review the listing thumbnail and gallery for a Fab Unreal Engine tool or plugin. It is an internal quality gate intended to improve fast comprehension, evaluation, and trust. It does not predict a specific conversion rate or guarantee a sale. See [evidence.md](evidence.md) for what the sources support and where this standard adds operational judgment.

## Review outcome

Mark the media design review **PASS** only when every MUST below is satisfied. Record a concrete reason for any SHOULD that is not followed. A technical pass or design-review pass is not Human Approval; see [human-approval.md](human-approval.md).

## MUST

### Thumbnail

- Communicate one primary buyer value. Keep the product name and category in listing metadata; use the image's limited attention for the most useful buyer outcome.
- Remain understandable when reduced to the size of a Fab discovery/listing card. Check the real thumbnail at card scale; the primary headline and visual must still be identifiable without zooming.
- Accurately represent the product and its offer. For a tool or plugin, include genuine product UI or output as visual evidence. Do not substitute a fictional interface, unsupported state, or feature that the product does not provide.
- Keep the genuine product UI legible enough to establish what the tool does. Do not let dense Editor chrome or tiny labels become the main subject.
- Make the main message and product evidence visually distinct from decorative elements; remove decoration that competes with either.

### Gallery

- Put the strongest buyer value in the first one to three gallery items. The opening images must make the main use and strongest reason to buy easy to find.
- Give each image a distinct buyer outcome or proof point. Near-duplicates do not count as distinct gallery value.
- Use actual product UI, actual output, or a reproducible production behavior as evidence. When showing a workflow, make the causal action and its real result visible (for example, a query and its result, or an action and the focused node it actually selects).
- Make captions explain the buyer outcome or what the evidence demonstrates, rather than merely naming a feature.
- Keep imagery and claims consistent with the released product, the included files, and the listing. Disclose staged context or content not included when a buyer could mistake it for part of the offer.
- Apply one coherent visual system across the gallery: typography, spacing, accent color, and caption placement must look related and remain readable.
- Include only images that add useful proof or clarify a meaningful use case. Do not add images just to increase the count.

### Approval boundary

- Keep technical validation, AI review, design-standard review, and Human Approval as separate states. AI or automation may report findings, but only explicit user approval of the identified media can establish Human Approval.
- Bind approval to media order, paths, and bytes or their cryptographic hashes. If any bound value changes, the prior approval is invalid for the changed set.

## SHOULD

- Prefer a user outcome or benefit over a generic product-category label in image headlines. The image and listing title can still name the product.
- Use short, scannable, high-contrast text. As an operational heuristic, aim for roughly 3–8 headline words when that wording fits the product; this is not a research-proven threshold. Avoid paragraphs, small text, and claims that require reading at full size.
- Give each gallery image one clear focal point and one proof purpose. Favor focused crops of a real interface over broad, busy Editor screenshots.
- Use a default gallery sequence of: (1) core value, (2) strongest differentiator, (3) second differentiator or proof, (4) an important advanced or secondary use, and (5) trust, scale, performance, or workflow evidence. Reorder when product-specific buyer priorities make another sequence clearer; this is an operational heuristic, not a universal research finding.
- Use professional, credible, utilitarian clarity for technical tools. Avoid decorative spectacle when it obscures what the product does or what is included. Product-specific context can justify more expressive treatment when clarity and truthful representation remain intact.
- Consider a video only when motion explains real operation better than static images. It is optional and does not outrank a strong static gallery. If made, show a real problem, the actual interaction, and its result; avoid a feature montage that cannot be verified. Around 20–30 seconds is an editing heuristic, not a proven conversion optimum.
- Test the thumbnail and any small captions at likely display size on both a light and dark surrounding UI when practical.

## Review procedure

1. Inspect the thumbnail at its original size and at Fab card scale. State the buyer value a first-time viewer should understand; if reviewers infer different primary messages, revise it.
2. Review gallery images in their actual order. For each, write the distinct buyer outcome and the visible evidence. Flag any image whose proof is not present in the product or whose claim exceeds the evidence.
3. Check consistency across the listing, plugin behavior, supported versions, included package, and documentation. Remove or label context that is not included.
4. Review text at display scale for contrast and legibility. Check that the sequence and visual system are consistent.
5. Record the design findings and status separately from technical validation and Human Approval. Do not report the media as approved until the human-approval process is complete.
