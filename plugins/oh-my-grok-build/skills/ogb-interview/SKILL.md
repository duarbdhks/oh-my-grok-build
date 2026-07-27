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
4. Never ask the user what the repository can answer. Investigate first, then ask a confirmation question that cites the evidence in the same turn.
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

Every question turn below — the scope-shape confirmation in step 1, the interview loop in step 3, and each challenge pass in step 4 — follows `## Question format`.

1. **Lock the scope shape**
   - Enumerate the top-level components implied by the request, preferring one to six. Group siblings rather than listing sub-tasks.
   - Ask one confirmation question, per `## Question format`, naming the proposed components in the user's language and pairing each with the short English label that `Status:` and the direction brief will use from here on: is this the right shape, and should anything be added, merged, split, or deferred.
   - Record the confirmed components and any deferrals. Deferred components stay listed but are excluded from readiness.

2. **Collect repository evidence**
   - Use direct reads for narrow context.
   - For separate subsystems, spawn `oh-my-grok-build:explorer` agents in parallel with `capability_mode: read-only`.
   - Require file paths, symbols, commands, and observed behavior in every report, and cite them when a question depends on them.

3. **Interview loop**
   - Pick the weakest component and dimension internally, and aim the question at that pair. Do not open the turn by naming the pair, the rating, or the reasoning — that belongs in `Status:`, last.
   - Ask one question that exposes an assumption. Questions do not collect feature lists.
   - Present the whole turn per `## Question format`, ending in `Status:`.
   - When one component reaches `CLEAR`, rotate to the weakest remaining component so depth on one cannot hide a silent sibling.

4. **Challenge passes** — each pass below follows `## Question format`.
   - Round 4 or later, once: contrarian. Challenge the load-bearing assumption. What if the opposite were true, or the constraint does not exist.
   - Round 6 or later, once: simplifier. What is the smallest version that is still valuable, and which constraints are assumed rather than measured.
   - Round 8 or later, once, only while readiness is still below the bar: essence. Ask what the thing fundamentally is when entities keep shifting or the user is naming symptoms.

5. **Stop conditions**
   - All active components rate `CLEAR` on every applicable dimension: write the brief.
   - Round 10: report current readiness and ask whether to continue or stop.
   - Round 15: hard cap. Write the brief with remaining gaps listed as open questions.
   - The user asks to stop, at any point: stop immediately, write the brief, and list every gap that was not closed.
   - Readiness has not moved for three rounds: switch to the essence pass and reframe rather than asking another detail question.

## Question format

This format governs every question turn; see `## Workflow` for which turns those are. Use these elements in this order:

1. The question. One or two sentences, one decision, answerable in a sentence.
2. One line on why it matters: what changes depending on the answer.
3. `Recommended:` the answer and the reason, one line.
4. Numbered alternatives, one line each, each stating the consequence of choosing it, plus a free-text option.
5. `Evidence:` file paths and symbols, on their own line, when the question depends on them. This is how hard boundary 4's same-turn evidence citation is satisfied without lengthening the question sentence.
6. `Status:` a compact block — not the full markdown table, which stays only in the direction brief — placed last, carrying, in order: the decisions confirmed so far; one line per active component that is not yet fully `CLEAR`, naming only that component's weakest dimension, its rating, and the gap behind it; and the next target. Components already fully `CLEAR` are listed by name only, with no rating repeated. Deferred components are named once, inside the decisions-confirmed sentence, together with the reason they were deferred — they get no dimension line of their own, since a deferred component carries no rating to report. Before the first answer (the step-1 scope confirmation), `Status:` names the proposed components and states that no dimension is rated yet; a deferral agreed in that answer first appears in the next turn's decisions-confirmed sentence.

Rules for everything before `Status:` (elements 1-5):

- Plain language only. `CLEAR`, `PARTIAL`, `UNKNOWN`, "dimension", "readiness", "bottleneck", and "component" never appear before `Status:`. They belong in `Status:` only.
- Name real things: the route, the table, the screen, the failure — the user's own words and the repository's own names, not abstract category labels. Exception: step 1's scope-shape question is naming the proposed component grouping itself, so it names the components directly, in the user's language.
- No file path inside the question sentence; a path belongs on the `Evidence:` line.
- One decision per turn. If the question needs "and," it is two questions.
- Options state an outcome, not a label: "Block after 5 failed logins per IP" beats "stricter policy."

Language: ask the question, the why-it-matters line, the `Recommended:` reasoning, and the alternatives in the language the user wrote in. Only the literal labels `Recommended:` and `Evidence:` stay fixed in English as turn markers — everything else in elements 1-5 follows the user's language. `Status:` (element 6) follows the same split: its structural markers — the `Status:` label, `Cleared:`, `Next:`, each component's name used as a sub-label, the dimension names, and the `CLEAR`/`PARTIAL`/`UNKNOWN` ratings — stay fixed in the skill's defined English terms, because they are category vocabulary that must match the direction brief, not prose. The prose these markers introduce — the decisions-confirmed sentence, each gap description, and the reasoning behind the next target — is written for the user to read, exactly like the why-it-matters line, and follows the user's language. The direction brief itself stays in the fixed English terms throughout, since it is a durable artifact handed to `/ogb-plan`, not a turn addressed to the user in their language.

The round-10 continue-or-stop checkpoint (Stop conditions, step 5) is a question and follows the same shape: ask it in plain language ("Ten rounds in — keep going, or write up what we have?"), and put the readiness summary in `Status:`, in the compact form defined in element 6, rather than in the question line.

**Do not ask:**
> The weakest pair is `rate limit policy` × Goal, rated `PARTIAL` because the enforcement boundary is unspecified. Should the constraint apply per-identity or per-connection?

**Ask instead:**
> Should the limit count attempts per user account, or per IP address?
> This decides whether one attacker with many IPs can lock out a real user.
> Recommended: per IP — `GET /status` and `POST /messages` have no login and no session, so there is no account to count against yet.
> 1. Per IP — simple now, but one office network shares a single budget.
> 2. Per account — needs auth first, which this repository does not have.
> 3. Both — most accurate, most code, two thresholds to tune.
> 4. Something else — describe it.
> Evidence: `src/server.js` defines `GET /status` and `POST /messages` with no middleware; `package.json` lists no rate-limit dependency.
> Status: Confirmed — both routes share one limiter; storage and response behavior deferred until the policy is set. Cleared: Routes covered. Limit policy: Goal — PARTIAL, enforcement boundary (per-account vs per-IP) unspecified. Next: Limit policy, Acceptance, once the boundary is set.

The step-1 confirmation uses the same shape, with the component split as the decision:

> Rate limiting looks like four things to settle — which routes are covered (`Routes covered`), how the limit is counted (`Limit policy`), where the counter lives (`Storage & enforcement`), and what a blocked caller sees (`Response behavior`). Is that the right split?
> This fixes what the rest of the interview is about — anything left out here stays out.
> Recommended: keep all four and settle them in that order, because the counting rule decides the other three.
> 1. All four as listed.
> 2. Merge the counter's location into the counting rule — fewer turns, but the storage choice gets decided implicitly.
> 3. Defer what a blocked caller sees — it is not needed until the policy is set.
> 4. Something is missing or wrong — say what.
> Evidence: `src/server.js` defines `GET /status` and `POST /messages` with no middleware; `package.json` lists no rate-limit dependency.
> Status: Proposed components — Routes covered, Limit policy, Storage & enforcement, Response behavior. No dimension rated yet.

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
