# Validation Status

[한국어](validation.ko.md)

> The counts in the `0.1.0` sections below describe that release's live run, when the plugin shipped six skills. `/ogb-interview` was added afterwards and is validated separately in [its own section](#live-execution-validation-of-ogb-interview).
>
> The agents were renamed after these runs — `ogb-planner` became `planner`, and so on for the other five, since the `oh-my-grok-build:` qualifier already namespaces them. The `ogb-*` agent names recorded below are left as they were, because they describe what actually ran at the time. Registration under the new names was re-confirmed separately; see the CLI section below.

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
- Confirmed live registration after the agent rename. Following `grok plugin update oh-my-grok-build`, `grok inspect --json` lists all six as `oh-my-grok-build:planner`, `:architect`, `:critic`, `:explorer`, `:executor`, and `:verifier`. The same run shows five same-named user agents — `planner`, `architect`, `critic`, `executor`, `verifier` from `~/.claude/agents/` — registered alongside them, neither set displacing the other. The qualified name is the registry key, so the short agent names are safe; an unqualified reference reaches the user's agent instead, which is what the validator rules and `/ogb-doctor` warnings exist to catch.
- Re-ran `/ogb-doctor` headless against that install: PASS overall, zero FAIL. It resolved the seven skills and the six qualified agents, and the new shadowing check fired as designed — it reported the five same-named `~/.claude/agents/` definitions as a `WARN`, naming each file, rather than treating a bare agent name as expected-absent. One unrelated observation from the same run: `inspect` reports `provides.agents: 1` where six are actually registered, because that field counts agent directories rather than agents. It predates the rename and matches the `1 agent dir(s)` line from `grok plugin validate`.
- Ran `/ogb-doctor` in a real Grok session. Skill/agent discovery, Plan mode, subagents, worktree, `create-workflow`, `check-work` all PASS. This run uncovered 2 component naming convention defects, which were fixed (see below).

### Defects Discovered via the `/ogb-doctor` Run

Grok registers plugin agents as `oh-my-grok-build:<agent>`, but skills keep their bare name.

- `ogb-doctor` was instructing checks against bare agent names (`ogb-planner`, etc.) that don't exist.
- `ogb-start` was referencing the `ogb-verify` **skill** using agent syntax (`oh-my-grok-build:ogb-verify`).

Both were fixed, and a check was added to `scripts/validate.mjs` to reject qualified references that aren't real agents.

## Known Validation Limitations

`grok plugin validate` only checks the `plugin.json` manifest and the existence of component directories — it does not check the semantics of skill/agent frontmatter. That is, it lets invalid `permissionMode` values or unsupported fields pass through.

Frontmatter consistency is therefore handled by `npm test` (`scripts/validate.mjs`). This script checks the set of allowed `permissionMode` values and the absence of unsupported fields.

`scripts/validate.mjs` checks component naming in both directions, with three rules over every markdown file a skill ships — its `SKILL.md` and everything under `references/`, since a reference file becomes instructions the moment the skill loads it:

- **Rule 0** — a `oh-my-grok-build:<name>` reference must name a real agent. Catches a skill referenced with agent syntax.
- **Rule A** — every `subagent_type:` value must be qualified and name a real agent. This is the one that matters most: the spawn shapes in `ogb-start` and `ogb-ultrawork` sit in fenced text blocks, so nothing else sees them.
- **Rule B** — an agent name written backtick-delimited and bare, like `` `executor` ``, fails. Backticks are the boundary: a backticked bare name is always an identifier and always the wrong one.

Both new rules were confirmed to actually fail, one at a time, by introducing the defect and observing a non-zero exit before reverting.

What is still not statically detected: a bare agent name in ordinary prose, with no backticks and no `subagent_type:` key, that the model then acts on. Matching that produces false positives on ordinary English — "the executor reports its evidence" is a legitimate sentence. That gap matters more than it used to, because a bare `executor` now resolves to a same-named agent in the user's environment instead of failing. `/ogb-doctor` reports those same-named agents as warnings, and a live session run remains the backstop.

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

## Live Execution Validation of `/ogb-interview`

`/ogb-interview` shipped after the `0.1.0` run above, so it was validated on its own. Ran with `grok` 0.2.112 headless (`grok -p`) in a throwaway git repository holding a two-route Express app (`src/server.js`, `package.json`, no auth and no existing rate limiting).

| Check | Verdict | Evidence |
|---|---|---|
| Registration | PASS | `grok inspect --json` lists `ogb-interview` with `userInvocable: true` under the plugin source |
| Manifest | PASS | `grok plugin validate plugins/oh-my-grok-build` reports a valid manifest with the added skill directory |
| Scope-shape gate | PASS | Round 0 read the repository first, cited `src/server.js` and `package.json`, proposed four top-level components, and asked exactly one confirmation question |
| Evidence before questions | PASS | Stated that no middleware, auth, or rate limiting exists before asking anything, rather than asking the user what the code answers |
| Interview loop | PASS | Reported the `CLEAR`/`PARTIAL`/`UNKNOWN` readiness table per component, named the bottleneck pair (`rate limit policy` × `Goal`) with a one-sentence rationale, and asked one question |
| Recommended answer | PASS | Every question carried a recommended answer with reasoning, numbered alternatives, and a free-text option |
| Read-only boundary | PASS | `git status --short --branch` clean after both runs; no plan created, no commit, no dependency installed |

Two runs were used: one from a cold start, and one that pasted the confirmed components and the Round 0 answer back in as the argument, which is the documented way to resume without a state file.

## End-to-End Chain in One Session

Every validation above exercised a single skill in isolation, each in its own headless run. This one ran the chain continuously — `/ogb-interview` through `/ogb-verify` — inside one interactive Grok Build session, and every skill behaved as documented.

What this adds over the per-skill runs is the handoffs: the interview's brief feeding `/ogb-plan`, the approved plan reaching `/ogb-start` without being restated, and `/ogb-verify` closing on the same acceptance criteria. Those seams are not covered by running each skill alone.

It also stays inside one session, which is the supported path. A plan does not survive into a fresh session; see the note in Still Unverified below.

## Still Unverified

- The worktree merge **conflict** handling path. The runs above had no overlapping file ownership, so no conflict occurred.
- The chain across a **session boundary**. Grok writes the plan to `plan.md` inside the session directory, so a new session cannot see it — confirmed by running `/view-plan` in a fresh session in a directory that already held two plans, which reported no saved plan. Returning with `grok -c` or `grok -r <session-id>` restores it, also confirmed. The skills do not yet tell the user this.
- Live execution of an authored workflow. `validate_only` only proves one path — metadata/compile/representative-args — while the branches for missing arguments, budget exhaustion, or parallel slot failure remain unverified.

## Run Commands

```bash
npm test
npm run validate:grok
```

If the `grok` CLI is not present, `npm run validate:grok` passes only the static validation and marks runtime validation as `SKIP`.
