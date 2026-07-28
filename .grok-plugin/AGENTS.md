<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-28 | Updated: 2026-07-28 -->

# .grok-plugin

## Purpose
Grok marketplace metadata and public component index for this repository. Defines how clients discover and install the local plugin, and lists every public skill and agent for validation and publishing.

## Key Files

| File | Description |
|------|-------------|
| `marketplace.json` | Marketplace name, owner, and local plugin source path |
| `plugin-index.json` | Versioned catalog of 7 skills and 6 agents |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| _(none)_ | Flat metadata directory |

## For AI Agents

### Working In This Directory
- Keep `marketplace.json` `source.path` aligned with `./plugins/oh-my-grok-build`.
- Keep `plugin-index.json` in lockstep with filesystem inventories and `plugin.json` version.
- Any new public skill or agent requires an index update in the same change as files, CHANGELOG, and both READMEs.
- Do not invent extra marketplace plugins without updating validation expectations.

### Testing Requirements
- `scripts/validate.mjs` checks marketplace ↔ plugin path, index inventories, and version consistency.
- Run `npm test` after any edit here.

### Common Patterns
- Local source marketplace entry for monorepo-style plugin packaging
- Index is the public surface contract, not optional docs

## Dependencies

### Internal
- `plugins/oh-my-grok-build/plugin.json`
- `plugins/oh-my-grok-build/skills/**`
- `plugins/oh-my-grok-build/agents/**`

### External
- Grok Build marketplace install (`grok plugin marketplace add …`)

<!-- MANUAL: -->
