---
name: ogb-start
description: Execute an approved Grok Build plan with dependency-aware subagents, isolated worktrees, integration checks, and final verification. Use when the user explicitly asks to implement a reviewed plan or invokes /ogb-start.
argument-hint: "<current plan, plan path, or concrete task>"
disable-model-invocation: true
compatibility: Requires Grok Build subagents and worktree isolation.
license: MIT
metadata:
  author: duarbdhks
  short-description: Execute an approved plan safely
---

# OGB Start

Implement an approved plan without broadening scope, damaging unrelated work, or claiming success without evidence.

## Preconditions

1. Classify the input as exactly one plan source kind: `current-saved-plan`, `explicit-plan-path`, or `concrete-task`.
2. Prefer `current-saved-plan` or `explicit-plan-path`. Accept `concrete-task` only when its scope, acceptance criteria, and authorization are already explicit and no high-risk design decision remains.
3. Record session continuity separately from plan source. Only `current-saved-plan` can report `same-session`, `grok-continue`, or `grok-resume`; use `not-applicable` for `explicit-plan-path` and `concrete-task`.
4. Never infer continuity from similar text or a plan path. Report `grok-continue` or `grok-resume` only when the corresponding native Grok session operation actually occurred.
5. Treat this skill invocation as execution authorization only for the stated scope.
6. If the request is vague, has no acceptance criteria, or introduces a high-risk decision not covered by the plan, stop and route to `/ogb-plan`.
7. If the plan is a large mixed-dependency DAG that this skill would have to re-implement as nested fan-out, stop and tell the user to run `/ogb-graph` on the same task. Do not invoke `/ogb-graph` as a child of this skill.
8. Inspect `git status`, the current branch, and existing diffs before delegation. Never absorb, reset, overwrite, stage, or commit unrelated user changes.
9. Record a baseline command or test result when one is available so regressions can be distinguished from pre-existing failures.

## Execution protocol

1. **Read and normalize the plan**
   - Extract tasks, dependencies, file ownership, acceptance criteria, stop conditions, rollout, and rollback.
   - Convert the plan into a dependency-aware task list using Grok Build's native todo/task tracking.

2. **Assign ownership**
   - Give each task a non-overlapping file or subsystem boundary.
   - Use `oh-my-grok-build:explorer` with `capability_mode: read-only` for investigation.
   - Use `oh-my-grok-build:executor` for implementation.

3. **Run parallel waves**
   - Spawn independent implementation agents in the same wave with `background: true`.
   - Use `isolation: worktree` for every file-modifying subagent unless the task is guaranteed to touch a unique generated artifact and the parent explicitly owns integration.
   - Default to at most four concurrent implementation agents. Raise the limit only when the plan demonstrates independent ownership.

4. **Use a complete delegation contract**
   - Include the user-visible outcome, why the task matters, exact scope, relevant paths and symbols, constraints, acceptance criteria, expected commands, and prohibited changes.
   - Require each executor to report files changed, tests run, results, assumptions, and blockers.

5. **Integrate deliberately**
   - Wait for all agents in a wave.
   - Inspect each diff before applying its worktree result.
   - Apply one worktree at a time, rerun narrow checks after each integration, and resolve conflicts consciously.
   - Do not silently choose one conflicting implementation over another.

6. **Handle failures**
   - Allow at most two targeted repair attempts for the same root cause.
   - Stop after the same failure appears three times, a destructive action becomes necessary, a secret or external permission is missing, or the plan's assumptions are contradicted.

7. **Verify**
   - Load and follow the `ogb-verify` skill after integration. Skills are registered under their bare name; only agents carry the `oh-my-grok-build:` prefix.
   - Completion requires fresh evidence for every acceptance criterion.

8. **Finish safely**
   - Summarize the final diff, validation evidence, remaining risk, and rollback notes.
   - Report the plan source kind and session continuity without conflating plan reuse with session resume.
   - List integrated and residual worktrees by absolute path, or report `none`. For every residual worktree, name the cleanup owner as `user` or `host` and the exact manual next action; use `none` when no cleanup remains.
   - Do not commit, push, open a pull request, merge, deploy, or modify remote state unless the user explicitly requested that action.

## Recommended spawn shape

For a write task, use the equivalent of:

```text
subagent_type: oh-my-grok-build:executor
capability_mode: all
isolation: worktree
background: true
```

For exploration, use the equivalent of:

```text
subagent_type: oh-my-grok-build:explorer
capability_mode: read-only
isolation: none
background: true
```

## Final response

Use the execution report shape in `references/execution-report-template.md`. Distinguish `PASS`, `PARTIAL`, and `BLOCKED`; never collapse an unverified result into success.
