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

Reduce elapsed time by parallelizing only genuinely independent work. Parallelism is a scheduling tool, not permission to duplicate effort or increase scope.

## Admission gate

Use this skill when two or more tasks can proceed without depending on each other's output. If ownership overlaps or the task is primarily sequential, use a single executor or `/ogb-start` instead.

## Protocol

1. **Map the work**
   - List deliverables, dependencies, files or subsystems, write ownership, expected evidence, and estimated cost.
   - Group work into waves. Tasks in one wave must be independent.

2. **Choose the native mechanism**
   - For two to four distinct tasks, use parallel `spawn_subagent` calls with the agent types in the spawn shape below.
   - For more than four repeated or schema-shaped tasks, prefer the native `workflow` tool.
   - Before writing or editing a Rhai workflow, load Grok Build's bundled `create-workflow` skill and follow it.

3. **Bound cost**
   - Default concurrent subagents: four.
   - Default native workflow `agent_budget`: eight, passed explicitly.
   - Do not exceed sixteen child-agent calls without explicit user approval and a concrete work list.
   - Reject unbounded instructions such as “check everything” until the scope is converted into a finite list.

4. **Isolate writes**
   - Run each file-modifying child in `isolation: worktree`.
   - Never let two children own the same file in the same wave.
   - Read-only review or exploration children can share the main workspace.

5. **Give complete context**
   - Every child receives the task goal, relevant paths, constraints, acceptance criteria, prohibited changes, and the expected compact report.
   - Do not ask multiple agents the same broad question unless independent perspectives are the explicit purpose.

6. **Collect and integrate**
   - Wait for the wave, compare results, reject duplicate or conflicting edits, and apply isolated changes one at a time.
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

Report waves, agents launched, budget spent, changes accepted or rejected, verification evidence, and remaining gaps. Keep raw logs out of the final response unless they are necessary to explain a failure.
