<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-28 | Updated: 2026-07-28 -->

# oh-my-grok-build

## Purpose
Installable Grok Build plugin package. Provides seven user-invocable heavy skills and six specialized agents for interview → plan → execute → verify workflows. Content-only: no hooks, MCP servers, LSP, or binaries.

## Key Files

| File | Description |
|------|-------------|
| `plugin.json` | Plugin manifest: name, version, author, `skills` and `agents` directory pointers |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `agents/` | Six agent definitions registered as `oh-my-grok-build:<name>` (see `agents/AGENTS.md`) |
| `skills/` | Seven `ogb-*` skill packages (see `skills/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Keep `plugin.json` `skills`/`agents` fields pointing at `skills` and `agents`.
- Version bumps must align with `.grok-plugin/plugin-index.json` and marketplace entry when public.
- Skills keep `ogb-` prefix and `disable-model-invocation: true`.
- Agents use short names only; skills always spawn `oh-my-grok-build:<agent>`.
- Do not add hooks, `.mcp.json`, `.lsp.json`, or executables without an accepted architecture decision.

### Testing Requirements
- `npm test` from repository root after any skill/agent/manifest change.
- `npm run validate:grok` when CLI is available (`grok plugin validate plugins/oh-my-grok-build`).
- `/ogb-doctor` for live install and discovery checks.

### Common Patterns
- Lifecycle: `ogb-interview` → `ogb-plan` → `ogb-start` or `ogb-ultrawork` → `ogb-verify`
- Side tools: `ogb-doctor` (install), `ogb-workflow` (Rhai authoring)

## Dependencies

### Internal
- Root validation and marketplace manifests
- `docs/architecture.md` for operating discipline

### External
- Grok Build native subagents, worktrees, Plan mode, workflows

<!-- MANUAL: -->
