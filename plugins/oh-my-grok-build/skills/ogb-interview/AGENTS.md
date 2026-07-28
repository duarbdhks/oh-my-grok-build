<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-28 | Updated: 2026-07-28 -->

# ogb-interview

## Purpose
One-question-at-a-time Socratic interview that produces a decision-ready direction brief for `/ogb-plan`. Questioning only: no code edits, installs, or execution skills.

## Key Files

| File | Description |
|------|-------------|
| `SKILL.md` | Interview protocol, dimension scoring, round caps, handoff rules |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `references/` | Direction brief template (see `references/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Keep `disable-model-invocation: true`.
- Exactly one question per turn; never batch questions.
- Do not ask questions the repo can answer — use parallel `oh-my-grok-build:explorer` for that.
- End in `pending approval`; hand off to `/ogb-plan` only after user approval.
- No private state files; resume by re-invoking with a pasted brief.

### Testing Requirements
- Static skill + reference inventory via `npm test`.
- Live behavior is manual interview quality, not unit-tested.

### Common Patterns
- Dimensions: Goal / Constraints / Acceptance / Fit → CLEAR|PARTIAL|UNKNOWN
- Caps: checkpoint ~10, hard stop ~15; challenge passes at 4/6/8+

## Dependencies

### Internal
- `oh-my-grok-build:explorer` for parallel read-only subsystem probes
- Downstream: `ogb-plan`

### External
- Grok Build subagents and user interaction

<!-- MANUAL: -->
