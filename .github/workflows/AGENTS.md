<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-28 | Updated: 2026-07-28 -->

# workflows

## Purpose
GitHub Actions workflow definitions that gate repository changes. Currently a single static-validation workflow; no deploy or release automation lives here.

## Key Files

| File | Description |
|------|-------------|
| `validate.yml` | Job `static-validation`: checkout, Node 22, `npm test` on push to `main`, all PRs, and `workflow_dispatch` |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| _(none)_ | Flat workflow YAML set |

## For AI Agents

### Working In This Directory
- Keep permissions minimal (`contents: read` unless expanded deliberately).
- Do not add steps that require secrets, network installers, or a `grok` binary on the runner without an explicit design decision.
- The CI contract is static validation only — mirror `npm test`, not full live plugin install.

### Testing Requirements
- After edits, open a PR or run the workflow via `workflow_dispatch` and confirm the job still executes `npm test`.

### Common Patterns
- Single job on `ubuntu-latest`
- Node major version pinned in the workflow (currently 22)

## Dependencies

### Internal
- Root `package.json` → `npm test`
- `scripts/validate.mjs`

### External
- `actions/checkout@v4` and Node setup actions

<!-- MANUAL: -->
