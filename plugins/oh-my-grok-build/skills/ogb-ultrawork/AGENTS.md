<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-28 | Updated: 2026-07-28 -->

# ogb-ultrawork

## Purpose
Bounded parallel execution engine for independent tasks. Parallelism is a scheduling tool only; ownership, isolation, budgets, and verification never relax for speed. Parent owns all fan-out.

## Key Files

| File | Description |
|------|-------------|
| `SKILL.md` | Admission gate, hard boundaries, wave protocol, concurrency limits, spawn shapes |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `references/` | Parallel execution report template (see `references/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Keep `disable-model-invocation: true`.
- Admission: only when ≥2 tasks are independent; otherwise single executor or `/ogb-start`.
- Never nest orchestrators (no OMC ultrawork, no recursive ultrawork, no nested workflows).
- Children must not spawn agents, invoke orchestration skills, or launch workflows.
- Concurrency default 4; hard max 8 when fully isolated; shared resources → lower to 2 or serialize.
- Default workflow `agent_budget` 8; >16 child calls needs user approval and a finite list.
- Reject unbounded “check everything” until scoped.
- Finish code changes with bare `ogb-verify`.
- Always use qualified agent names (`oh-my-grok-build:…`); bare short names are a silent wrong-target risk.

### Testing Requirements
- Static skill validation via `npm test`.
- Live scheduling behavior documented in `docs/validation.md`.

### Common Patterns
- 2–4 tasks: parallel `spawn_subagent`
- >4 schema-shaped tasks: native `workflow` tool (after loading `create-workflow`)
- Report via `references/parallel-report-template.md`

## Dependencies

### Internal
- `oh-my-grok-build:executor`, `oh-my-grok-build:explorer`
- Closing skill: `ogb-verify`
- Optional: bundled `create-workflow` for Rhai authoring

### External
- Grok Build subagents, worktrees, workflows

<!-- MANUAL: -->
