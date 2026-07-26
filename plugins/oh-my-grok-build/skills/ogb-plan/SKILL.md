---
name: ogb-plan
description: Build a Grok-native consensus implementation plan before code changes. Use when the user asks for planning, architecture, a safe execution plan, or explicitly invokes /ogb-plan.
argument-hint: "<task or desired outcome>"
disable-model-invocation: true
compatibility: Requires Grok Build plan mode and subagents.
license: MIT
metadata:
  author: duarbdhks
  short-description: Consensus plan without code changes
---

# OGB Plan

Create a decision-ready implementation plan through a sequential Planner → Architect → Critic review. This skill is planning-only.

## Hard boundary

1. Enter Grok Build's native Plan mode before broad investigation.
2. Do not edit application source, configuration, tests, migrations, generated files, or dependency locks.
3. Do not run mutation-oriented commands, install packages, commit, push, open a pull request, deploy, or invoke an execution skill.
4. The only durable artifact allowed before approval is the current native saved plan.
5. End by presenting the plan as `pending approval`. Never continue into implementation in the same invocation.

## Workflow

1. **Ground the request**
   - Classify the request as implementation, bug fix, migration, refactor, incident response, or research-backed design.
   - Capture explicit constraints and make reversible assumptions for missing low-risk details.
   - Ask only questions that block a safe, testable plan. Do not turn planning into an interview by default. When the request is too vague for even one viable option, stop and recommend `/ogb-interview` instead.

2. **Collect evidence**
   - Use direct reads for narrow context.
   - For separate subsystems, spawn `oh-my-grok-build:explorer` agents in parallel with `capability_mode: read-only`.
   - Require file paths, symbols, commands, and observed behavior in every exploration report.

3. **Draft**
   - Spawn `oh-my-grok-build:planner` with the user goal, constraints, exploration evidence, and current repository state.
   - Require at least two viable options when a real architectural choice exists.

4. **Architecture review**
   - Wait for the planner to finish.
   - Then spawn `oh-my-grok-build:architect` with the complete draft and evidence.
   - The architect must state the strongest alternative and the trade-off that prevents a trivial decision.

5. **Critic review**
   - Wait for the architect to finish.
   - Then spawn `oh-my-grok-build:critic` with the revised plan and architecture review.
   - The critic checks scope, ordering, rollback, acceptance criteria, observability, and verification feasibility.

6. **Closed review loop**
   - On `ITERATE` or `REJECT`, revise with the planner, then repeat architect review followed by critic review.
   - Never run architect and critic in parallel.
   - Stop after three review rounds. If no approval is reached, preserve the best plan and list unresolved blockers.

7. **Save the native plan**
   - Keep the plan in Grok Build's current saved plan so the user can inspect it with `/view-plan`.
   - Do not create a second state engine or private JSON tracker.

## Required plan structure

Use the template in `references/plan-template.md`. Every final plan must include:

- status and explicit execution boundary,
- goal, non-goals, assumptions, and constraints,
- current-state evidence with file paths and symbols,
- decision drivers and viable alternatives,
- ADR-style decision and consequences,
- dependency-aware execution waves and task ownership,
- testable acceptance criteria,
- verification matrix covering tests, typecheck/build, manual checks, and observability where relevant,
- rollout and rollback strategy,
- risks, stop conditions, and unresolved questions.

## High-risk mode

Treat authentication, authorization, secrets, payments, data deletion, schema migration, production operations, PII, compliance, and public API breakage as high risk. Add a three-scenario pre-mortem and explicit rollback evidence. The plan must remain pending approval regardless of confidence.

## Final response

Report:

- plan verdict: `APPROVED FOR USER REVIEW`, `PARTIAL`, or `BLOCKED`,
- current saved-plan availability,
- the top decision and top risk,
- the exact next command: `/ogb-start current approved plan` only after user approval.
