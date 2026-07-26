# Architecture

[한국어](architecture.ko.md)

## Goal

`oh-my-grok-build` is not an execution engine but an **operating discipline layer**. Grok Build owns the session and the tools; this plugin defines the order and evidence bar for using them.

```text
User
  └─ OGB skills
      ├─ Clarify: one question per turn → direction brief
      ├─ Plan: planner → architect → critic
      ├─ Execute: explorer / executor + native worktree
      ├─ Parallel: native subagents or native workflow
      └─ Verify: direct checks → verifier → check-work

Grok Build native layer
  ├─ session / plan / goal
  ├─ subagents / capability modes
  ├─ git worktrees
  ├─ Rhai workflows
  ├─ skills / agents / plugins
  └─ MCP inheritance / permissions
```

## Division of responsibility

| Concern | Owner |
|---|---|
| Session save/resume | Grok Build |
| Autonomous goal state | Grok Build `/goal` |
| Subagent lifecycle | Grok Build |
| Worktree create/apply/clean up | Grok Build |
| Workflow execution, budget, pause | Grok Build |
| Plugin trust and MCP inheritance | Grok Build |
| Plan quality gate | oh-my-grok-build |
| Execution wave and task-ownership rules | oh-my-grok-build |
| Completion evidence and independent verification order | oh-my-grok-build |

## State strategy

v0.1 does not create a separate database or JSON state file.

- Plans use Grok Build's current saved plan.
- Execution progress uses native todo, subagent, workflow, and goal state.
- Long-term memory is opt-in via Grok Build's `/remember` or memory feature.
- If persistent documentation is needed, the user explicitly exports the plan to a repository document.

This boundary keeps session recovery and concurrent-execution responsibility inside a single runtime.

## Parallel execution rules

- The default number of concurrent implementation agents is 4, raised to at most 8 only when file or subsystem ownership and execution-resource isolation are both proven, and lowered — as far as 2 — when tasks share a schema, configuration, generated file, dependency lock, build output, cache, port, database, or external environment.
- Repeated fan-out uses native workflow, with a default `agent_budget` of 8.
- Writes default to worktree isolation.
- No two agents own the same file at the same time.
- Default (baseline / `/ogb-start` style): between waves, run diff review and narrow verification.
- `/ogb-ultrawork` is progressive within a wave: review each child's diff as soon as that child finishes (read-only; do not wait for a wave-wide comparison before reviewing a finished child); backfill freed slots when an unstarted task's ownership is already proven disjoint; integrate worktree results one at a time and rerun narrow checks after each apply.

## Verification rules

```text
Define acceptance criteria
  → direct test/typecheck/build
  → independent verifier reproduction
  → bundled check-work final check
  → PASS / FAIL / INCONCLUSIVE
```

`check-work` does not replace tests, and it does not take the implementer's reported results at face value.

## Security boundary

The v0.1 plugin includes no hooks, MCP, LSP, executable binaries, or network installers. However, skills and agents can request commands and file changes under the user's Grok permissions, so reviewing the install source and using a proper permission mode are still required.
