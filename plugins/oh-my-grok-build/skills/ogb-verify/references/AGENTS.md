<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-28 | Updated: 2026-07-28 -->

# references

## Purpose
Templates for independent verification reports produced by `ogb-verify`.

## Key Files

| File | Description |
|------|-------------|
| `verification-report-template.md` | Acceptance mapping, commands run, verdict, residual risk |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| _(none)_ | Flat template directory |

## For AI Agents

### Working In This Directory
- Require fresh command evidence fields, not executor-claimed success alone.
- Verdict vocabulary: `PASS` / `FAIL` / `INCONCLUSIVE`.

### Testing Requirements
- Markdown agent-ref hygiene via root `npm test` when agents are named.

### Common Patterns
- Criterion → check → result rows

## Dependencies

### Internal
- Parent skill `../SKILL.md`

### External
- None

<!-- MANUAL: -->
