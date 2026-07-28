<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-28 | Updated: 2026-07-28 -->

# references

## Purpose
Templates for consensus plan documents produced by `ogb-plan` (planner → architect → critic).

## Key Files

| File | Description |
|------|-------------|
| `plan-template.md` | Implementation plan structure: scope, waves, AC, rollback, verification |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| _(none)_ | Flat template directory |

## For AI Agents

### Working In This Directory
- Keep sections that support architect and critic gates (AC, risks, verification feasibility).
- Any agent mentions must use `` `oh-my-grok-build:<name>` `` forms.

### Testing Requirements
- Covered by skill-wide markdown agent-ref rules in `scripts/validate.mjs`.

### Common Patterns
- Durable plan sections only; no implementation steps that mutate the repo from the plan skill itself

## Dependencies

### Internal
- Parent skill `../SKILL.md`

### External
- None

<!-- MANUAL: -->
