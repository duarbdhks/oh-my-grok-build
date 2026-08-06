<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-28 | Updated: 2026-08-06 -->

# ogb-ultrawork

## Purpose
Max-safe parallel execution for independent tasks. Score `C*` from ownership and isolation, launch up to that ceiling, inject ROLE_LENS on each child, and never relax ownership, isolation, budgets, or verification for speed. Parent owns all fan-out.

## Key Files

| File | Description |
|------|-------------|
| `SKILL.md` | Admission gate, hard boundaries, mechanism-first protocol, C* formula, ROLE_LENS, spawn shapes |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `references/` | Parallel execution report template (see `references/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Keep `disable-model-invocation: true`.
- Admission: only when ≥2 tasks are independent; otherwise single executor or `/ogb-start`.
- Never nest orchestrators (no external orchestrator, no recursive ultrawork, no nested workflows).
- Children must not spawn agents, invoke orchestration skills, or launch workflows.
- Protocol order: map → mechanism first → ROLE_LENS → score `C*` → isolate → launch → collect/backfill → verify.
- `C* = min(N_ready, iso_cap, remaining_child_calls, 8)` is a ceiling; prefer `C = C*` when isolation allows; under-launch needs `under_launch_reason`.
- `iso_cap`: shared resource → 2; default separable → 4; full isolation proven → 8; same-file or N_ready < 2 → no parallel wave.
- `remaining_child_calls = 16 − (prior_spawn_children + prior_workflow_logical_agents)` without approval to exceed.
- Workflow `agent_budget` default 8 is not a second unlimited pool; hybrid runs share the residual.
- >4 repeated/schema-shaped tasks: prefer native `workflow` even if isolation would allow high spawn concurrency.
- ROLE_LENS closed enum on spawn-path children; default path is executor/explorer only; no agency unless user-named.
- Reject unbounded “check everything” until scoped.
- Finish code changes with bare `ogb-verify`.
- Always use qualified agent names (`oh-my-grok-build:…`); bare short names are a silent wrong-target risk.
- Report via `references/parallel-report-template.md` with formula fields and ROLE_LENS column.

### Testing Requirements
- Static skill validation via `npm test`.
- Live scheduling behavior documented in `docs/validation.md`.

### Common Patterns
- 2–4 distinct or 5–8 heterogeneous tasks: parallel `spawn_subagent` up to `C*`
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
