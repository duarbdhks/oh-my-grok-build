# Design decisions

[한국어](design-decisions.ko.md)

Short decision log for product boundaries. Broader redesign rationale versus a full upstream fork: [Upstream evaluation](upstream-evaluation.md).

## DD-001 — Content-only plugin

**Decision:** Ship skills and agents as markdown only. No hooks, MCP, LSP, binaries, or npm runtime dependencies in the plugin package.

**Why:** Stay inside Grok Build’s trust and permission model. Reduce install surface and security review cost.

## DD-002 — Native-first orchestration

**Decision:** Do not reimplement session storage, goal state machines, worktree managers, or workflow engines.

**Why:** Grok Build already owns those lifecycles. Duplication creates drift and false continuity claims.

## DD-003 — Separate plan from execute

**Decision:** `/ogb-plan` never implements. Execution requires a later explicit `/ogb-start`, `/ogb-ultrawork`, or native `/goal`.

**Why:** Stops vague chat from becoming unreviewed source edits.

## DD-004 — Independent verification

**Decision:** Final gates use `oh-my-grok-build:verifier` (and bundled `check-work` when available), not the implementer’s self-report alone.

**Why:** Confidence is not evidence. Self-approval is a common multi-agent failure mode.

## DD-005 — Bounded parallelism

**Decision:** Max-safe concurrency with ownership bans, isolation caps, residual child budgets, and workflow budgets.

**Why:** Unbounded fan-out looks fast and fails on shared files, ports, and locks.

## DD-006 — Qualified agent names

**Decision:** Agents are short file names (`executor.md`) but must be spawned as `oh-my-grok-build:executor`.

**Why:** Grok namespaces plugin agents; bare names can resolve to user agents with the same short name.

## DD-007 — Explicit cost, no silent fallback

**Decision:** No silent model/tool/MCP fallback paths in skill contracts. Fail visibly.

**Why:** Silent degradation produces false PASS narratives.

## DD-008 — Git protection by instruction

**Decision:** Skills forbid commit/push/PR/force-reset unless the user explicitly asks.

**Why:** Protect in-progress user work. Permissions still sit with Grok Build.

## DD-009 — disable-model-invocation on heavy skills

**Decision:** All seven skills set `disable-model-invocation: true`.

**Why:** Prevent accidental orchestration inside ordinary generation or `/goal` without user intent.
