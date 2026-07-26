# Parallel Execution Report

verdict: PASS | PARTIAL | BLOCKED

## Waves and dependencies

| Wave | Tasks | Depends on |
|---|---|---|

## Concurrency

- chosen concurrent subagents:
- rationale (ownership, shared resources, integration surface, cost, verification method):

## Parallel read-only investigation

<!-- which reads, searches, and configuration lookups ran in the same batch -->

## Long commands

| Command | Overlapped or serialized | Isolation rationale |
|---|---|---|

## Agents

| Agent | subagent_type | Isolation | Worktree | Task | Ownership | Result |
|---|---|---|---|---|---|---|

- child-agent calls used, against the approved budget:
- isolation: `worktree` | `none` (per agent row above)
- worktree path: absolute path when isolation is `worktree`; leave blank when `none`

## Integration

- integrated:
- rejected, and why:

## Overlap achieved

<!-- which serial waits actually overlapped; facts only — no time-savings figures unless measured -->

## Verification

| Command | Exit status | Result summary |
|---|---:|---|

- ogb-verify invoked: yes | no | n/a
- integrated check command:

## Remaining risks and unverified scope
