---
name: ogb-ultrawork
description: Run multiple independent engineering tasks in parallel with bounded Grok subagent or workflow budgets. Use for explicit parallel work, separate modules, broad reviews, or /ogb-ultrawork.
argument-hint: "<parallelizable task set>"
disable-model-invocation: true
compatibility: Requires Grok Build subagents; workflows are optional for larger fan-out.
license: MIT
metadata:
  author: duarbdhks
  short-description: Bounded parallel execution
---

# OGB Ultrawork

Reduce the elapsed time of independent work while keeping its safety: ownership, isolation, budgets, and verification never relax to buy speed. Parallelism is a scheduling tool, not permission to duplicate effort or increase scope. Everything here runs on Grok Build's native subagents, tool calls, background execution, and workflows — no other orchestrator.

## Admission gate

Use this skill when two or more tasks can proceed without depending on each other's output. If ownership overlaps or the task is primarily sequential, use a single executor or `/ogb-start` instead.

## Hard boundary

These rules do not bend for throughput:

- Never call another orchestrator from this skill — not an external orchestrator, not a second run of this skill. This skill is the only orchestration layer in the run.
- A child agent must not fan out again: no spawning subagents, no invoking an orchestration skill (this one included), no launching workflows. The parent owns all fan-out.
- A workflow, or any agent a workflow spawned, must not start another workflow.
- Do not assign the same task to several agents and settle the result by vote. A review from explicitly independent perspectives is a distinct task per perspective, not a duplicate.
- No fan-out without a finite work list (step 3 owns the rejection rule).
- No new flags, option parsing, or state engines. `/ogb-ultrawork <task>` stays the whole interface, and the safe behavior is the default behavior.

## Protocol

1. **Map the work**
   - List deliverables, dependencies, files or subsystems, write ownership, expected evidence, and estimated cost.
   - Batch independent read-only investigation — file reads, code and symbol searches, configuration lookups, `git status`, branch, and diff checks, test and build configuration discovery, and read-only exploration of separate subsystems — into the same round of tool calls. Sequence a call only when its input depends on another call's result.
   - Group work into waves. Tasks in one wave must be independent.
   - Order the waves critical-path-first: start prerequisites of later tasks, long-running work, long-latency commands (builds, test suites, installs, static analysis), and high-signal checks that can abort the run early. Short non-critical work — a doc edit, an independent test — runs alongside the critical path, never ahead of it.

2. **Choose the native mechanism**
   - For two to four distinct tasks, use parallel `spawn_subagent` calls with the agent types in the spawn shape below.
   - For more than four repeated or schema-shaped tasks, prefer the native `workflow` tool.
   - Before writing or editing a Rhai workflow, load Grok Build's bundled `create-workflow` skill and follow it.

3. **Bound cost**
   - Default concurrent subagents: four.
   - Raise the limit — never past eight — only when file or subsystem ownership is separable and execution resources are isolated: no shared schema, shared configuration, generated file, dependency lock, build output, cache, port, database, or external environment among the wave's tasks.
   - Any of those shared resources lowers concurrency instead, down to two. Two well-isolated agents finish sooner than six contending ones; below two there is no parallel wave left, so use a single executor or `/ogb-start`.
   - Decide concurrency from dependency structure, write ownership, shared mutable resources, integration surface, expected cost, and how each task will be verified — never from task count alone.
   - Default native workflow `agent_budget`: eight, passed explicitly.
   - Do not exceed sixteen child-agent calls without explicit user approval and a concrete work list.
   - Reject unbounded instructions such as “check everything” until the scope is converted into a finite list.

4. **Isolate writes and shared resources**
   - Run each file-modifying child in `isolation: worktree`.
   - Never let two children own the same file in the same wave.
   - Read-only review or exploration children can share the main workspace.
   - Overlap long commands — builds, test suites, installs, benchmarks — with independent work instead of blocking on them, whether a backgrounded child owns the command or the runtime runs it in the background.
   - Never overlap two commands that share a build output directory, cache, container, port, database schema, migration target, generated artifact, or external test environment. A shared resource means serialized order, stated explicitly.
   - `background: true` in the spawn shape backgrounds a child's turn, not a shell command; treat the two as separate decisions.
   - Record every overlap-or-serialize decision and its isolation rationale for the final report.

5. **Give complete context and launch together**
   - Every child receives the task goal, relevant paths, constraints, acceptance criteria, prohibited changes, and the expected compact report.
   - Launch a wave's independent tasks in one batch, not one at a time, up to the concurrency limit set in step 3. A wave qualifies when no task consumes another's result, no two tasks write the same file, no shared mutable resource remains (step 4), and every task carries its own acceptance criteria, scope, and prohibitions.
   - Do not ask multiple agents the same broad question unless independent perspectives are the explicit purpose.

6. **Collect and integrate**
   - Inspect each child's diff as soon as that child finishes; review is read-only and does not wait for the rest of the wave.
   - When a slot frees and an unstarted task's ownership is already proven disjoint, launch it immediately. Only a task that consumes a prior result waits, until that result is integrated.
   - Compare results, reject duplicate or conflicting edits, and apply isolated changes to the workspace one at a time — never by silently picking a winner.
   - Rerun the narrow checks after each integration.
   - Launch dependent tasks only after prerequisites are integrated.

7. **Verify**
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

Skills are the opposite: they are registered under their bare name. The closing verification step is the `ogb-verify` skill, with no plugin prefix.

## Stop conditions

Stop and report rather than expanding fan-out when:

- ownership cannot be separated,
- agent outputs contradict the plan,
- the remaining budget is insufficient,
- the same root cause fails three times,
- a workflow would require nested workflow launches,
- merge conflicts indicate the tasks were not independent.

## Output

Use `references/parallel-report-template.md`. Report the waves and their dependencies, the chosen concurrency and why, which read-only investigation ran in parallel, which long commands overlapped with other work and the isolation rationale for each, agents launched and budget spent, each agent's ownership, changes integrated and changes rejected, integrated and residual worktrees by absolute path or `none`, the cleanup owner and exact manual next action for residual worktrees, which serial waits were actually overlapped, verification commands with their results, and remaining risks or unverified scope. Report overlap as fact, not arithmetic: if elapsed-time savings were not measured, do not invent a number. Keep raw logs out of the final response unless they are necessary to explain a failure.
