# Concepts

[한국어](concepts.ko.md)

## What this project is

**oh-my-grok-build (OGB)** is a content-only Grok Build plugin. It ships skills and agents as markdown. It does not run a daemon, open a state database, install binaries, or register MCP/LSP servers.

One-line positioning:

> Lightweight orchestration discipline for Grok Build: consensus planning, bounded parallel execution, and independent verification — without replacing native runtime features.

## What this project is not

- Not a fork of Grok Build
- Not an official xAI product
- Not a second execution engine like a Claude-agent daemon with its own SQLite store
- Not a replacement for native `/goal`, worktrees, workflows, or session resume

## Core loop

```text
Interview (optional) → Plan → Execute → Verify
```

| Stage | Command | Mutates application source? |
|---|---|---|
| Clarify | `/ogb-interview` | No |
| Plan | `/ogb-plan` | No |
| Inspect plan | `/view-plan` (native) | No |
| Execute | `/ogb-start`, `/ogb-ultrawork`, or `/ogb-graph` | Yes, within owned scope |
| Long run | `/goal` (native) | Depends on prompt |
| Verify | `/ogb-verify` | No (read-only verification) |
| Reusable fan-out | `/ogb-workflow` | Authors workflow definitions only by default |
| Diagnose | `/ogb-doctor` | No by default |

## Ownership model

Execution skills require non-overlapping file or subsystem ownership. Two implementers must not write the same file in the same wave. Writes default to native git worktree isolation.

## Parallelism model

Parallelism is bounded, not “as many agents as possible.”

- `/ogb-ultrawork` scores a max-safe concurrency `C*` from ready tasks, isolation, and residual child budget.
- `/ogb-graph` compiles mixed-dependency work into a DAG, fans out ready nodes (batch 10–25, concurrent cap 8, lifetime cap 16), and consolidates in layers of 20–30 with an explicit completeness check. It does not nest other orchestrators.
- Default isolation cap is 4; up to 8 only when ownership and resource isolation are proven; 2 when shared schema/config/ports/databases are involved.
- Large repetitive schema-shaped fan-out prefers native workflows with an explicit `agent_budget` (default 8) rather than unbounded direct spawns.

Details: [Architecture](architecture.md).

## Verification model

Completion is evidence-based:

1. Acceptance criteria defined up front
2. Direct test / typecheck / build as applicable
3. Independent `oh-my-grok-build:verifier` reproduction
4. Bundled `check-work` as a final check when available
5. Verdict: `PASS` / `FAIL` / `INCONCLUSIVE`

The implementer does not self-certify the final gate.

## Session and plan continuity

- Saved plans are owned by Grok Build plan controls.
- A plan does **not** automatically appear in a brand-new session.
- Resume with `grok -c` or `grok -r` before `/ogb-start` when you need the same saved plan.
- OGB records continuity only when a native continue/resume actually occurred.

## Naming conventions

| Kind | Convention | Example |
|---|---|---|
| Skill / slash command | bare `ogb-*` name | `/ogb-plan` |
| Agent spawn | plugin-qualified | `oh-my-grok-build:executor` |

Bare agent names like `executor` can resolve to a same-named user agent. Always use the qualified form.

## Related reading

- [Architecture](architecture.md)
- [Design decisions](design-decisions.md)
- [Upstream evaluation](upstream-evaluation.md)
