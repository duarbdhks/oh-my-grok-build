<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-28 | Updated: 2026-07-28 -->

# ogb-workflow

## Purpose
Design, create, and smoke-validate reusable native Grok Build Rhai workflows. Not a second orchestrator: prefer ordinary subagents for 2–4 one-off tasks; use workflows for repeated or schema-shaped fan-out.

## Key Files

| File | Description |
|------|-------------|
| `SKILL.md` | Workflow authoring protocol, budgets, validation, path conventions |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `references/` | Workflow checklist template (see `references/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Keep `disable-model-invocation: true`.
- Must load bundled `create-workflow` before any Rhai write or edit.
- Require finite schema, deterministic phases, explicit stops, and bounded budget.
- Default save path: project `.grok/workflows/<name>.rhai`; user-wide `~/.grok/workflows/` only if requested.
- Run `validate_only: true` before any live run; do not live-run unless the user asked.
- Default `agent_budget` 8; no nested workflow launches.
- Prefer subagents over a new workflow for small one-off fan-out.

### Testing Requirements
- Static skill validation via `npm test`.
- Rhai smoke: workflow tool `validate_only: true` with representative args.

### Common Patterns
- Checklist-driven authoring via `references/workflow-checklist.md`
- Budget and stop conditions explicit in every script

## Dependencies

### Internal
- Sibling orchestration skills for when not to use workflows
- Plugin agents as workflow child types when appropriate

### External
- Bundled Grok `create-workflow` skill and native `workflow` tool

<!-- MANUAL: -->
