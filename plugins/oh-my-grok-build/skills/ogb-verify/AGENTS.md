<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-28 | Updated: 2026-07-28 -->

# ogb-verify

## Purpose
Fresh, independent, evidence-based completion check. Maps every acceptance criterion to a real check, spawns a non-writing verifier, and does not repair failures.

## Key Files

| File | Description |
|------|-------------|
| `SKILL.md` | Verification protocol, evidence rules, verdicts, handoff on failure |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `references/` | Verification report template (see `references/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Keep `disable-model-invocation: true`.
- Use fresh workspace evidence only; never trust executor summaries alone.
- Independent verifier must not edit files.
- Sequence: claim → discover checks → direct evidence → `oh-my-grok-build:verifier` → optional bundled `check-work` last.
- Verdicts: `PASS` / `FAIL` / `INCONCLUSIVE`.
- On repair need: hand to `/ogb-start` or executor, then full re-verify.
- Skills reference this skill by bare name `ogb-verify` (no plugin prefix).

### Testing Requirements
- Static skill and agent-ref validation via `npm test`.
- Live verify runs need a changed workspace and runnable checks.

### Common Patterns
- Spawn: `oh-my-grok-build:verifier` under plan/non-writing permissions
- Report via `references/verification-report-template.md`

## Dependencies

### Internal
- `oh-my-grok-build:verifier`
- Called by `ogb-start` and `ogb-ultrawork` after integration

### External
- Optional bundled `check-work` skill; project test/build commands

<!-- MANUAL: -->
