<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-28 | Updated: 2026-07-28 -->

# references

## Purpose
Templates for parallel execution reports required by `ogb-ultrawork` output protocol.

## Key Files

| File | Description |
|------|-------------|
| `parallel-report-template.md` | Waves, concurrency rationale, agents, integration, verification, risks |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| _(none)_ | Flat template directory |

## For AI Agents

### Working In This Directory
- Keep overlap reporting as facts only (no invented time-savings numbers).
- Include isolation and worktree path fields for writer agents.
- Agent type columns should expect qualified `oh-my-grok-build:*` names.

### Testing Requirements
- Static validation of skill/reference markdown via `npm test`.

### Common Patterns
- Verdict `PASS | PARTIAL | BLOCKED` plus tabular wave and agent inventories

## Dependencies

### Internal
- Parent skill `../SKILL.md`

### External
- None

<!-- MANUAL: -->
