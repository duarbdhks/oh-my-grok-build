# Validation Status

[한국어](validation.ko.md)

> The counts on this page describe the `0.1.0` live run, when the plugin shipped six skills. `/ogb-interview` was added afterwards and has passed static validation and `grok plugin validate`, but has not yet been exercised in a live session.

## Completed Validation

- JSON parsing: marketplace, plugin index, plugin manifest
- marketplace source and plugin directory match
- plugin name and version match
- skill name/directory/frontmatter match
- agent name/filename/frontmatter match
- public component index matches the actual files
- confirmed skill auto-invocation is disabled
- confirmed content-type boundaries: no hooks, MCP, LSP, executable binaries, or npm dependencies
- Node.js static validation script and GitHub Actions configuration

## Validation Confirmed with the Real Grok CLI

Run directly in a `grok` 0.2.112 (stable) environment.

- `grok plugin validate plugins/oh-my-grok-build` → PASS (`1 skill dir(s), 0 command dir(s), 1 agent dir(s)`)
- Cross-checked the `.grok-plugin/marketplace.json` and `plugin-index.json` schemas field-by-field against the actual `xai-official` marketplace cache
- Confirmed the install commands in the README (`grok plugin marketplace add` / `install --trust` / `enable` / `details`) actually exist in `grok plugin --help`
- Cross-checked agent frontmatter fields against the official user guide and local agent definitions. During this, discovered that `permissionMode: acceptEdits` is a value that doesn't exist in Grok Build and corrected it to `auto`. Removed `promptMode`, `outputFormat`, and `agentsMd`, which had no documentation or real-usage basis.
- Real installation via the GitHub marketplace path: `grok plugin marketplace add duarbdhks/oh-my-grok-build` → `install --trust` → `enable` all succeeded
- Confirmed runtime resolution with `grok inspect --json`
  - All 6 skills are registered with `userInvocable: true` (invokable as slash commands)
  - All 6 agents are registered under plugin-qualified names `oh-my-grok-build:ogb-*` — matching the names the skills reference
- The GitHub Actions `validate` workflow passed
- Ran `/ogb-doctor` in a real Grok session. Skill/agent discovery, Plan mode, subagents, worktree, `create-workflow`, `check-work` all PASS. This run uncovered 2 component naming convention defects, which were fixed (see below).

### Defects Discovered via the `/ogb-doctor` Run

Grok registers plugin agents as `oh-my-grok-build:<agent>`, but skills keep their bare name.

- `ogb-doctor` was instructing checks against bare agent names (`ogb-planner`, etc.) that don't exist.
- `ogb-start` was referencing the `ogb-verify` **skill** using agent syntax (`oh-my-grok-build:ogb-verify`).

Both were fixed, and a check was added to `scripts/validate.mjs` to reject qualified references that aren't real agents.

## Known Validation Limitations

`grok plugin validate` only checks the `plugin.json` manifest and the existence of component directories — it does not check the semantics of skill/agent frontmatter. That is, it lets invalid `permissionMode` values or unsupported fields pass through.

Frontmatter consistency is therefore handled by `npm test` (`scripts/validate.mjs`). This script checks the set of allowed `permissionMode` values and the absence of unsupported fields.

`scripts/validate.mjs` also has a limitation: the component name check is **one-way**.

- Catches: a `oh-my-grok-build:<name>` reference in SKILL.md that isn't a real agent
- Does not catch: an instruction that spawns an agent by its bare name, without the prefix

The latter is not statically detected, because a bare `ogb-executor` in prose is indistinguishable from a file mention, which would produce false positives. Instead, the spawn shape blocks in `ogb-start` and `ogb-ultrawork` pin the correct format, and it is confirmed via `/ogb-doctor` in a real session.

## Live Execution Validation of All 6 Skills

Ran all 6 skills with `grok` 0.2.112 headless (`grok -p`). The 3 write skills were run in isolation, in a temporary git repository.

| Skill | Verdict | Evidence |
|---|---|---|
| `/ogb-doctor` | PASS | Confirmed 6 skills and 6 agents registered; Plan mode, subagents, worktree, `create-workflow`, `check-work` all available |
| `/ogb-plan` | PASS | Completed the Planner → Architect(REVISE) → Critic(APPROVE) consensus loop, no source modified |
| `/ogb-ultrawork` | PASS | 2 `oh-my-grok-build:ogb-executor` instances ran in parallel with worktree isolation and then merged, only the 2 target files changed |
| `/ogb-start` | PASS | 2 worktree executors, met runtime acceptance criteria (`subtract(5,2)`→`3`, `trim`→`"x"`), no regression in existing exports, no commit/push |
| `/ogb-verify` | PASS | `ogb-verifier` and the bundled `check-work` ran independently, 0 file modifications during the verification session |
| `/ogb-workflow` | PASS | After writing a Rhai workflow, passed the metadata/compile/representative-args checks with `validate_only: true` |

This run also confirmed the following:

- Subagents are actually created under plugin-qualified names (`oh-my-grok-build:ogb-*`)
- worktree apply merges without conflict
- The bundled `create-workflow` and `check-work` are discovered and used

## Still Unverified

- The worktree merge **conflict** handling path. The runs above had no overlapping file ownership, so no conflict occurred.
- Live execution of an authored workflow. `validate_only` only proves one path — metadata/compile/representative-args — while the branches for missing arguments, budget exhaustion, or parallel slot failure remain unverified.

## Run Commands

```bash
npm test
npm run validate:grok
```

If the `grok` CLI is not present, `npm run validate:grok` passes only the static validation and marks runtime validation as `SKIP`.
