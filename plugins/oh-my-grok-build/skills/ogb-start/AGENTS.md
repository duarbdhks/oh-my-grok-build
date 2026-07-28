<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-28 | Updated: 2026-07-28 -->

# ogb-start

## Purpose
Execute an approved plan with dependency-aware waves, worktree-isolated writers, progressive integration, and mandatory verification. Stops on vague scope, missing acceptance criteria, or repeated repair failure.

## Key Files

| File | Description |
|------|-------------|
| `SKILL.md` | Execution protocol, spawn shapes, stop conditions, verify handoff |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `references/` | Execution report template (see `references/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Keep `disable-model-invocation: true`.
- Never absorb, reset, or commit unrelated user changes.
- Default ≤4 concurrent implementers; every file-modifying agent uses `isolation: worktree`.
- ≤2 repair attempts per root cause; stop on third failure, secrets exposure, or plan contradiction.
- After integration, load bare skill `ogb-verify` (not a plugin-prefixed skill name).
- No commit/push/PR/deploy unless the user explicitly asked.

### Testing Requirements
- Static agent-ref and skill inventory checks via `npm test`.
- Live execution needs worktree-capable Grok session.

### Common Patterns
- Writer spawn: `oh-my-grok-build:executor` + `all` + `worktree` + `background: true`
- Explore spawn: `oh-my-grok-build:explorer` + `read-only` + `isolation: none` + `background: true`

## Dependencies

### Internal
- `oh-my-grok-build:executor`, `oh-my-grok-build:explorer`
- Closing skill: `ogb-verify`
- Upstream: approved plan from `ogb-plan`

### External
- Grok Build worktrees and background subagents

<!-- MANUAL: -->
