# Changelog

All notable changes to this project are documented here.

## Unreleased

### Added

- Hierarchical `AGENTS.md` maps across the repository (root, docs, scripts, plugins, skills, CI, marketplace metadata) for AI-readable directory guidance. Existing repository hard rules remain under the root `MANUAL` section.
- Brand assets under `assets/brand/`: avatar and social-preview images used by both READMEs.
- `/ogb-interview`: a questioning-only skill that turns a vague idea or an unproven design into a direction brief for `/ogb-plan`. One question per turn, weakest-dimension targeting, repository evidence gathered through `oh-my-grok-build:explorer` before the user is asked anything the code can answer, contrarian/simplifier/essence challenge passes, and coarse `CLEAR`/`PARTIAL`/`UNKNOWN` readiness ratings instead of a computed score.
- `ogb-interview/references/direction-brief-template.md` for the brief structure.

### Changed

- `/ogb-ultrawork` now scores a max-safe concurrent ceiling `C* = min(N_ready, iso_cap, remaining_child_calls, 8)`, chooses native mechanism before scoring (prefer `workflow` for >4 repeated/schema-shaped tasks even when isolation is high), injects a closed `ROLE_LENS` (`general | backend | frontend | data | sre | security | docs | test`) into every spawn-path child prompt, and requires formula fields plus ROLE_LENS in `parallel-report-template.md`. Caps stay 4 default / 8 hard max / shared-resource 2 / 16 child calls without approval / workflow `agent_budget` 8. Residual child budget is shared across direct spawns and workflow logical agents. Default path still uses only `oh-my-grok-build:executor` and `oh-my-grok-build:explorer`; third-party or `agency-*` agents are banned unless the user named them. Live installs need `grok plugin update` (or reinstall) and a new session to load the skill text.
- OGB now exposes a clearer native-first UX contract: `/ogb-workflow` delegates authoring to Grok's bundled `create-workflow`, both READMEs map all seven commands to their non-overlapping use cases and native controls, execution reports separate plan source from actual session continuity and assign residual-worktree cleanup, and validation docs distinguish historical `0.2.112` live evidence from the current `0.2.118` static and direct-plugin receipt.
- `scripts/validate.mjs` ignores hierarchical `AGENTS.md` files when building the plugin agent inventory and when enforcing docs EN/KO pair and language-switcher rules, so deepinit maps are not mistaken for agent definitions or bilingual product docs.
- Both READMEs use a centered hero with the brand avatar, disclaimer, badges, nav links, and social-preview image.


