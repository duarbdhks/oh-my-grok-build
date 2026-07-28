<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-28 | Updated: 2026-07-28 -->

# ogb-plan

## Purpose
Consensus implementation planning before code. Spawns explorer → planner → architect → critic sequentially for reviews, saves a native plan artifact, and ends pending user approval without implementing.

## Key Files

| File | Description |
|------|-------------|
| `SKILL.md` | Plan workflow, spawn order, review caps, high-risk gates |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `references/` | Plan document template (see `references/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Keep `disable-model-invocation: true` and planning-only posture.
- Enter native Plan mode first.
- Architect and critic must not run in parallel; max three review rounds.
- Vague requests should recommend `/ogb-interview`.
- Next execution command is `/ogb-start` only after user approval.
- Always spawn agents with qualified names.

### Testing Requirements
- Static validation of skill text and agent refs via `npm test`.
- Live consensus quality is manual.

### Common Patterns
1. `oh-my-grok-build:explorer` (parallel OK for subsystems)
2. `oh-my-grok-build:planner`
3. `oh-my-grok-build:architect`
4. `oh-my-grok-build:critic`

## Dependencies

### Internal
- All six agents under `../../agents/`
- Upstream: `ogb-interview`; downstream: `ogb-start`

### External
- Grok Build Plan mode and subagents

<!-- MANUAL: -->
