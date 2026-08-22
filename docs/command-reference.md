# Command reference

[한국어](command-reference.ko.md)

All eight shipped skills use `disable-model-invocation: true`. Grok Build will not silently auto-invoke them during ordinary chat or `/goal` unless the user (or an explicit instruction the user approved) calls them.

Spawn agents only as `oh-my-grok-build:<name>`.

---

## `/ogb-interview`

| Field | Value |
|---|---|
| Purpose | Turn a vague idea into a decision-ready direction brief |
| Input | Rough idea, design to stress-test, or incomplete requirements |
| Source edits | Never |
| Parallelism | May use read-only explorers for repository facts; no implementers |
| Agents | `oh-my-grok-build:explorer` when investigation is needed |
| Artifact | Direction brief marked pending approval |
| Failure behavior | Stops on hard ambiguity; does not invent a plan or code |
| Safety | One question per turn; never asks what the repo can answer; no commit/push |

**Native boundary:** Does not save an implementation plan. Hand off to `/ogb-plan`.

**Example:**

```text
/ogb-interview We need rate limiting on the public API but I'm unsure about keys and limits
```

---

## `/ogb-plan`

| Field | Value |
|---|---|
| Purpose | Consensus implementation plan without code changes |
| Input | Concrete outcome, or a brief from `/ogb-interview` |
| Steps | Ground → explore → planner draft → architect review → critic gate (up to 3 loops) |
| Source edits | Never (application source, locks, migrations untouched) |
| Agents | `explorer`, `planner`, `architect`, `critic` (qualified) |
| Artifact | Native saved plan, `pending approval` |
| Failure behavior | Routes to interview when too vague; critic rejects incomplete plans |
| Safety | Plan mode first; no execution skill invocation |

**Native boundary:** Save/inspect with Grok plan controls such as `/view-plan`. Does not implement.

**Example:**

```text
/ogb-plan Add optimistic locking to the user profile API and return 409 on conflict
```

---

## `/ogb-start`

| Field | Value |
|---|---|
| Purpose | Execute an approved plan with dependency-aware ownership |
| Input | `current-saved-plan`, `explicit-plan-path`, or narrow `concrete-task` |
| Source edits | Yes, within task ownership |
| Parallelism | Sequential waves by default; independent tasks may use worktree-isolated executors |
| Agents | `explorer`, `executor`, then verification path with `verifier` |
| Artifact | Implementation + execution report evidence |
| Failure behavior | Stops after bounded repair attempts; preserves unrelated user changes |
| Safety | No commit/push/PR/deploy without explicit request; records session continuity only when real |

**Native boundary:** Worktrees and session resume belong to Grok Build. OGB reports lifecycle; it does not invent resume.

**Example:**

```text
/ogb-start Implement the currently approved plan
```

---

## `/ogb-ultrawork`

| Field | Value |
|---|---|
| Purpose | Cut elapsed time for independent tasks with bounded native parallelism |
| Input | Two or more tasks with disjoint ownership and clear acceptance criteria |
| Source edits | Yes, under ownership rules |
| Parallelism | Max-safe `C*` (iso cap 4 default, up to 8 when proven, 2 on shared resources); workflow budget default 8 |
| Agents | Default implementers/explorers only: `executor`, `explorer` (qualified), each with closed `ROLE_LENS` |
| Artifact | Parallel report (concurrency, agents, verification, risks) |
| Failure behavior | No silent mechanism swap; same-file ownership banned in one wave |
| Safety | Prefers native workflow for large schema-shaped fan-out; no external orchestrator |

**Native boundary:** Uses Grok `spawn_subagent`, worktrees, and `workflow` only.

**Example:**

```text
/ogb-ultrawork Fix the TypeScript errors in these three independent modules and verify each one
```

---

## `/ogb-graph`

| Field | Value |
|---|---|
| Purpose | Compile mixed-dependency work into a DAG and execute it in the same invocation |
| Input | A large or mixed-dependency task; architecture must already be decided |
| Source edits | Yes, within node ownership |
| Parallelism | Phased fan-out (batch 10–25 items per child, max 8 concurrent, 16 lifetime children) and layered fan-in of 20–30 |
| Agents | `oh-my-grok-build:explorer`, `oh-my-grok-build:executor`, `oh-my-grok-build:verifier` |
| Artifact | Short phase plan, then a graph report with completeness and gate lines |
| Failure behavior | Failed items are data; targeted redo of affected nodes; stop and re-plan if the same failure class repeats |
| Safety | Real dependency edges only; missing IDs named at fan-in; irreversible actions wait for a human |

**Native boundary:** Parent owns all `spawn_subagent` calls. Does not nest `/ogb-ultrawork`, `/ogb-start`, or `/ogb-workflow`. Prints a phase plan, then starts Phase 1 immediately — this is an execution skill, not `/ogb-plan`.

**Example:**

```text
/ogb-graph Audit all API endpoint handlers for missing auth, patch independent cases, and verify the highest-severity findings from source
```

---

## `/ogb-verify`

| Field | Value |
|---|---|
| Purpose | Independent re-verification of claims or acceptance criteria |
| Input | Diff range, plan criteria, or “current changes” |
| Source edits | No (verifier is read-only) |
| Parallelism | May batch read-only checks; does not implement fixes unless separately requested |
| Agents | `oh-my-grok-build:verifier` (+ bundled `check-work` when available) |
| Artifact | Verification report with `PASS` / `FAIL` / `INCONCLUSIVE` |
| Failure behavior | Returns reproducible evidence; does not silently mark success |
| Safety | Fresh commands preferred; no trust of implementer summary alone |

**Native boundary:** Complements, does not replace, local test tooling.

**Example:**

```text
/ogb-verify Re-verify that the changes in origin/main...HEAD meet the requirements
```

---

## `/ogb-workflow`

| Field | Value |
|---|---|
| Purpose | Author reusable Grok workflows with OGB safety guards |
| Input | Repeated multi-step process that should become a workflow |
| Source edits | May write workflow definition files when authoring; no app feature scope by default |
| Parallelism | Defined inside the workflow; default `agent_budget` 8 |
| Agents | Uses native `create-workflow` path; workflow may spawn agents later |
| Artifact | Validated workflow script / saved definition |
| Failure behavior | Requires `validate_only` smoke before offering a live run |
| Safety | Finite inputs; no nested workflows; approval for live external side effects |

**Native boundary:** Grok owns workflow runtime, pause, resume, and journals. OGB does not create a second runtime.

**Example:**

```text
/ogb-workflow Create a reusable parallel review workflow for changed TypeScript files
```

---

## `/ogb-doctor`

| Field | Value |
|---|---|
| Purpose | Diagnose plugin install, component discovery, and native prerequisites |
| Input | Optional `--fix-plan` for remediation suggestions |
| Source edits | Read-only by default |
| Parallelism | None required |
| Agents | None required |
| Artifact | PASS/WARN/FAIL report |
| Failure behavior | Lists missing skills/agents/capabilities without mutating the environment by default |
| Safety | Complements native `/doctor` and `grok inspect` |

**Example:**

```text
/ogb-doctor
```

---

## Quick selection matrix

| Situation | Command |
|---|---|
| Vague idea | `/ogb-interview` |
| Need a safe plan | `/ogb-plan` |
| Approved plan, sequential | `/ogb-start` |
| Independent parallel tasks | `/ogb-ultrawork` |
| Mixed-dependency large work | `/ogb-graph` |
| Re-check evidence | `/ogb-verify` |
| Reusable multi-agent process | `/ogb-workflow` |
| Install looks wrong | `/ogb-doctor` |
