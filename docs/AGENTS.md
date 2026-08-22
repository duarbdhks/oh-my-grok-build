<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-28 | Updated: 2026-08-06 -->

# docs

## Purpose
Authoritative design and evidence documentation for the plugin marketplace. Covers architecture boundaries, validation status, roadmap gates, publishing steps, upstream-inspiration redesign rationale, and user-facing guides linked from the README landing page. Every English page has a required Korean pair.

## Key Files

| File | Description |
|------|-------------|
| `getting-started.md` / `.ko.md` | Install, doctor, first plan→execute→verify loop |
| `concepts.md` / `.ko.md` | Positioning, ownership, parallelism, verification, naming |
| `command-reference.md` / `.ko.md` | Full contracts for all eight skills |
| `examples.md` / `.ko.md` | Copy-paste usage scenarios |
| `troubleshooting.md` / `.ko.md` | Install and runtime common issues |
| `compatibility.md` / `.ko.md` | Versions, native capabilities, limitations summary |
| `faq.md` / `.ko.md` | Common product questions |
| `design-decisions.md` / `.ko.md` | Short decision log (DD-001…) |
| `github-metadata.md` / `.ko.md` | Owner checklist for GitHub UI settings |
| `architecture.md` / `.ko.md` | Operating discipline, concurrency rules, verify order, security boundary |
| `validation.md` / `.ko.md` | Static and live validation evidence; scenario map; known gaps |
| `roadmap.md` / `.ko.md` | Version plan and validation gate checklist |
| `publishing.md` / `.ko.md` | Marketplace install, tags, and official listing notes |
| `upstream-evaluation.md` / `.ko.md` | Why Grok-native redesign over a full upstream fork |

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
- README is the landing page; put long detail here, not duplicate contradictory status tables.

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
- `assets/brand/` for diagrams referenced from architecture and README

### External
- Grok Build CLI behavior as observed at validation time
- Optional `xai-org/plugin-marketplace` listing process

<!-- MANUAL: -->
