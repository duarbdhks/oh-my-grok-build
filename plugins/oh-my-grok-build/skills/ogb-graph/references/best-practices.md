# Graph patterns and failure modes

Read this when a plan is unusually large, or when diagnosing why a previous run degraded.

## Contents

- [A worked example](#a-worked-example)
- [Failure modes](#failure-modes)
- [Sizing guidance](#sizing-guidance)
- [When the graph is the wrong tool](#when-the-graph-is-the-wrong-tool)

---

## A worked example

Request: "Audit our 60-endpoint API for auth issues, fix what is safe to fix, and verify."

### Dependency audit

| Step | Reads prior output? | Verdict |
|---|---|---|
| Read each endpoint's handler | No, each is independent input | Parallel, 60 items |
| Identify the shared auth middleware | No, separate file, known upfront | Parallel with the above |
| Classify each endpoint's auth posture | Yes, needs handler + middleware behavior | Depends on both |
| Patch independent handlers | Yes, needs classification of that handler | Per-item, after classify |
| Cluster remaining findings | Yes, needs all classifications and patch results | Depends on both |
| Verify the highest-severity claims | Yes, needs the clustered findings | After clustering |

Hidden edges: the middleware read must complete before classification, because classification interprets each handler relative to middleware defaults. Two patches that edit the same shared helper are not parallel.

### Phases

```
Phase 1 (parallel)     60 handler reads + 1 middleware read
                       batches of ~10 per oh-my-grok-build:explorer
Phase 2 (parallel)     60 classifications, batches of 20
Phase 3 (parallel)     independent patches via oh-my-grok-build:executor
                       worktree isolation; serialize shared-file writes
Phase 4 (fan-in)       3 batch summaries → 1 clustering
                       completeness: expected 60, received 60
Phase 5 (verify)       oh-my-grok-build:verifier re-derives the top findings from source
Phase 6 (gate)         none, unless a remaining action is deploy/send/delete
```

Phase 5 re-reads handlers. A critique pass over the synthesis tends to ratify it.

### What the naive version looks like

"Go through the endpoints one by one." Endpoints 1 through 15 get care, 40 through 60 get a sentence each, and the write-up over-weights whatever was found early. The degradation is invisible in the output.

---

## Failure modes

Fan-in flattening. Symptom: early items are detailed, later ones are vague. Cause: one synthesis over too many inputs. Fix: layer at 20 to 30, and require concrete specifics in each layer.

Phantom parallelism. Symptom: conflicting edits, or later items contradicting earlier ones. Cause: hidden shared writes. Fix: run the hidden-edge check, especially for anything that writes.

The completeness gap. Fan-in over 38 of 40 items, silently. Symptom: nothing, and that is the problem. Fix: count expected vs received at every fan-in and name what is missing.

Plan drift. By phase 4 the mental model no longer matches the plan. Fix: restate the phase's dependency in one line at each boundary.

Over-planning. A 12-node graph for four sequential steps. Fix: no fan-out and fewer than about six subtasks means no formal plan.

Batch abandonment. One item errors and the whole phase halts, discarding completed work. Fix: record the failure, continue, report it at consolidation.

One-agent-per-item stampede. Sixty items become sixty children and blow the host cap of 16 lifetime calls. Fix: batch 10 to 25 items per child so a 60-item phase is about six explorers, not sixty.

Nested orchestration. Calling another OGB execution skill from inside the graph. Fix: this skill is the parent; spawn plugin agents directly.

---

## Sizing guidance

| Scale | Approach |
|---|---|
| < 6 subtasks, no fan-out | No formal plan. Audit dependencies mentally and do the work. |
| 6-30 items | Single fan-out, single fan-in. Plan fits in a short block. |
| 30-100 items | Batch the fan-out (10-25 per child). Two-layer fan-in. |
| 100+ items | Three-layer fan-in. Ask whether a sample plus a targeted sweep answers the question better. |

Propose sampling when a full sweep looks disproportionate, and say so. Do not quietly drop items.

Host caps that bind sizing: at most 8 concurrent children, 16 lifetime child calls without approval. Width is a spawn-cost cap, not ultrawork `C*`.

---

## When the graph is the wrong tool

- Exploratory work whose next step is unknown until the current step returns. Work adaptively, then graph once the shape is known.
- Genuinely sequential pipelines. Extract → transform → load is a chain.
- Single-artifact work. One document, one bug. The overhead exceeds the benefit.
- Independent tasks with no result edges. That is `/ogb-ultrawork`.
- A reusable fixed procedure. That is `/ogb-workflow`.
- An architecture decision that is still open. That is `/ogb-plan`.
- The user asked a question. A question wants an answer, not a workflow.
