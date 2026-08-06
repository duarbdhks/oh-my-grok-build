# Validation Status

[한국어](validation.ko.md)

> The counts in the `0.1.0` sections below describe that release's live run, when the plugin shipped six skills. `/ogb-interview` was added afterwards and is validated separately in [its own section](#live-execution-validation-of-ogb-interview).
>
> The agents were renamed after these runs — `ogb-planner` became `planner`, and so on for the other five, since the `oh-my-grok-build:` qualifier already namespaces them. The `ogb-*` agent names recorded below are left as they were, because they describe what actually ran at the time. Registration under the new names was re-confirmed separately; see the CLI section below.

## Current Compatibility Receipt — 2026-08-02

This receipt applies to the uncommitted P0 candidate under `plugins/oh-my-grok-build`, based on repository commit `a8c07bd460c95e3a779767f1dc3d1b7291c4a702`. It does not restamp the historical live runs below.

| Check | Status | Current evidence |
|---|---|---|
| Source identity | PASS | Plugin version `0.1.0`; source path `plugins/oh-my-grok-build`; uncommitted candidate based on the commit above |
| Repository static gate | PASS | `npm test` completed `215` checks |
| Current CLI identity | PASS | `grok 0.2.118 (1e1687c1cf6a) [stable]` |
| Direct plugin validation | PASS | `grok plugin validate plugins/oh-my-grok-build` reported a valid `0.1.0` manifest with `1` skill directory and `1` agent directory |
| Current source UX contract | PASS | Source review confirms the `7`-command selection matrix, native `create-workflow` authoring path, separate plan/session/workflow lifecycles, and residual-worktree ownership fields |
| Current command live UX | NOT RUN | The edited skills were not invoked in a new `0.2.118` Grok session |
| Current saved workflow loading via `script_path` | NOT RUN | This candidate did not change global folder trust or rerun the path; the historical `0.2.112` attempt remains a `LIMITATION` below |
| Current authored-workflow live run | NOT RUN | Historical `0.2.112` inline-body evidence remains below and is not promoted to current-candidate evidence |

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

## Historical Validation with the Real Grok CLI

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

`/ogb-interview` shipped after the `0.1.0` run above, so it was validated on its own. Ran with `grok` 0.2.112 headless (`grok -p`) in a throwaway git repository holding a two-route Express app (`src/server.js` defining `GET /status` and `POST /messages`, `package.json` depending only on `express`, no auth and no existing rate limiting).

The table below was re-observed after the `## Question format` change, which moved the question to the top of every turn and the readiness bookkeeping into a trailing `Status:` block. `Registration` and `Manifest` are carried forward from the original run: this was a prose-only change, and the current procedure never re-ran `grok inspect --json`, so their evidence is not restamped.

The `Interview loop` row is not a routine refresh like the other four. Its previous text recorded the now-banned behavior — the bottleneck pair stated ahead of the question — as PASS. Its verdict criterion is inverted, not merely re-confirmed.

| Check | Verdict | Evidence |
|---|---|---|
| Registration | PASS | `grok inspect --json` lists `ogb-interview` with `userInvocable: true` under the plugin source |
| Manifest | PASS | `grok plugin validate plugins/oh-my-grok-build` reports a valid manifest with the added skill directory |
| Scope-shape gate | PASS | Round 0 read the repository first, cited `src/server.js` and `package.json` on the `Evidence:` line, proposed the same four components it then labelled in `Status:`, and asked exactly one confirmation question |
| Evidence before questions | PASS | Stated that no middleware, auth, or rate-limit dependency exists before asking anything, rather than asking the user what the code answers |
| Interview loop | PASS (inverted criterion) | The resumed turn opened with the question ("Should the limit count requests per client IP, or is there some other key you want to count against?") and deferred all bookkeeping to a trailing `Status:` block. Measured mechanically: byte offset of `Status:` = 999, and none of `CLEAR`/`PARTIAL`/`UNKNOWN`/`dimension`/`bottleneck`/`component`/`readiness` occurs before it. The `Status:` block was component-aware as specified — deferred components named once with their reason, the settled component as `Cleared: Routes covered.` with no rating repeated, and the open one as `Limit policy: Goal — PARTIAL, counting key (per-IP vs other) not chosen.` |
| Recommended answer | PASS | Every question carried a recommended answer with reasoning, numbered alternatives whose text stated a consequence rather than a label, and a free-text option |
| Language | PASS | A Korean prompt produced the question, why-it-matters line, `Recommended:` reasoning and alternatives in Korean while `Recommended:`/`Evidence:`/`Status:`, the component labels (`Routes covered`, `Limit policy`, …) and the ratings stayed English. A control run with an English prompt and the ambient Korean instruction removed produced an English turn, which separates the rule's effect from the environment — see the note below |
| Read-only boundary | PASS | `git status --short --branch` clean in the fixture after all four runs, with no untracked files; no plan created, no commit, no dependency installed |

