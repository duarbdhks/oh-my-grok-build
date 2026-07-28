<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-28 | Updated: 2026-07-28 -->

# .github

## Purpose
GitHub automation for the repository. Provides CI that gates pull requests and main-branch pushes with static content validation only.

## Key Files

| File | Description |
|------|-------------|
| _(none at this level)_ | Workflows live under `workflows/` |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `workflows/` | GitHub Actions workflow definitions (see `workflows/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Keep CI minimal and aligned with content-only posture.
- Do not assume `grok` CLI exists on runners; CI must not require it.
- Prefer read-only repository permissions unless a workflow truly needs more.

### Testing Requirements
- Validate workflow YAML locally if edited; confirm `npm test` still matches the CI job.

### Common Patterns
- Single static-validation job on Node 22

## Dependencies

### Internal
- Root `package.json` scripts (`npm test`)
- `scripts/validate.mjs`

### External
- GitHub Actions (`actions/checkout`, Node setup)

<!-- MANUAL: -->
