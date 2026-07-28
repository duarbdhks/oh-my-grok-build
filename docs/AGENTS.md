<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-28 | Updated: 2026-07-28 -->

# docs

## Purpose
Authoritative design and evidence documentation for the plugin marketplace. Covers architecture boundaries, validation status, roadmap gates, publishing steps, and upstream-inspiration redesign rationale. Every English page has a required Korean pair.

## Key Files

| File | Description |
|------|-------------|
| `architecture.md` / `architecture.ko.md` | Operating discipline, concurrency rules, verify order, security boundary |
| `validation.md` / `validation.ko.md` | Static and live validation evidence; scenario map; known gaps |
| `roadmap.md` / `roadmap.ko.md` | Version plan and validation gate checklist |
| `publishing.md` / `publishing.ko.md` | Marketplace install, tags, and official listing notes |
| `upstream-evaluation.md` / `upstream-evaluation.ko.md` | Why Grok-native redesign over a full upstream fork |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| _(none)_ | Flat documentation set; no nested doc packages |

## For AI Agents

### Working In This Directory
- Always edit EN and KO in the same change; missing half fails `npm test`.
- English docs may self-link only their own language switcher (e.g. `architecture.md` → `architecture.ko.md`).
- Keep `validation.md` honest: distinguish live vs static-only claims; do not invent verified scenarios.
- Stay consistent with skills/agents on concurrency (default 4, max 8 when isolated, lower when resources shared).
- Do not document runtime components (hooks, MCP, daemons) that violate the content-only boundary.

### Testing Requirements
- Pair completeness and language-switcher hygiene are enforced by `scripts/validate.mjs`.
- Semantic accuracy of validation claims is manual / live `grok` evidence.

### Common Patterns
- Bilingual pair: `<topic>.md` + `<topic>.ko.md`
- Cross-link architecture ↔ validation ↔ roadmap carefully

## Dependencies

### Internal
- `plugins/oh-my-grok-build/skills/` and `agents/` for behavioral truth
- Root `README.md` / `README.ko.md` for user-facing summaries
- `scripts/validate.mjs` for pair rules

### External
- Grok Build CLI behavior as observed at validation time
- Optional `xai-org/plugin-marketplace` listing process

<!-- MANUAL: -->
