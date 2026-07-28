<!-- Generated: 2026-07-28 | Updated: 2026-07-28 -->

# oh-my-grok-build

## Purpose
Content-only Grok Build plugin marketplace. Ships skills and agents for consensus planning, bounded parallel execution, and evidence-based verification. Runtime orchestration stays in Grok Build; this repository provides markdown content plus zero-dependency static validation only.

## Key Files

| File | Description |
|------|-------------|
| `package.json` | Private package; validation scripts only; no runtime dependencies; Node `>=20` |
| `README.md` / `README.ko.md` | User-facing install, commands, agents, and status (EN+KO pair) |
| `CHANGELOG.md` | Public release history (English) |
| `CONTRIBUTING.md` | Contribution principles and local check expectations |
| `SECURITY.md` | Content-only security posture and high-risk change gates |
| `LICENSE` | MIT license (filename must remain `LICENSE`) |
| `NOTICE.md` | Clean-room attribution vs upstream inspiration |
| `AGENTS.md` | Canonical AI-agent rules for this repository |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `docs/` | Architecture, validation evidence, roadmap, publishing, upstream evaluation (see `docs/AGENTS.md`) |
| `plugins/` | Installable plugin payload container (see `plugins/AGENTS.md`) |
| `scripts/` | Zero-dependency static and optional Grok CLI validation (see `scripts/AGENTS.md`) |
| `.github/` | CI workflows (see `.github/AGENTS.md`) |
| `.grok-plugin/` | Marketplace and public component index (see `.grok-plugin/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Preserve zero runtime and package dependencies.
- Prefer native Grok Build features over custom orchestration code.
- Keep all heavy skills explicit with `disable-model-invocation: true`.
- Keep plugin agents under `plugins/oh-my-grok-build/agents/` and skill names under the `ogb-` namespace.
- Agent short names take no `ogb-` prefix. Grok registers them as `oh-my-grok-build:<agent>`; every skill reference must use that qualified form.
- Do not add hooks, `.mcp.json`, `.lsp.json`, executable binaries, or network installers without an accepted architecture decision.
- English is the default documentation language; Korean is the additional translation. Every document ships as a pair: `<name>.md` and `<name>.ko.md`.
- Write commit messages, tag messages, and the repository description in English.
- Update `CHANGELOG.md`, both READMEs, and `.grok-plugin/plugin-index.json` when public components change.

### Testing Requirements
- Run `npm test` after every manifest, skill, agent, index, or docs-pair change.
- Run `npm run validate:grok` when a Grok Build CLI is available.
- CI runs only `npm test` (static gate).

### Common Patterns
- Skills: bare names (`ogb-plan`, `ogb-verify`); agents: qualified spawn names (`oh-my-grok-build:executor`).
- Pipeline: interview → plan (pending approval) → start/ultrawork → verify; doctor for install diagnosis; workflow for reusable Rhai.
- Writer agents use worktree isolation; explorers stay read-only; no child fan-out.

## Dependencies

### Internal
- `plugins/oh-my-grok-build/` — installable plugin content
- `scripts/validate.mjs` — primary static gate
- `.grok-plugin/*` — marketplace and index manifests
- `docs/*` — design and evidence docs

### External
- Node.js `>=20` (validation only)
- Optional `grok` CLI for `validate:grok` and live install checks
- Grok Build native subagents, worktrees, and workflows at runtime

<!-- MANUAL: Repository hard rules (preserved). Do not weaken these on regeneration.
- Preserve zero runtime dependencies.
- Prefer native Grok Build features over custom orchestration code.
- Keep all heavy skills explicit by retaining `disable-model-invocation: true`.
- Keep plugin agents under `plugins/oh-my-grok-build/agents/` and skill names under the `ogb-` namespace.
- Agent names take no `ogb-` prefix. Grok registers them as `oh-my-grok-build:<agent>`, so the qualifier already namespaces them, and every reference from a skill must use that qualified form.
- Do not add hooks, `.mcp.json`, `.lsp.json`, executable binaries, or network installers without an accepted architecture decision.
- Run `npm test` after every manifest, skill, agent, or index change.
- Run `npm run validate:grok` when a Grok Build CLI is available.
- English is the default documentation language; Korean is the additional translation. Every document ships as a pair: `<name>.md` in English and `<name>.ko.md` in Korean. Update both halves in the same change — `npm test` fails when one is missing.
- Write commit messages, tag messages, and the repository description in English.
- Update `CHANGELOG.md`, both READMEs, and `.grok-plugin/plugin-index.json` when public components change.
-->
