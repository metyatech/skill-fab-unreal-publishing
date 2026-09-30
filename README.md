# skill-fab-unreal-publishing

An Agent Skill for preparing, designing, and reviewing Unreal Engine plugin listings for Fab.

## Purpose

Provides reusable guidance for Fab-specific product listings, thumbnails and galleries, pricing and documentation readiness, human media approval, submission preparation, and post-publication checks.

## When it applies

Use `fab-unreal-publishing` when preparing or reviewing a Fab listing for an Unreal Engine tool or plugin, its media, price, documentation, submission readiness, approval state, or published listing. It does not apply to ordinary npm/package publishing or a normal GitHub Release.

## What it does not replace

- [`skill-release-publish`](https://github.com/metyatech/skill-release-publish) handles general release and publication practices. Fab-specific knowledge stays in this skill.
- [`agent-rules`](https://github.com/metyatech/agent-rules) holds short Human Approval invariants that apply across agent work.
- [`fab-plugin-release-tools`](https://github.com/metyatech/fab-plugin-release-tools) performs packaging, technical validation, capture, media review manifest generation, approval artifact writing, and supported portal automation.
- Each product repository owns its product metadata, media, package configuration, and approval record.

This skill provides judgment and workflow guidance; it does not duplicate release-tool scripts, schemas, manifests, or portal automation.

## Current scope

The current standard focuses on thumbnail and gallery design, research-backed review criteria, separating AI/design review from Human Approval, and using the release tools at the right boundary. Fab's portal requirements can change, so verify current official guidance before submission. The standard aims to improve clarity and trust; it does not guarantee sales or acceptance.

## Installation

```sh
npx skills add metyatech/skill-fab-unreal-publishing
```

## Development

```sh
npm ci
npm run verify
```

## License

MIT. See [LICENSE](LICENSE).
