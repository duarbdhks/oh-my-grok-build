# Compatibility

[한국어](compatibility.ko.md)

## Product surface

| Item | Value |
|---|---|
| Plugin name | `oh-my-grok-build` |
| Plugin version (manifest) | `0.1.0` |
| Skills | 7 (`ogb-interview`, `ogb-plan`, `ogb-start`, `ogb-ultrawork`, `ogb-verify`, `ogb-workflow`, `ogb-doctor`) |
| Agents | 6 (`planner`, `architect`, `critic`, `explorer`, `executor`, `verifier`) registered as `oh-my-grok-build:<name>` |
| Runtime dependencies | None (content-only) |
| Repository validation Node | `>=20` |

## Grok Build versions with evidence

| Grok Build | What was validated | Where |
|---|---|---|
| `0.2.112` (stable) | Live install, six original skills, later interview, scheduling smokes, authored workflow body | [Validation](validation.md) historical sections |
| `0.2.118` (stable) | Static `npm test` (215 checks), `grok plugin validate`, source UX contract review | Validation “Current Compatibility Receipt — 2026-08-02” |
| Newer local CLIs | Not automatically covered | Treat command UX as unproven until restamped |

Claims about “works on every Grok Build version” are out of scope. Prefer the receipts above.

## Native capabilities used

- Plugins / marketplace install
- Skills and agents
- Plan mode and saved plans (`/view-plan`)
- Subagents (`spawn_subagent`)
- Git worktree isolation
- Workflows and bundled `create-workflow`
- Bundled `check-work` for final verification assistance
- Session continue/resume (`grok -c`, `grok -r`)
- Goal mode (`/goal`) as a native long-runner, not reimplemented

## Known limitations (summary)

Full detail: [Validation](validation.md) “Still Unverified” and current-candidate `NOT RUN` rows.

- Current working-candidate command live UX on post-`0.2.112` releases may be `NOT RUN` even when static validation passes.
- Saved project workflow loading via `script_path` can require folder trust.
- Worktree **conflict** handling path not live-proven (no overlapping ownership in successful runs).
- Plan state does not survive a brand-new session without native continue/resume.
- Live scheduling scenarios for same-file ban / shared-resource lowered concurrency are partly static design evidence.

## Platform

Live validation described in this repository was performed on a developer macOS environment with the `grok` CLI. Linux installability is a roadmap criterion for broader claims, not a restamped receipt here.
