<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-28 | Updated: 2026-07-28 -->

# ogb-doctor

## Purpose
Diagnose plugin install health, skill/agent discovery, Grok native capabilities, worktree readiness, and configuration risks. Read-only by default; optional `--fix-plan` emits ordered remediation commands without applying them.

## Key Files

| File | Description |
|------|-------------|
| `SKILL.md` | Doctor workflow: inventory checks, PASS/WARN/FAIL/SKIP table, minimal remediation |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| _(none)_ | No `references/`; CLI/git inspection only |

## For AI Agents

### Working In This Directory
- Keep `disable-model-invocation: true`.
- Do not turn doctor into an auto-fixer that trusts plugins or runs destructive commands.
- Inventory expectations: 7 skills + 6 qualified agents.
- Unqualified same-name agents are WARN (silent wrong-target risk).

### Testing Requirements
- Live: invoke `/ogb-doctor` with Grok CLI and installed plugin.
- Static: skill presence enforced by `scripts/validate.mjs`.

### Common Patterns
- Output compact status table, not long logs
- No agent spawns; inspect environment via CLI/git

## Dependencies

### Internal
- Sibling skills and agents for expected inventory
- Root install docs in README

### External
- `grok` CLI, git, local Grok config paths

<!-- MANUAL: -->