Four runs were used: a cold start (English prompt), a resume that pasted the confirmed components and the Round 0 answer back in as the argument — the documented way to resume without a state file, and the only run that reaches the step 3 interview loop — a Korean cold start, and a control cold start. The control was needed because this machine's `~/.claude/CLAUDE.md` instructs Korean output and Grok reads it through its Claude compatibility layer, so the first English-prompt run also answered in Korean. Re-running it with `HOME` pointed at a directory without that file produced an English turn, which is what distinguishes the skill's language rule from the ambient instruction.

Two limits of this evidence are worth stating. The step 4 challenge passes (rounds 4, 6, 8) and the step 5 round-10 checkpoint are never reached by a four-run design, so their conformance to `## Question format` rests on static text audit only, with no live evidence. And in each run a short preamble sentence precedes the governed turn; `## Question format` governs the turn, not that preamble, so it was not treated as a violation.

## End-to-End Chain in One Session

Every validation above exercised a single skill in isolation, each in its own headless run. This one ran the chain continuously — `/ogb-interview` through `/ogb-verify` — inside one interactive Grok Build session, and every skill behaved as documented.

What this adds over the per-skill runs is the handoffs: the interview's brief feeding `/ogb-plan`, the approved plan reaching `/ogb-start` without being restated, and `/ogb-verify` closing on the same acceptance criteria. Those seams are not covered by running each skill alone.

It also stays inside one session, which is the supported path. A plan does not survive into a fresh session; see the note in Still Unverified below.

## Scheduling Scenario Mapping for `/ogb-ultrawork`

Each row is checked against the rule that governs it in the `ogb-ultrawork` `SKILL.md`, the same way the naming rules above cite their exact mechanism. Scenarios A, C, D, E, and F also have historical live headless evidence in the next section. B and B2 remain design mapping only. Expected `C*` / mechanism annotations below are static design targets for the max-safe formula and ROLE_LENS protocol; they do not invent new live PASS claims.

| Scenario | Expected behavior | Governing rule | Live |
|---|---|---|---|
| A — fixes in 3 independent packages | Same wave; score `C*=3` (iso_cap 4 default or 8 if proven); batch spawn of 3 | Protocol steps 2, 4, 6 | PASS (below; historical) |
| B — tasks that both write the same schema/config file | Not in the same wave (same-file ownership ban) | Protocol step 5 (never same file) | static only |
| B2 — tasks that share a schema/resource but write disjoint files | Same wave only with `iso_cap=2`, `C*≤2` | Protocol steps 4–5 | static only |
| C — independent file searches and configuration reads | One parallel read-only batch; explorers with ROLE_LENS | Protocol step 1 | PASS (below; historical) |
| D — integration tests sharing one database and port | Never unconditionally parallel; serialize contended commands (independent of agent `C*`) | Protocol step 5 (overlap ban list) | PASS (below; historical) |
| E — 6 subsystem tasks with proven independence | `iso_cap=8`, `C*=6`, spawn 6 concurrent implementers | Protocol steps 2, 4, 6 | PASS (below; historical) |
| F — 8+ repetitive, same-shaped tasks | Prefer native `workflow` first; do not launch 8 direct executors even if isolation would allow high `C*` (step 2 HARD RULE) | Protocol step 2 (mechanism non-inversion) | PASS (below; historical) |

### Max-safe formula worked examples (static)

| Scenario | N_ready | iso_cap | remaining | C* | chosen C | mechanism |
|---|---:|---:|---:|---:|---:|---|
| A | 3 | 4 (or 8 if proven) | 16 | 3 | 3 | spawn_subagent |
| B2 | 2+ | 2 | 16 | 2 | ≤2 | spawn_subagent |
| D | n/a (command serialize) | n/a | — | no parallel wave for contended commands | serialize | spawn/serial |
| E | 6 | 8 | 16 | 6 | 6 | spawn_subagent |
| F | — | — | — | n/a for 8 direct spawns | workflow | workflow `agent_budget=8` |

## Live Scheduling Smokes

Ran with `grok` 0.2.112 headless (`grok -p` / `--single`) after the scheduling follow-ups landed on `main` (`abed75c`). The plugin under test was the local install at `oh-my-grok-build-5cffb366` sourced from `plugins/oh-my-grok-build` in this repository.

### Scenario C — parallel read-only investigation

- Cwd: this repository (read-only).
- Prompt: three independent lookups (spawn shape, no-fan-out invariants, `package.json` test scripts), no file edits.
- Verdict: PASS.

