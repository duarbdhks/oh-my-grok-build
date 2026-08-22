---
name: ogb-ultrawork
description: Run multiple independent engineering tasks in parallel with max-safe concurrency scoring, role lenses, and bounded Grok subagent or workflow budgets. Use for explicit parallel work, separate modules, broad reviews, or /ogb-ultrawork.
argument-hint: "<parallelizable task set>"
disable-model-invocation: true
compatibility: Requires Grok Build subagents; workflows are optional for larger fan-out.
license: MIT
metadata:
  author: duarbdhks
  short-description: Max-safe parallel execution with role lenses
---

# OGB Ultrawork

Reduce the elapsed time of independent work while keeping its safety: ownership, isolation, budgets, and verification never relax to buy speed. Parallelism is a scheduling tool, not permission to duplicate effort or increase scope. Prefer launching up to the max-safe concurrent count when isolation is proven; under-launching needs an explicit reason. Everything here runs on Grok Build's native subagents, tool calls, background execution, and workflows — no other orchestrator.

## Admission gate

Use this skill when two or more tasks can proceed without depending on each other's output. If the work is a large mixed-dependency DAG, use `/ogb-graph` instead of flattening it. If ownership overlaps or the task is primarily sequential, use a single `oh-my-grok-build:executor` or `/ogb-start` instead.

## Hard boundary

These rules do not bend for throughput:

- Never call another orchestrator from this skill — not an external orchestrator, not a second run of this skill. This skill is the only orchestration layer in the run.
- A child agent must not fan out again: no spawning subagents, no invoking an orchestration skill (this one included), no launching workflows. The parent owns all fan-out.
- A workflow, or any agent a workflow spawned, must not start another workflow.
- Do not assign the same task to several agents and settle the result by vote. A review from explicitly independent perspectives is a distinct task per perspective, not a duplicate.
- No fan-out without a finite work list (step 1 owns mapping and rejects unbounded scope until finite).
- No new flags, option parsing, or state engines. `/ogb-ultrawork <task>` stays the whole interface, and the safe behavior is the default behavior.
- Do not spawn third-party or `agency-*` agents from this skill unless the user explicitly named that agent in the invocation. The default path never requires agency.
- On the default path, `subagent_type` remains only `oh-my-grok-build:executor` or `oh-my-grok-build:explorer`.

## Protocol

### 1. Map the work

- List deliverables, dependencies, files or subsystems, write ownership, shared resources, expected evidence, acceptance criteria, and estimated cost.
- Build a finite task card per item: goal, writes, reads, shared_resources, depends_on, acceptance, cost band.
- Batch independent read-only investigation — file reads, code and symbol searches, configuration lookups, `git status`, branch, and diff checks, test and build configuration discovery, and read-only exploration of separate subsystems — into the same round of tool calls. Sequence a call only when its input depends on another call's result.
- Group work into waves. Tasks in one wave must be independent.
- Order the waves critical-path-first: start prerequisites of later tasks, long-running work, long-latency commands (builds, test suites, installs, static analysis), and high-signal checks that can abort the run early. Short non-critical work runs alongside the critical path, never ahead of it.
- Reject unbounded instructions such as “check everything” until the scope is converted into a finite list.

### 2. Choose the native mechanism FIRST

Mechanism choice is not inverted by a high later `C*`.

- HARD RULE (Scenario F non-regression): if tasks are more than four and repeated or schema-shaped, prefer the native `workflow` tool even when isolation would allow a high spawn concurrency. Do not launch eight direct executors for F-class work. Before writing or editing a Rhai workflow, load Grok Build's bundled `create-workflow` skill and follow it. Pass `agent_budget` explicitly (default eight).
- Else if two to four distinct tasks, or five to eight heterogeneous (non-schema-shaped) tasks with ownership that can be scored: use parallel `spawn_subagent` with the spawn shapes below.
- For more than eight heterogeneous independent tasks, wave them under the concurrency ceiling rather than inventing a higher hard max.

