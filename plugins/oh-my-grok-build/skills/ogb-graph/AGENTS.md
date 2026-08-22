<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-22 | Updated: 2026-08-22 -->

# ogb-graph

## Purpose
One-shot DAG orchestrator. Audit real dependencies, print a short phase plan, execute ready nodes with Grok subagents, layer fan-in, retry failed nodes, and hard-stop irreversible actions for a human. Not a planning-only compiler and not a wrapper around other OGB orchestrators.

## Key Files

| File | Description |
|------|-------------|
| `SKILL.md` | Admission, dependency audit, hidden edges, spawn shapes, host caps, verification, approval gate |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `references/` | Worked example, plan schema, closing report (see `references/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Keep `disable-model-invocation: true`.
- Print the short phase plan, then start Phase 1 in the same invocation.
- Never nest `/ogb-ultrawork`, `/ogb-start`, `/ogb-workflow`, or another graph run.
- Spawn only `oh-my-grok-build:explorer`, `oh-my-grok-build:executor`, and `oh-my-grok-build:verifier`.
- Children must not fan out. Parent owns every wave.
- Batch 10–25 items per child; concurrent spawn cap 8; lifetime child cap 16 without approval.
- Fan-in in layers of 20–30; count `expected` vs `received`; name missing IDs.
- Verification is a graph node (fresh `oh-my-grok-build:verifier`), not a nested `/ogb-verify` command.
- Irreversible actions stay inline behind a human gate.
- Always use qualified agent names; never backtick a short agent name.
- Close with `references/graph-report-template.md`.

### Testing Requirements
- Static skill validation via `npm test`.
- Live DAG scenarios stay unverified until recorded in `docs/validation.md`.

### Common Patterns
- Read: `oh-my-grok-build:explorer` + `read-only` + `isolation: none` + `background: true`
- Write: `oh-my-grok-build:executor` + `all` + `worktree` + `background: true`
- Verify: `oh-my-grok-build:verifier` + `read-only` + `isolation: none` + `background: true`
- Linear work under six subtasks: skip the formal graph and do the work

## Dependencies

### Internal
- `oh-my-grok-build:explorer`, `oh-my-grok-build:executor`, `oh-my-grok-build:verifier`
- Optional prior `/ogb-plan` only when an architecture decision is still open

### External
- Grok Build subagents and worktrees

<!-- MANUAL: -->
