---
name: ogb-graph
description: Compile a large or mixed-dependency task into a DAG, then execute ready nodes with Grok subagents, layered fan-in, targeted retry, and a human gate for irreversible work. Use for many similar subtasks, 10+ files or sources, work that is about to be narrated as a long chain, or /ogb-graph.
argument-hint: "<large or mixed-dependency task>"
disable-model-invocation: true
compatibility: Requires Grok Build subagents; worktree isolation for write nodes.
license: MIT
metadata:
  author: duarbdhks
  short-description: DAG plan and execute in one invocation
---

# OGB Graph

Turn a request into a dependency graph, then run it. This skill is an execution orchestrator, not a planning-only compiler. Print a short phase plan, say what you are about to run, and start Phase 1 in the same invocation. Do not wait for a second command.

Most multi-step work is narrated as a chain because that is how people talk, not because every step depends on the last. A chain burns context linearly, so quality thins toward the end. The graph tells you which work can fan out, which must wait, where results must be consolidated before they overflow, and which single node needs a human.

`/ogb-graph <task>` is the whole interface. No flags, no JSON state file, no nested orchestrator. This skill is the only orchestration layer in the run.

## Hard boundary

- Never call `/ogb-ultrawork`, `/ogb-start`, `/ogb-workflow`, or another run of this skill as a child.
- Never spawn a child that fans out again. Parent owns every `spawn_subagent` and every wave.
- Do not invent a plugin agent. Default spawn types are only `oh-my-grok-build:explorer`, `oh-my-grok-build:executor`, and `oh-my-grok-build:verifier`.
- Do not invoke `/ogb-verify` as a nested command. Verification is a node in this graph: spawn `oh-my-grok-build:verifier` yourself.
- Do not create a second plan database. Native todos and the short phase plan in the conversation are enough.
- Do not hardcode model IDs. If the host can resolve a tier, name `fast`, `standard`, or `strongest` and let Grok inherit otherwise.
- Do not commit, push, open a pull request, merge, deploy, or modify remote state unless the user explicitly asked.
- Never overwrite unrelated user changes.

## Admission

Use a formal graph when there is structure to exploit: many similar subtasks, a real mix of independent and dependent steps, 10+ files or sources, a previous run that thinned out, or an irreversible action that needs a gate.

Fewer than about six subtasks with no meaningful fan-out: skip the formal plan, do the dependency audit in your head, and do the work. Do not dress a true chain up as a DAG.

Architecture still undecided (for example, JWT versus session) belongs in `/ogb-plan` first. Independent tasks with no result edges belong in `/ogb-ultrawork`. A reusable fixed procedure belongs in `/ogb-workflow`. A question that only wants an answer is not a graph.

If the request is unbounded (“check everything”), convert it to a finite item list before any fan-out. If a full sweep of 100+ items looks disproportionate, propose a sample plus a targeted sweep rather than quietly sampling.

## The core move: the dependency audit

For every pair of steps you were about to sequence, ask one question:

> Does step B literally read the output of step A?

If B only needs the same inputs A had, they are independent. If B needs A's result, there is a real edge. The word “then” is narration.

Work the list explicitly:

```
Step: Summarize each of 40 support tickets
  Reads prior output? No, each ticket is independent input
  → parallel

Step: Cluster the summaries into themes
  Reads prior output? Yes, needs all 40 summaries
  → depends on the summarize group

Step: Draft recommendations
  Reads prior output? Yes, needs the clusters
  → depends on clustering
```

### Hidden edges

Check these even when no data flows. Silence usually means the check was skipped; if none apply, say so.

- Shared writes. Two nodes editing the same file must be ordered.
- Rate limits and quotas. Cap batch width instead of pretending the tasks are free to stampede.
- Schema or interface changes. Complete the change before work that consumes it.
- Irreversible or outward-facing work (production writes, sends, deletes, deploys). Sit behind verification and a human approval gate.

A cycle means the decomposition is wrong. Merge the looping nodes or re-plan. Do not hand a cyclic graph to execution.

## Fan-in is where quality is lost

Consolidate in layers of 20 to 30 items:

```
100 file analyses
  → 4 batch summaries (25 each)
    → 1 final synthesis
```

1. Count before you consolidate. At every fan-in, `received` must equal `expected`. If 38 of 40 came back, name the two missing IDs. A synthesis that silently drops items is worse than one that reports a hole.
2. Preserve specifics upward: paths, quantities, names, evidence. Impressions do not compose.