- `/ogb-interview` now leads every turn with the question in plain language instead of internal bookkeeping. A single lead line under `## Workflow` and a new `## Question format` section govern every question turn — the step 1 scope-shape confirmation, the step 3 interview loop, and the step 4 challenge passes, each now carrying only a one-clause pointer. The turn shape is question, why it matters, `Recommended:`, numbered alternatives, `Evidence:`, then a compact `Status:` last, and `CLEAR`/`PARTIAL`/`UNKNOWN`, "dimension", "bottleneck", and "component" are banned everywhere except `Status:`. `Status:` is a deliberate compression, not a lossless replay: one line per active component not yet `CLEAR` carrying its weakest dimension, rating, and gap; `CLEAR` components named only; deferred components named once in the decisions sentence with their reason; the full dimension × component matrix staying in the direction brief. Hard boundary 4 now requires the evidence citation in the same turn as the question. Questions, their rationale, and their alternatives are asked in the language the user wrote in, while `Status:`'s markers — its labels, component and dimension names, and ratings — stay in the skill's defined English terms and the prose they introduce follows the user's language; the direction brief stays in the fixed English terms throughout. Nothing changes about what is investigated, rated, or written to the brief — this is presentation only.
- That change was re-validated live rather than assumed: four headless `grok` 0.2.112 runs against a throwaway two-route Express repository, covering the step 1 confirmation, a resumed step 3 interview loop, a Korean prompt, and a control run with the machine's ambient Korean instruction removed. The banned-vocabulary rule was measured mechanically (byte offset of `Status:` versus the first occurrence of any banned token) rather than eyeballed. The step 4 challenge passes and the step 5 round-10 checkpoint are not reachable in four runs, so their conformance rests on static audit only — recorded as such in `docs/validation.md` instead of being claimed.
- **Breaking:** the six agents dropped their `ogb-` prefix. Spawn `oh-my-grok-build:planner` instead of `oh-my-grok-build:ogb-planner`, and likewise for `architect`, `critic`, `explorer`, `executor`, and `verifier`. Grok registers plugin agents plugin-qualified, so the prefix repeated a namespace the qualified name already carried. The seven skills are unchanged and keep the prefix, because they register bare — `/ogb-plan` has nothing else to distinguish it.
- The rename removes a loud failure. A prefix-less `ogb-planner` used to resolve to nothing; a prefix-less `planner` can resolve to a same-named agent in the user's `~/.grok/agents/` or `~/.claude/agents/` and run with the wrong prompt. `scripts/validate.mjs` gained two rules to compensate: every `subagent_type:` value must be qualified and name a real agent, and a backtick-delimited bare agent name fails. Both rules cover every markdown file a skill ships, `references/` included. Each was confirmed to fail on an introduced defect before being reverted. `ogb-doctor` now reports same-named agents in the environment as warnings rather than treating their absence as expected.
- That the qualified name is the registry key was checked against a live `grok inspect --json`, not assumed: a foreign plugin's `planner` and a user-level `planner` coexist there without displacement. Confirmed again for this plugin after the rename — following `grok plugin update`, all six register as `oh-my-grok-build:<agent>` alongside five same-named agents in `~/.claude/agents/`, neither set displacing the other.
- `/ogb-ultrawork` now schedules for elapsed time while keeping its ownership, isolation, budget, and verification invariants. Independent read-only investigation is batched into one round of tool calls; waves are ordered critical-path-first; concurrency is decided by ownership and resource isolation (default four, at most eight when isolation is proven, lowered under shared-resource contention, never by task count alone); long commands overlap with independent work only when they share no build output, cache, container, port, database schema, migration target, generated artifact, or external test environment; a wave's independent tasks launch as one batch; freed slots are backfilled without waiting for the whole wave; and each child's diff is reviewed as it finishes while workspace integration stays one-at-a-time with narrow checks rerun after each apply. One sequencing guarantee is deliberately traded: integration no longer waits for a wave-wide comparison of every result, which narrows the window where duplicate or conflicting edits are caught — the file-disjointness precondition, one-at-a-time application, and the merge-conflict stop condition are the mitigations. A new `Hard boundary` section forbids calling an external orchestrator, child-agent fan-out, nested workflows, duplicate-assignment voting, and fan-out without a finite work list. The output contract moved to `ogb-ultrawork/references/parallel-report-template.md` and now reports concurrency rationale, overlap-or-serialize decisions, and per-agent ownership — overlap is reported as fact, with no invented time-savings figures.
- User-facing docs and runtime skill text no longer repeat the upstream project name; legal attribution stays in `NOTICE.md`, and design rationale stays in `docs/upstream-evaluation.md`.
- The executor agent gained an invariant: it must not spawn subagents, invoke an orchestration skill, or launch a workflow — the parent that delegated the task owns all fan-out.
- The explorer agent gained the same no-fan-out invariant (parent owns all fan-out), so both leaf agents used by `/ogb-ultrawork` refuse nested orchestration.
- `docs/architecture.md` and its Korean pair now describe dynamic concurrency (4 default, at most 8 with proven isolation, lowered on shared resources) instead of a flat default of 4, and distinguish baseline/`/ogb-start` between-wave review from `/ogb-ultrawork` progressive mid-wave review, slot backfill, and one-at-a-time integration.
- `docs/validation.md` and its pair gained a scheduling-scenario mapping for `/ogb-ultrawork` (including B same-file ban vs B2 shared-resource lowered concurrency). Scenarios A, C, D, E, and F were live-smoked with headless `grok` 0.2.112; B/B2 and the shell-command background primitive remain unverified.
- `ogb-ultrawork/references/parallel-report-template.md` now records each agent's qualified `subagent_type`, isolation mode, worktree path, whether `ogb-verify` ran, and the integrated check command.
- `.gitignore` now excludes `.omx/` so local Ralph state and throwaway validation fixtures do not enter release diffs.

### Notes

- The skill adds no state file, settings key, or agent. Readiness is judged and reported in the response, matching the v0.1 state strategy in `docs/architecture.md`.
- `/ogb-plan` now recommends `/ogb-interview` when a request is too vague to produce even one viable option.
- Verified with static validation, `grok plugin validate`, and two headless `grok` 0.2.112 runs in a throwaway Express repository. The skill explored before asking, kept one question per turn with a recommended answer, reported the readiness table with a named bottleneck, and left the working tree untouched. Evidence is in `docs/validation.md`.
- The chain from `/ogb-interview` through `/ogb-verify` has since been run continuously inside one interactive session, with every skill behaving as documented. That covers the handoffs between skills, which the earlier per-skill runs did not.
- A plan does not survive into a fresh session — Grok stores it in the session directory. `grok -c` or `grok -r <session-id>` restores it. Both directions were confirmed. The skills do not yet say this, so it is recorded under Still Unverified in `docs/validation.md` rather than treated as covered.
- Scheduling smokes: Scenario C used three concurrent `oh-my-grok-build:explorer` agents on this repo (read-only, tree stayed clean). Scenario A used three concurrent worktree `oh-my-grok-build:executor` agents on a throwaway three-package fixture and integrated full-name fixes without commit or push.
- Remaining scheduling smokes: Scenario D serialized two passing integration tests that shared file-backed database state and TCP port `43127`, with timestamp evidence proving no overlap. Scenario E launched six isolated qualified worktree executors in one wave and integrated six disjoint subsystem files; its unattended headless `auto` attempts were cancelled at child permission prompts, while an explicitly approved bounded `bypassPermissions` retry passed. Scenario F selected an inline native workflow instead of direct eight-agent fan-out, passed `validate_only`, and completed eight read-only logical agents with explicit `agent_budget=8`. All temporary files and run-owned worktrees were removed.
- Live workflow smoke: the exact `inspect-fixture` script body passed `validate_only` on `grok` 0.2.112, then completed a live run with `{"content":"OGB_LIVE_OK","target":"fixture.txt"}` using one logical agent. A second run without args stopped as `blocked` with `Pass args.target with the project-relative file to inspect.` and used zero agents. The throwaway repository's saved `script_path` was rejected by folder trust, so the same file contents were launched through inline `script`; no dependency or runtime component was added.

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
