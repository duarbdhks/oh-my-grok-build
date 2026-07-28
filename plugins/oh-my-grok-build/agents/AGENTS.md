<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-28 | Updated: 2026-07-28 -->

# agents

## Purpose
Grok Build agent registry for this plugin. Six Markdown agent definitions implement planning, architecture review, critique, read-only exploration, bounded execution, and independent verification. Registered via `plugin.json` `"agents": "agents"` as `oh-my-grok-build:<short-name>`.

## Key Files

| File | Description |
|------|-------------|
| `planner.md` | Evidence-backed implementation plan author (`permissionMode: plan`) |
| `architect.md` | Architecture review after draft plan (`plan`) |
| `critic.md` | Plan completeness and risk gate (`plan`) |
| `explorer.md` | Read-only codebase investigation (`plan`) |
| `executor.md` | One bounded implementer, typically worktree-isolated (`auto`) |
| `verifier.md` | Independent evidence-based verification, no edits (`plan`) |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| _(none for content)_ | Ignore operational `.omc/` if present; do not document session state as product |

## For AI Agents

### Working In This Directory
- File stem must match frontmatter `name` (short name, no `ogb-` prefix).
- Keep exactly these six agents unless validation inventories and index are updated together.
- Frontmatter: `model: inherit`; correct `permissionMode`; no `bypassPermissions`; no unsupported fields (`promptMode`, `outputFormat`, `agentsMd`).
- Preserve role split: planner/architect/critic plan-only; explorer/verifier no mutations; executor no silent git/remote and no child fan-out.
- Skills must reference agents only as `` `oh-my-grok-build:<name>` `` — bare names can resolve to unrelated user agents.

### Testing Requirements
- `scripts/validate.mjs` enforces agent set, permission modes, and qualified refs from skills.
- After agent edits: `npm test`; optional `npm run validate:grok`.

### Common Patterns
- Spawn writers: `oh-my-grok-build:executor` + `capability_mode: all` + `isolation: worktree`
- Spawn explorers: `oh-my-grok-build:explorer` + `capability_mode: read-only` + `isolation: none`
- Parent skills own all fan-out; children never spawn

## Dependencies

### Internal
- Consumed by skills under `../skills/`
- Validated by `scripts/validate.mjs` and listed in `.grok-plugin/plugin-index.json`

### External
- Grok Build agent registration and permission modes

<!-- MANUAL: -->