| Check | Evidence |
|---|---|
| One wave, batch launch | Parent report: three `oh-my-grok-build:explorer` agents in one wave; investigation described as one parallel batch, not sequential |
| Qualified spawn + isolation | All three: `subagent_type: oh-my-grok-build:explorer`, isolation `none`, no worktree |
| Findings correct | Spawn shapes in `ogb-ultrawork/SKILL.md`; no-fan-out on `executor.md` L13 and `explorer.md` L14; `npm test` → `node scripts/validate.mjs` |
| Read-only boundary | `git status` clean after the run (`main...origin/main`, HEAD `abed75c`) |
| Report contract | Parallel-report structure filled (concurrency, agents table, verification, remaining risks) |

### Scenario A — three independent package fixes

- Cwd: throwaway git repo with `packages/{alpha,beta,gamma}/index.js`, each returning a truncated name (`alph` / `bet` / `gamm`).
- Prompt: one wave of three independent worktree executors; fix returns to `'alpha'` / `'beta'` / `'gamma'`; no commit or push.
- Verdict: PASS.

| Check | Evidence |
|---|---|
| One wave, batch launch | Parent report: concurrency 3; three `oh-my-grok-build:executor` agents launched together with `background: true` |
| Worktree isolation | Each child used `isolation: worktree` with a distinct worktree path under `~/.grok/worktrees/...` |
| Ownership disjoint | alpha / beta / gamma each owned a single package file; no conflicts |
| Integration | All three files integrated into the main workspace; returns verified as full names |
| No commit/push | Working tree dirty only for the three package files; no commit created |

The following D, E, and F runs used the same CLI version against the current local install `oh-my-grok-build-ec452e1b`. The repository was clean before the runs. All fixtures, smoke files, and worktrees created by these runs were removed afterwards; no commit, push, PR, dependency, saved workflow, or tracked runtime component was created.

### Scenario D — integration tests sharing one database and port

- Cwd: this repository, using an ignored throwaway fixture.
- Prompt: run test A and then test B. Both bound TCP port `43127` and acquired the same file-backed test-database lock before updating `shared-database.json`.
- Verdict: PASS.

| Check | Evidence |
|---|---|
| Explicit serialization | Parent report selected no parallel wave and concurrency 1 for the commands: wave 1 was A, wave 2 was B, dependent on A completion |
| Real shared resources | Both commands used port `43127`, the same exclusive database lock, and the same database file |
| Both tests passed | A and B exited 0: `A: PASS 1785078374289-1785078375091`; `B: PASS 1785078387494-1785078388296` |
| No overlap | `B.start >= A.end` was `1785078387494 >= 1785078375091`; the gap was `12403 ms` |
| Cleanup | The fixture, database, lock, and evidence log were removed; no listener remained on port `43127` |

This proves the scheduling decision with actual contended resources. The test database was a local file-backed fixture, not an external database service.

### Scenario E — six isolated subsystem tasks

- Cwd: this repository, with six temporary paths under `.ogb-smoke/subsystems/`.
- Prompt: launch one wave of six qualified `oh-my-grok-build:executor` agents at concurrency 6. Each child owned one of `alpha`, `beta`, `gamma`, `delta`, `epsilon`, or `zeta`, used a worktree, wrote only its own file, and verified its content.
- Verdict: PASS with a headless permission-mode caveat.

| Check | Evidence |
|---|---|
| One wave, batch launch | Parent report selected concurrency 6 and launched all six with `background: true` |
| Qualified spawn + isolation | Six `oh-my-grok-build:executor` agents used `capability_mode: all`, `isolation: worktree`, and six unique `~/.grok/worktrees/develop-oh-my-grok-build/...` paths |
| Ownership and resources disjoint | One file per named subsystem; no shared file, database, port, cache, configuration, build output, generated artifact, or external environment |
| Integration | Six successful diffs were inspected and applied one at a time; no result was rejected |
| Integrated verification | Per-file checks, six post-apply checks, `ALL_SIX_PASS`, and `FILE_COUNT_OK=6` all exited 0 |
| Cleanup | The six smoke files and all 18 worktrees created by the two blocked attempts plus the successful run were removed |

With headless `--permission-mode auto`, two bounded attempts launched the six children but every child was cancelled before its first write with `Subagent turn was cancelled: user cancelled a permission prompt`. The final explicitly approved local-fixture retry used `--permission-mode bypassPermissions`; it completed without a prompt or cancellation. Scenario E is therefore live-proven in this environment, but unattended write-capable headless execution was not executable under `auto`.

### Scenario F — workflow threshold for eight repetitive tasks

- Cwd: this repository (read-only).
- Prompt: eight same-shaped tasks, one per selected repository file, each returning the project-relative path and first non-empty line. The parent had to review the mechanism first, prefer a native workflow, and refuse direct eight-subagent fallback.
- Verdict: PASS.

