<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-28 | Updated: 2026-07-28 -->

# plugins

## Purpose
Container for installable Grok Build plugin packages. Today this marketplace ships a single local plugin, `oh-my-grok-build`, referenced by `.grok-plugin/marketplace.json` as a local source path.

## Key Files

| File | Description |
|------|-------------|
| _(none at this level)_ | All plugin content lives under `oh-my-grok-build/` |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `oh-my-grok-build/` | Installable plugin: agents, skills, `plugin.json` (see `oh-my-grok-build/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Do not add a second plugin package without marketplace + index + validation inventory updates.
- Install paths: marketplace install `oh-my-grok-build`, or direct `duarbdhks/oh-my-grok-build#plugins/oh-my-grok-build`.
- Treat this directory as a thin container; real contracts live under the plugin root.

### Testing Requirements
- After plugin content changes: `npm test`; with CLI: `npm run validate:grok`.

### Common Patterns
- One plugin directory per marketplace entry with local `source.path`

## Dependencies

### Internal
- `.grok-plugin/marketplace.json` — points at `./plugins/oh-my-grok-build`
- `.grok-plugin/plugin-index.json` — public skill/agent catalog

### External
- Grok Build plugin install and marketplace discovery

<!-- MANUAL: -->
