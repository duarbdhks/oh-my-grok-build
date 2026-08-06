<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-28 | Updated: 2026-08-06 -->

# references

## Purpose
Templates for parallel execution reports required by `ogb-ultrawork` output protocol.

## Key Files

| File | Description |
|------|-------------|
| `parallel-report-template.md` | Waves, C* formula fields, ROLE_LENS, agents, integration, verification, risks |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| _(none)_ | Flat template directory |

## For AI Agents

### Working In This Directory
- Require the Concurrency formula block: `N_ready`, `iso_cap` (+ rule row), `remaining_child_calls`, `C*`, chosen `C`, `under_launch_reason`, `mechanism`.
- Include ROLE_LENS per agent row (`n/a` allowed for workflow logical agents without a lens).
- Keep overlap reporting as facts only (no invented time-savings numbers).
- Include isolation and worktree path fields for writer agents.
- Agent type columns should expect qualified `oh-my-grok-build:*` names.

### Testing Requirements
- Static validation of skill/reference markdown via `npm test`.

### Common Patterns
- Verdict `PASS | PARTIAL | BLOCKED` plus tabular wave and agent inventories
- Incomplete without formula fields when a parallel spawn wave ran

## Dependencies

### Internal
- Parent skill `../SKILL.md`

### External
- None

<!-- MANUAL: -->
