# Evaluation of an `oh-my-claudecode`-based build

[한국어](upstream-evaluation.ko.md)

## Final verdict

A good idea, but recommended **only as a Grok Build-native plugin redesign, not a full fork**.

## Comparing the options

| Criterion | Full fork · name substitution | Grok-native plugin |
|---|---:|---:|
| Initial implementation speed | 4/5 | 4/5 |
| Fit with Grok capabilities | 2/5 | 5/5 |
| Maintainability | 1/5 | 4/5 |
| Cost of tracking upstream | 1/5 | 4/5 |
| Execution stability | 2/5 | 4/5 |
| Avoiding feature duplication | 1/5 | 5/5 |
| Total | 11/30 | 26/30 |

## Why a full fork is unfavorable

The original is not a simple collection of prompts. It bundles a Claude Code plugin, a Node.js CLI, the Claude Agent SDK, state storage, hooks, bridges, a tmux-based external CLI worker, and install/migration logic. Fitting this to Grok Build would require rewriting the runtime boundary, not just substituting names.

At the same time, Grok Build already natively provides:

- plugins and a marketplace,
- user/project skills and agents,
- parallel subagents and capability modes,
- git worktree isolation,
- savable Rhai workflows,
- long-running autonomous execution via `/goal`,
- final independent verification via `check-work`.

So porting the original's execution engine over would pit two state machines, two task-management systems, and two sets of parallel execution rules against each other.

## What is worth bringing over

- a clear boundary between planning and execution,
- the sequential Planner → Architect → Critic consensus,
- the execution discipline of splitting independent work into waves,
- a verifier kept separate from the implementer,
- the rule of never claiming completion without fresh test evidence,
- rollback/abort conditions for high-risk work.

## What was not brought over

- Claude-only model tiers and routing,
- the tmux CLI worker,
- OMC's own state JSON and session hooks,
- the Claude SDK bridge,
- new MCP servers,
- the worktree, workflow, goal, and memory features Grok Build already has.

## Key risks

1. **Changes to Grok Build's extension interface**: as of July 2026, feature expansion is fast, so `plugin.json`, agent frontmatter, and the workflow schema need to be checked on every release.
2. **Limits of prompt-based enforcement**: this is a content-only plugin with no hooks, so the planning/verification boundary must be paired with permission modes and instructions.
3. **Parallelism cost**: Grok's native workflow default budget allows for large jobs, so this plugin explicitly sets a default of 8.
4. **Worktree merge conflicts**: splitting task ownership incorrectly erases the benefit of parallelization.

## Recommendation

For v0.1, it is appropriate to ship as a content-only plugin in its current structure, and to distribute static Rhai workflows only after installation, planning, parallel-edit, and verification scenarios have passed in real Grok sessions.
