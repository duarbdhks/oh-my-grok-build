# Graph Report

verdict: PASS | PARTIAL | BLOCKED | FAILED_VERIFICATION | WAITING_APPROVAL

## Goal

## Graph admission

- item count:
- why a graph (or why it was skipped):

## Dependency audit

| Step | Reads prior output? | Hidden edges | Verdict |
|---|---|---|---|

If no hidden edges were found, write that explicitly here.

## Phases run

| Phase | Mode | Nodes / batches | Children spawned | Result |
|---|---|---|---|---|

## Completeness

- expected:
- received:
- missing IDs:
- fan-in layers:

A report that synthesizes over a gap without naming missing IDs is incomplete.

## Failures treated as data

- item ID:
- error:
- continued? yes/no
- redo attempts (max ~3):

## Changes

- files changed:
- integrated worktrees (absolute paths or `none`):
- residual worktrees (absolute paths or `none`):
- residual cleanup owner (`user` / `host` / `none`) and exact next action:

## Child budget

- children spawned:
- concurrent max used:
- residual of the 16-call lifetime cap:
- under_launch_reason (mandatory if a ready wave launched under the 8 concurrent cap without a hidden-edge bind):

## Verification

- claims re-derived from source:
- `oh-my-grok-build:verifier` verdict:
- commands and results:

## Approval gate

- action / scope / cost, or `none, nothing irreversible`:
- human decision: approved / denied / not required:

## Risks and unverified scope

## Recommended next action
