<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-22 | Updated: 2026-08-22 -->

# references

## Purpose
Worked patterns, an optional machine-readable plan schema, and the closing report shape for `/ogb-graph`. Load on demand from `SKILL.md`; do not duplicate these bodies into the skill.

## Key Files

| File | Description |
|------|-------------|
| `best-practices.md` | 60-endpoint example, failure modes, sizing, when not to graph |
| `plan-schema.md` | JSON plan for an external runner only; omit rather than fabricate scheduler fields |
| `graph-report-template.md` | Required closing report; missing completeness or gate lines make it incomplete |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| _(none)_ | Flat reference set |

## For AI Agents

### Working In This Directory
- Keep agent names qualified in every markdown file (`oh-my-grok-build:…`).
- `plan-schema.md` is not the default user-visible output.
- Do not add a JSON state engine here.

### Testing Requirements
- Covered by recursive skill markdown checks in `npm test`.

### Common Patterns
- Large graph or a degraded prior run → read `best-practices.md`
- Handing a plan to an external runner → read `plan-schema.md`
- Closing the skill → fill `graph-report-template.md`

## Dependencies

### Internal
- Parent `SKILL.md` pointers

### External
- None

<!-- MANUAL: -->
