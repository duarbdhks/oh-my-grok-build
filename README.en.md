# oh-my-grok-build

[![built for](https://img.shields.io/badge/built%20for-grok--build-black)](https://github.com/xai-org/grok-build)
[![validate](https://github.com/duarbdhks/oh-my-grok-build/actions/workflows/validate.yml/badge.svg)](https://github.com/duarbdhks/oh-my-grok-build/actions/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

> A plugin for **[Grok Build](https://github.com/xai-org/grok-build)** — xAI's terminal coding agent.
> Official docs: [docs.x.ai/build/overview](https://docs.x.ai/build/overview)

[한국어](README.md)

A Grok Build-native toolkit for consensus planning, bounded parallel execution, and evidence-based verification.

This project is inspired by the workflow discipline of `oh-my-claudecode`, but it does not fork or reproduce its Claude-specific runtime. Grok Build already provides plugins, subagents, worktree isolation, workflows, and `/goal`; this plugin adds a thin, maintainable operating protocol on top.

## Commands

| Command | Purpose |
|---|---|
| `/ogb-plan` | Planner → Architect → Critic consensus plan without source edits |
| `/ogb-start` | Execute an approved plan with dependency-aware worktree isolation |
| `/ogb-ultrawork` | Run bounded parallel work for independent tasks |
| `/ogb-verify` | Gather fresh test/build evidence and run independent verification |
| `/ogb-workflow` | Author and smoke-validate reusable native workflows |
| `/ogb-doctor` | Diagnose plugin discovery and required Grok capabilities |

## Agents

The plugin ships six role agents: `ogb-planner`, `ogb-architect`, `ogb-critic`, `ogb-explorer`, `ogb-executor`, and `ogb-verifier`.

Those are file names and frontmatter names. Grok registers plugin agents under a plugin-qualified name, so spawn them as `oh-my-grok-build:ogb-planner`. Skills are the opposite — they keep their bare name, so the commands above are `ogb-plan`, not `oh-my-grok-build:ogb-plan`.

## Install

```bash
grok plugin marketplace add duarbdhks/oh-my-grok-build
grok plugin install oh-my-grok-build --trust
grok plugin enable oh-my-grok-build
```

Or install the plugin subdirectory directly:

```bash
grok plugin install duarbdhks/oh-my-grok-build#plugins/oh-my-grok-build --trust
grok plugin enable oh-my-grok-build
```

Verify with:

```bash
grok plugin details oh-my-grok-build
grok inspect
```

## Long-running work

For long-running work, keep the stages explicit: run `/ogb-plan`, review the saved plan, use native `/goal` to execute it, and finish with `/ogb-verify`. The plugin does not add a second Autopilot state machine.

## Design boundary

This repository intentionally ships no daemon, database, hooks, MCP server, native binary, provider router, or tmux worker. It relies on Grok Build for session lifecycle, `/goal`, workflows, worktrees, subagents, and MCP inheritance.

Version `0.1.0` ships with static validation plus a live smoke pass: all six skills were executed against Grok Build 0.2.112, covering installation, plugin-qualified subagent spawning, worktree integration, and independent verification. Worktree merge *conflict* handling and a live workflow run are the two paths still unproven — see `docs/validation.ko.md` for the full evidence table.

See the Korean documentation for the full evaluation and architecture.

## License

MIT. See `NOTICE.md` for upstream inspiration and trademark disclaimers.
