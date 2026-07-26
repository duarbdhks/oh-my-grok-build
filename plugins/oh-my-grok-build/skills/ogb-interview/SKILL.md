---
name: ogb-interview
description: Interview the user one question at a time until a vague idea becomes a decision-ready direction brief. Use when the request is ambiguous, the design is unsettled, the user wants to be grilled on a plan, or explicitly invokes /ogb-interview.
argument-hint: "<idea, rough direction, or design to stress-test>"
disable-model-invocation: true
compatibility: Requires Grok Build subagents.
license: MIT
metadata:
  author: duarbdhks
  short-description: Socratic interview to a direction brief
---

# OGB Interview

Convert a vague idea or an unproven design into a direction brief that `/ogb-plan` can plan against. This skill is questioning-only. It produces shared understanding, not code and not an implementation plan.

## Hard boundary

1. Do not edit application source, configuration, tests, migrations, generated files, or dependency locks.
2. Do not run mutation-oriented commands, install packages, commit, push, open a pull request, deploy, or invoke an execution skill.
3. Ask exactly one question per turn. Never batch questions.
4. Never ask the user what the repository can answer. Investigate first, then ask a confirmation question that cites the evidence.
5. Do not produce an implementation plan here. End with the direction brief marked `pending approval` and hand off to `/ogb-plan`.

## Readiness dimensions

Rate every dimension after every answer as `CLEAR`, `PARTIAL`, or `UNKNOWN`. The rating is a judgement, not a computed score; state the gap that keeps a dimension below `CLEAR`.

| Dimension | Ready when |
|---|---|
| Goal | The primary outcome states in one sentence without qualifiers, and the core entities are named and stable. |
| Constraints | Boundaries, non-goals, and hard limits are explicit, including what must not change. |
| Acceptance | Every claimed outcome maps to a check someone else could run. |
| Fit (existing code only) | The change is anchored to real files, symbols, and patterns, and the decision to extend or diverge is deliberate. |

## Workflow

1. **Lock the scope shape**
   - Enumerate the top-level components implied by the request, preferring one to six. Group siblings rather than listing sub-tasks.
   - Ask one confirmation question: is this the right shape, and should anything be added, merged, split, or deferred.
   - Record the confirmed components and any deferrals. Deferred components stay listed but are excluded from readiness.

2. **Collect repository evidence**
   - Use direct reads for narrow context.
   - For separate subsystems, spawn `oh-my-grok-build:explorer` agents in parallel with `capability_mode: read-only`.
   - Require file paths, symbols, commands, and observed behavior in every report, and cite them when a question depends on them.

3. **Interview loop**
   - Name the weakest component and dimension, and state in one sentence why that pair is the current bottleneck.
   - Ask one question that targets it. Questions expose assumptions; they do not collect feature lists.
   - Always supply your recommended answer and the reasoning behind it, then offer numbered alternatives and a free-text option.
   - When one component reaches `CLEAR`, rotate to the weakest remaining component so depth on one cannot hide a silent sibling.
   - After each answer, report the readiness table, the confirmed decision, and the next target.

4. **Challenge passes**
   - Round 4 or later, once: contrarian. Challenge the load-bearing assumption. What if the opposite were true, or the constraint does not exist.
   - Round 6 or later, once: simplifier. What is the smallest version that is still valuable, and which constraints are assumed rather than measured.
   - Round 8 or later, once, only while readiness is still below the bar: essence. Ask what the thing fundamentally is when entities keep shifting or the user is naming symptoms.

5. **Stop conditions**
   - All active components rate `CLEAR` on every applicable dimension: write the brief.
   - Round 10: report current readiness and ask whether to continue or stop.
   - Round 15: hard cap. Write the brief with remaining gaps listed as open questions.
   - The user asks to stop, at any point: stop immediately, write the brief, and list every gap that was not closed.
   - Readiness has not moved for three rounds: switch to the essence pass and reframe rather than asking another detail question.

## Direction brief

Use the template in `references/direction-brief-template.md`. Every brief must include:

- readiness verdict and the explicit statement that no implementation has started,
- goal, non-goals, constraints, and assumptions,
- the confirmed component table with active and deferred status,
- testable acceptance criteria,
- assumptions that were exposed and how each was resolved,
- repository evidence with file paths and symbols,
- readiness table with the gap behind every non-`CLEAR` rating,
- open questions that survived the interview.

Deliver the brief in the response. Do not create a private state file, scoring scratchpad, or session tracker; this repository keeps durable state in Grok Build's own plan, todo, and memory features. If the user wants the brief to outlive the session, ask them where to save it.

## Resume

There is no interview state file. To resume after an interruption, run `/ogb-interview` again with the last brief or the answers so far pasted in as the argument, and continue from the weakest dimension.

## Final response

Report:

- readiness verdict: `READY`, `PARTIAL`, or `BLOCKED`,
- the top decision reached and the top unresolved risk,
- the number of rounds and which challenge passes ran,
- the exact next command: `/ogb-plan` with the brief as the task, only after the user approves the direction.