### 3. Classify specialist + ROLE_LENS

For each spawn-path task, assign one primary `ROLE_LENS` before launch.

Closed enum (exact):

`general | backend | frontend | data | sre | security | docs | test`

Selection:

- Map the task acceptance surface to one primary lens.
- Multi-domain tasks: primary by majority of write paths or by explicit acceptance criteria; default `general`.
- Applies to both `oh-my-grok-build:executor` and `oh-my-grok-build:explorer` children on the spawn path.
- Workflow logical agents: optional; the report may use `n/a` when the workflow schema does not carry a lens.

Inject this block into every spawn-path child prompt:

```text
ROLE_LENS: <enum value>
LENS_FOCUS:
- patterns and subsystems to inspect first
- evidence commands expected
PROHIBITED_BY_LENS:
- touch surfaces outside task ownership
```

Domain expertise is a prompt lens, not a new plugin agent type.

### 4. Score concurrency (C* ceiling)

Score only on the spawn path. Workflow runs use `agent_budget` (default eight) and still consume the global child-call residual below.

#### N_ready

Count of tasks in the current wave that:

1. have acceptance criteria,
2. have no unintegrated prerequisite,
3. are not started,
4. are pairwise file-ownership disjoint with every other task already selected for this launch batch,
5. do not read a file another selected task writes. A `writes` ∩ `reads` overlap between two task cards is a dependency, not a parallel pair — shared type modules, barrel exports, and generated interfaces are the usual carriers, and file-ownership disjointness alone does not catch them.

#### iso_cap (first matching wins on the candidate ready set)

| Condition | Result |
|---|---|
| `N_ready < 2`, or same-file ownership conflict cannot be split | No parallel wave: use a single executor or `/ogb-start`. Report serialized; do not report a parallel `C*`. |
| Any shared mutable resource among ready-set members (schema, config, generated file, dependency lock, build output, cache, container, port, database, external env, migration target) even if files are disjoint | `iso_cap = 2` |
| Ownership separable and no shared-resource hit, but full execution-resource isolation is not proven for every concurrent member | `iso_cap = 4` (default tier) |
| File/subsystem ownership separable and execution resources isolated for every concurrent member of the ready set | `iso_cap = 8` |

Never set `iso_cap` from task count alone.

#### remaining_child_calls

```text
remaining_child_calls = 16 − (prior_spawn_children + prior_workflow_logical_agents)
```

- Without explicit user approval, do not exceed sixteen child-agent calls for the whole ultrawork run.
- Decrement for each child agent successfully created (`spawn_subagent` of any type, and each logical agent a workflow launches).
- Do not decrement for pure parent tool calls (reads, greps, status).
- If a spawn fails before a child is created, do not decrement.
- Workflow `agent_budget` (default eight) is the per-workflow budget cap, not a second unlimited pool. Hybrid spawn + workflow runs share the residual above.
- When `remaining_child_calls = 0`, stop fan-out.

#### Formula

```text
C* = min(N_ready, iso_cap, remaining_child_calls, 8)
```

Rules:

- `C*` is a ceiling. Actual launch concurrency `C ≤ C*`.
- Prefer `C = C*` when isolation allows; if launching fewer, set `under_launch_reason` in the report.
- Never pad fake tasks to fill slots.
- Absolute concurrent hard max remains eight (belt-and-suspenders even if `iso_cap` is mis-tiered).
- Default native workflow `agent_budget`: eight, passed explicitly.

### 5. Isolate writes and shared resources

- Run each file-modifying child in `isolation: worktree`.
- Never let two children own the same file in the same wave.
- Read-only review or exploration children can share the main workspace.
- Confirm `iso_cap` against the ready set before launch; shared mutable resources force the lower tier from step 4.
- Overlap long commands — builds, test suites, installs, benchmarks — with independent work instead of blocking on them, whether a backgrounded child owns the command or the runtime runs it in the background.
- Never overlap two commands that share a build output directory, cache, container, port, database schema, migration target, generated artifact, or external test environment. A shared resource means serialized order, stated explicitly. Command serialization is independent of agent `C*`.
- `background: true` in the spawn shape backgrounds a child's turn, not a shell command; treat the two as separate decisions.
- Record every overlap-or-serialize decision and its isolation rationale for the final report.

