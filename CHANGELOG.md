# Changelog

All notable changes to this project are documented here.

## 0.1.0 - 2026-07-25

### Added

- Grok Build marketplace and plugin manifests.
- Six explicit-invocation skills: `ogb-plan`, `ogb-start`, `ogb-ultrawork`, `ogb-verify`, `ogb-workflow`, and `ogb-doctor`.
- Six plugin agents: planner, architect, critic, explorer, executor, and verifier.
- Dependency-free static validator and GitHub Actions workflow. It rejects `permissionMode` values Grok Build does not emit and frontmatter fields Grok Build does not document.
- Architecture, evaluation, validation, security, and roadmap documentation.

### Documentation language

English is now the default documentation language and Korean is the additional translation. Every document ships as a pair — `README.md` / `README.ko.md`, and `docs/<name>.md` / `docs/<name>.ko.md`. The old `README.en.md` is superseded by `README.md`. `npm test` now fails if one half of a pair is missing or if an English document links into the Korean set.

### Verified in a live Grok Build session

All six skills were executed against `grok` 0.2.112. Write-capable skills ran in throwaway git repositories.

| Skill | Result |
|---|---|
| `/ogb-doctor` | Six skills and six agents resolved; native prerequisites available |
| `/ogb-plan` | Planner → Architect (REVISE) → Critic (APPROVE) loop completed without touching source |
| `/ogb-ultrawork` | Two `oh-my-grok-build:ogb-executor` children ran in isolated worktrees and were integrated |
| `/ogb-start` | Two worktree executors; runtime acceptance evidence; no commit or push |
| `/ogb-verify` | Independent verifier plus bundled `check-work`; zero files modified |
| `/ogb-workflow` | Rhai workflow authored and passed `validate_only` |

Still unproven: worktree merge conflict handling, and a live run of an authored workflow.

### Verified against the Grok Build CLI

- `grok plugin validate plugins/oh-my-grok-build` passes on `grok` 0.2.112.
- Agent frontmatter now uses `permissionMode: auto` for `ogb-executor`. The earlier `acceptEdits` value is a Claude Code mode with no Grok Build equivalent, so it would never have taken effect.
- Removed `promptMode`, `outputFormat`, and `agentsMd` from agent frontmatter — none are documented for Grok Build agent definitions. Each agent's output contract lives in its prompt body instead.
- Marketplace `category` is now `workflows` and `keywords` are invocation triggers rather than generic nouns, matching the convention used by published Grok Build marketplaces.
- `ogb-ultrawork` now carries the same recommended spawn shape as `ogb-start`. It previously told the model to make parallel `spawn_subagent` calls without ever naming a `subagent_type`, which invited a bare `ogb-executor` that does not resolve.
- Both READMEs now state that agents are registered plugin-qualified while skills keep their bare name.
- Fixed component naming in two skills, found by running `/ogb-doctor` in a live session. Grok registers plugin agents as `oh-my-grok-build:<agent>` but keeps skills on their bare name. `ogb-doctor` looked for bare agent names that never exist, and `ogb-start` referenced the `ogb-verify` skill with the agent-qualified form. The validator now rejects a qualified reference that does not name a real agent.

### Deliberately omitted

- Custom hooks, MCP servers, binaries, tmux workers, provider routing, and a duplicate persistence engine.
