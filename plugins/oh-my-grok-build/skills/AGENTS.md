<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-28 | Updated: 2026-07-28 -->

# skills

## Purpose
User-invocable heavy skill packages for the plugin. Each skill is an `ogb-*` directory with `SKILL.md` (and optional `references/`). Models must not auto-invoke these skills; all keep `disable-model-invocation: true`.

## Key Files

| File | Description |
|------|-------------|
| _(none at this level)_ | Each skill is a subdirectory with its own `SKILL.md` |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `ogb-interview/` | Socratic direction interview before planning (see `ogb-interview/AGENTS.md`) |
| `ogb-plan/` | Consensus plan: explorer → planner → architect → critic (see `ogb-plan/AGENTS.md`) |
| `ogb-start/` | Approved-plan execution with worktrees and integration (see `ogb-start/AGENTS.md`) |
| `ogb-ultrawork/` | Bounded parallel execution of independent tasks (see `ogb-ultrawork/AGENTS.md`) |
| `ogb-verify/` | Fresh independent verification, no repair (see `ogb-verify/AGENTS.md`) |
| `ogb-workflow/` | Author/validate native Rhai workflows (see `ogb-workflow/AGENTS.md`) |
| `ogb-doctor/` | Install and discovery diagnosis (see `ogb-doctor/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Keep the seven-skill inventory stable unless index + validator expectations update in the same change.
- Always use qualified agent names in skill text; skills themselves are referenced by bare names.
- No nested orchestration: skills may spawn agents, not other orchestrator skills as children of fan-out.
- Preserve MIT license and author metadata conventions in frontmatter.

### Testing Requirements
- `npm test` validates inventories, frontmatter, and agent-reference rules across all skill markdown.
- Public skill surface changes also require CHANGELOG, both READMEs, and `plugin-index.json`.

### Common Patterns
- Pipeline skills: interview → plan → start/ultrawork → verify
- Side tools: doctor (install), workflow (Rhai)
- Optional `references/*.md` templates next to `SKILL.md`

## Dependencies

### Internal
- `../agents/` for spawn targets
- `plugin.json` skills directory pointer

### External
- Grok Build skill registration, subagents, worktrees, workflows, Plan mode

<!-- MANUAL: -->