Same shape for every item in a group. Ragged free-form essays make fan-in do reconciliation it should not have to.

## Output format

Produce this short phase plan before any work, then start Phase 1:

```markdown
## Goal
[One sentence.]

## Dependency audit
[Each step, whether it reads prior output, and the verdict. Note hidden edges or state that none were found.]

## Phases
**Phase 1 - parallel (N items, batches of M)**
- [what runs, and why these are independent]

**Phase 2 - depends on Phase 1**
- [what runs, and which output it consumes]

## Consolidation
[Layer structure and the completeness check.]

## Verification
[What gets checked before this is called done. Omit only for low-stakes work.]

## Approval gate
[Required if any node is irreversible or outward-facing: the exact action, scope, and cost. Write "none, nothing irreversible" otherwise.]

## Risks
[What could make this plan wrong.]
```

A machine-readable copy lives in `references/plan-schema.md`. Emit it only when handing the plan to an external runner.

## Executing the phases

Pick the mechanism per phase, not once for the whole plan.

**Subagent fan-out.** Dispatch independent items in one turn. Each child gets pasted shared context, its slice, and the exact output shape. Item 47 must not be degraded by 46 items of accumulated state. Batch items per child when items are small; one child per item when the work is substantial. Default batch size is 10 to 25, matching the original sizing tables in `references/best-practices.md`.

**Inline batching.** When items are too small or too entangled with evolving shared context, issue independent parent tool calls in one turn instead of spawning.

Nodes that stay inline regardless: the dependency audit and rubric, final synthesis and prioritization, and any irreversible action.

### Spawn shapes

Read node:

```text
subagent_type: oh-my-grok-build:explorer
capability_mode: read-only
isolation: none
background: true
```

Write node:

```text
subagent_type: oh-my-grok-build:executor
capability_mode: all
isolation: worktree
background: true
```

Verification node:

```text
subagent_type: oh-my-grok-build:verifier
capability_mode: read-only
isolation: none
background: true
```

Give every child the goal, paths, constraints, acceptance criteria, prohibited changes, and the output fields for its group. Children must not spawn, invoke an orchestration skill, or launch a workflow.

### Host caps

These are spawn-cost caps, not ultrawork's `C*` formula and not `ROLE_LENS`.

- Concurrent children in one launch: at most 8.
- Lifetime child-agent calls in this invocation without explicit user approval: 16, counting every successful spawn of any type.
- Never two write children on the same file in the same wave.
- A `writes` ∩ `reads` overlap is an edge, not a parallel pair.
- When the next wave would exceed the residual, finish inlined or stop and report rather than silently dropping items.

### During execution

- Report failures as data. Record the failed item, continue the batch, and surface it at consolidation. Halt the phase only when the failure invalidates the rest.
- Re-read the plan at each phase boundary. One line restating what this phase consumes is enough to catch drift.
- Stop and re-plan when the graph is wrong. Discovering that two “independent” items conflict is normal. Say what changed. Do not quietly work around it.
- Inspect each write child's diff as it finishes. Integrate worktrees one at a time and rerun a narrow check after each apply.

## Verification

For high-stakes work (code that will merge, analysis that will inform a decision, output the user cannot easily check), add a verification node after consolidation. It re-derives at least one claim from source. Give `oh-my-grok-build:verifier` the claims and the sources, not your synthesis.

When verification fails, redo only the affected nodes, then re-verify the changed portion plus a fresh sample. Cap at about three attempts. If the same class of failure returns twice, the rubric or the graph is wrong: stop and re-plan. If it still cannot pass, deliver the failure report instead of shipping output you know is flawed.

## Irreversible actions

Verification is a quality check, not an authorization. Production writes, sends, deletes, deploys, and destructive migrations get a human approval node after verification passes. The graph hard-stops there.

The request must be decidable in seconds: exact action, scope, and cost. Not “ready to proceed?” If the human says no, their reason goes into state and the affected nodes redo. The irreversible action itself always runs inline, never in a child.

## Final response

Use `references/graph-report-template.md`. A report missing Goal, completeness (`expected` / `received` / missing IDs), verification, and the approval-gate line is incomplete. List integrated and residual worktrees by absolute path, or `none`. For every residual worktree, name the cleanup owner and the exact manual next action.

## Further reading

- `references/best-practices.md` — 60-endpoint example, failure modes, sizing. Read it when the graph is large (50+ nodes) or a previous run degraded.
- `references/plan-schema.md` — JSON plan for an external runner only.
- `references/graph-report-template.md` — closing report shape.