| Check | Evidence |
|---|---|
| Threshold decision | The parent classified the finite list as eight repeated schema-shaped tasks and selected native `workflow` plus one `parallel()` panel, not eight direct `spawn_subagent` calls |
| Required authoring gate | The bundled `create-workflow` skill was loaded before the inline Rhai workflow was validated |
| Validation | `validate_only` passed before the live launch |
| Budget and terminal state | Explicit `agent_budget=8`; terminal status `complete`; logical agents `8 / 8`; spent 8, remaining 0; `agent_usage_incomplete=false` |
| Result verification | All eight path/first-line results matched local `awk 'NF{print; exit}'` checks; the workflow elapsed-time floor was about `10497 ms` |
| Content-only boundary | Inline script only; no workflow file, tracked edit, dependency, nested workflow, commit, push, PR, network, or external system |

All three requested remaining scheduling scenarios were executable and live-proven locally. The only local execution limitation found inside this set was scenario E's write-capable headless `auto` permission path; the explicitly authorized bounded retry succeeded. No D, E, or F behavior remains inferred from static text alone.

## Live Execution Validation of an Authored Workflow

Ran with `grok` 0.2.112 in the throwaway nested git repository `/Users/yeumgw/develop/oh-my-grok-build/.omx/throwaway/inspect-fixture-live`. The project definition was `.grok/workflows/inspect-fixture.rhai`: metadata name `inspect-fixture`, one `Inspect` phase, one schema-constrained read-only agent, required `args.target`, and an explicit `agent_budget` of 1. The only fixture was `fixture.txt`, containing `OGB_LIVE_OK`; the repository had no dependency manifest, commit, push, or external side effect.

The saved project path exposed a separate trust boundary. Calling the workflow tool with `script_path` returned:

```text
Tool `workflow` failed: workflow path is not trusted: /Users/yeumgw/develop/oh-my-grok-build/.omx/throwaway/inspect-fixture-live/.grok/workflows/inspect-fixture.rhai (project workflows require folder trust)
```

To avoid changing user-global folder trust for a throwaway repository, the exact saved file contents were then passed through the tool's inline `script` field. This validates the authored workflow body and its live runtime branches, but not saved-definition discovery or `script_path` loading.

The representative `validate_only: true` call used `args.target = "fixture.txt"` and `agent_budget = 1`. Its exact result was:

```text
Smoke check passed for workflow 'inspect-fixture' (1 declared phases; canned-host path paused (Infra): The inspector failed. Check the run details, then start a new run.). This did not launch the workflow and did not exercise every branch or live dependency. Offer a real run next.
```

The smoke passed metadata and compilation. Its canned agent output did not satisfy the required `content` field, so that synthetic path reached the workflow's fail-closed `infra` pause. Two explicitly authorized live launches then produced terminal state:

| Path | Display name | Terminal status | Logical agents | Exact evidence |
|---|---|---|---|---|
| Representative success | `inspect-fixture` | `complete` | `1 / 1` | `result_summary = {"content":"OGB_LIVE_OK","target":"fixture.txt"}` |
| Missing `args` | `inspect-fixture-2` | `blocked` (`verification`) | `0 / 1` | `pause_message = "Pass args.target with the project-relative file to inspect."` |

The success journal recorded one `spawn_agent` result with `success: true`, `content: "OGB_LIVE_OK"`, `tokens_used: 41344`, and `duration_ms: 4419`; the run's `elapsed_ms_floor` was 4446. The missing-argument run went directly from `workflow_started` to `workflow_paused`, had no journal file because it launched no agent, and recorded `elapsed_ms_floor: 4`. This confirms that the failure message is actionable and the guard consumes no child-agent budget.

## Still Unverified

- The worktree merge **conflict** handling path. The runs above had no overlapping file ownership, so no conflict occurred.
- A fresh live run of the chain across a **session boundary**. The historical check confirmed that a new session cannot see the prior session's `plan.md`, while `grok -c` or `grok -r <session-id>` restores it. The current source now documents that boundary and reports continuity separately, but the edited path has not been rerun on `0.2.118`.
- Loading a saved project workflow through `script_path` in the throwaway repository. The tool required explicit folder trust even though the same authored body validated and ran through `script`; the run deliberately did not mutate user-global trust state.
- Workflow budget exhaustion and parallel-slot failure. Live success and missing-argument handling are now exercised, but those two failure branches remain unverified.
- Live scheduling scenarios B and B2. A, C, D, E, and F are exercised above; only the same-file ban and shared-resource lowered-concurrency mappings remain static design evidence.
- A non-blocking shell-command primitive in Grok Build. The long-command overlap guidance in `ogb-ultrawork` step 5 is written capability-neutral — a backgrounded child can own the command — because this repository has only confirmed `background: true` as a subagent spawn field, not a command-level background mechanism.

## Run Commands

```bash
npm test
npm run validate:grok
```

If the `grok` CLI is not present, `npm run validate:grok` passes only the static validation and marks runtime validation as `SKIP`.
