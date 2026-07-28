<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-28 | Updated: 2026-07-28 -->

# references

## Purpose
Checklists and templates for authoring native Grok Build Rhai workflows under `ogb-workflow`.

## Key Files

| File | Description |
|------|-------------|
| `workflow-checklist.md` | Finite schema, phases, budgets, validation, and stop conditions checklist |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| _(none)_ | Flat template directory |

## For AI Agents

### Working In This Directory
- Keep checklist items aligned with `create-workflow` and no-nested-workflow rules.
- Emphasize `validate_only` before live runs and explicit `agent_budget`.

### Testing Requirements
- Static presence/text validation as part of skill markdown checks.

### Common Patterns
- Pre-flight checklist rather than a full Rhai sample (samples live under project/user workflow dirs)

## Dependencies

### Internal
- Parent skill `../SKILL.md`

### External
- Bundled `create-workflow` skill conventions

<!-- MANUAL: -->
