<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-28 | Updated: 2026-07-28 -->

# scripts

## Purpose
Zero-dependency validation harness for the marketplace. `validate.mjs` is the product test suite: manifests, inventories, frontmatter, agent-reference rules, content-only bans, required files, and EN/KO pairs. `validate-grok.sh` wraps static validation and optional official Grok plugin validation.

## Key Files

| File | Description |
|------|-------------|
| `validate.mjs` | Full static gate; Node stdlib only; exit 1 on failures |
| `validate-grok.sh` | Runs `validate.mjs`, then `grok plugin validate plugins/oh-my-grok-build` or SKIP |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| _(none)_ | Flat scripts directory |

## For AI Agents

### Working In This Directory
- Keep Node stdlib-only (`fs`, `path`, `process`, `url`); never add npm packages.
- Keep expected inventories in lockstep with the filesystem:
  - Skills: `ogb-interview`, `ogb-plan`, `ogb-start`, `ogb-ultrawork`, `ogb-verify`, `ogb-workflow`, `ogb-doctor`
  - Agents: `planner`, `architect`, `critic`, `explorer`, `executor`, `verifier`
- Permission modes: plan agents → `plan`; `executor` → `auto`; never `bypassPermissions` or unsupported fields.
- Agent-name rules over skill markdown (`SKILL.md` + `references/`):
  - Qualified `oh-my-grok-build:<name>` must name a real agent
  - Every `subagent_type:` fully qualified
  - No bare backtick agent names (e.g. `` `executor` ``)
- Content-only asserts: no plugin `hooks/`, `.mcp.json`, `.lsp.json`; no package deps.

### Testing Requirements
- Primary: `npm test` / `npm run validate` → `node scripts/validate.mjs`
- Optional: `npm run validate:grok`
- When adding a skill or agent, update expected inventories and permission maps in the same PR.

### Common Patterns
- Prefer extending `validate.mjs` over new tooling packages
- Print clear check counts and failure messages for CI

## Dependencies

### Internal
- `.grok-plugin/*`, `plugins/oh-my-grok-build/**`, `docs/*`, root required files, `package.json`

### External
- Node.js `>=20`
- Optional `grok` CLI for the second stage of `validate-grok.sh`

<!-- MANUAL: -->