### 6. Give complete context and launch together

- Every child receives the task goal, relevant paths, constraints, acceptance criteria, prohibited changes, the ROLE_LENS block, and the expected compact report.
- Launch a wave's independent tasks in one batch, not one at a time, up to `C ≤ C*`. A wave qualifies when no task consumes another's result, no two tasks write the same file, shared resources are accounted in `iso_cap`, and every task carries its own acceptance criteria, scope, and prohibitions.
- Do not ask multiple agents the same broad question unless independent perspectives are the explicit purpose.
- Pre-spawn check: every ready task has ROLE_LENS; `C*` is computed; batch size equals min(`C*`, N_ready) unless `under_launch_reason` is set; all `subagent_type` values are qualified `oh-my-grok-build:*`.

### 7. Collect, backfill, integrate

- Inspect each child's diff as soon as that child finishes; review is read-only and does not wait for the rest of the wave.
- When a slot frees and an unstarted task's ownership is already proven disjoint, recompute `N_ready`, `iso_cap`, `remaining_child_calls`, and `C*`, then launch immediately. Only a task that consumes a prior result waits until that result is integrated.
- Compare results, reject duplicate or conflicting edits, and apply isolated changes to the workspace one at a time — never by silently picking a winner.
- Rerun the narrow checks after each integration.
- Launch dependent tasks only after prerequisites are integrated.

### 8. Verify

- Run narrow checks per task and one integrated check for the final workspace.
- For code changes, finish with the `ogb-verify` skill.

## Recommended spawn shape

Grok registers plugin agents under a plugin-qualified name, and this plugin's agents use short names because the qualifier already carries the namespace. Dropping the `oh-my-grok-build:` prefix does not fail loudly — it can resolve to an unrelated agent of the same short name from the user's own environment, and the wave then runs with the wrong prompt. Always spawn with the qualified name.

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

Inject the ROLE_LENS block from step 3 into the child prompt body for both shapes.

Skills are the opposite: they are registered under their bare name. The closing verification step is the `ogb-verify` skill, with no plugin prefix.

## Anti-patterns

- Setting concurrency from task count alone.
- Padding tasks to fill slots.
- Under-launching without `under_launch_reason` when `C*` is higher.
- Spawning eight direct executors for schema-shaped F-class work instead of a workflow.
- Using bare agent names or inventing plugin agent names outside the six.
- Default-routing to `agency-*` when the user did not name that agent.
- Reporting invented elapsed-time savings.
- Child fan-out or nested ultrawork/workflow.
- Claiming a parallel `C*` when the path is serialized.

## Stop conditions

Stop and report rather than expanding fan-out when:

- ownership cannot be separated,
- agent outputs contradict the plan,
- the remaining budget is insufficient,
- the same root cause fails three times,
- a workflow would require nested workflow launches,
- merge conflicts indicate the tasks were not independent.

## Output

Use `references/parallel-report-template.md`. A report without a filled Concurrency formula block is incomplete. If `chosen C < C*`, `under_launch_reason` is mandatory. Report the waves and their dependencies, the formula fields, which read-only investigation ran in parallel, which long commands overlapped with other work and the isolation rationale for each, agents launched (with ROLE_LENS) and budget spent, each agent's ownership, changes integrated and changes rejected, integrated and residual worktrees by absolute path or `none`, the cleanup owner and exact manual next action for residual worktrees, which serial waits were actually overlapped, verification commands with their results, and remaining risks or unverified scope. Report overlap as fact, not arithmetic: if elapsed-time savings were not measured, do not invent a number. Keep raw logs out of the final response unless they are necessary to explain a failure.
