---
name: ogb-verify
description: Verify a feature, fix, refactor, or plan result with fresh tests, builds, direct evidence, an independent verifier, and Grok Build check-work when available. Use when the user asks whether work is truly complete or invokes /ogb-verify.
argument-hint: "<change, diff, branch, or acceptance criteria>"
disable-model-invocation: true
compatibility: Requires command execution; bundled check-work is used when available.
license: MIT
metadata:
  author: duarbdhks
  short-description: Evidence-based independent verification
---

# OGB Verify

Turn “it should work” into reproducible evidence. This skill verifies; it does not quietly repair failures.

## Rules

1. Use fresh output from the current workspace. Do not reuse a previous agent's unverified success claim.
2. Map every acceptance criterion to at least one observable check.
3. Prefer the narrowest high-signal command before expensive full suites.
4. Separate pre-existing failures from regressions when baseline evidence exists.
5. The independent verifier must not edit files.
6. Report `INCONCLUSIVE` when the required environment, data, credentials, or dependency is unavailable.

## Verification sequence

1. **Define the claim**
   - State exactly what behavior, compatibility, performance, or safety property must be proven.
   - Inspect the final diff and current git status.

2. **Discover project checks**
   - Read package scripts, Makefiles, task runners, CI definitions, test configuration, and repository instructions.
   - Select checks relevant to the changed surface.

3. **Run direct evidence checks**
   - Existing focused tests.
   - Typecheck, compile, or build.
   - Lint or static analysis for the changed surface.
   - Integration or end-to-end tests when the acceptance criteria cross boundaries.
   - Manual or interactive validation when automation cannot observe the behavior.
   - Operational evidence such as logs, metrics, query plans, or migration dry-runs when relevant.

4. **Independent verification**
   - Spawn `oh-my-grok-build:ogb-verifier` with the final diff, acceptance criteria, and direct-check results.
   - Use a non-writing capability or Plan permission mode.
   - Require the verifier to reproduce critical checks rather than merely review the executor's report.

5. **Run `check-work` last**
   - Ask Grok Build to load and follow the bundled `check-work` skill after direct checks and the verifier report.
   - Treat it as an additional independent inspector, not a replacement for tests.
   - If the bundled skill is unavailable, mark this check as unavailable and keep the verdict honest.

6. **Determine the verdict**
   - `PASS`: every required criterion has fresh passing evidence and no blocking independent finding.
   - `FAIL`: at least one required criterion fails or a regression is reproduced.
   - `INCONCLUSIVE`: evidence cannot be gathered for a required criterion.

## Repair boundary

Do not edit code during verification. If repair is requested after a failure, return the failure evidence and hand the bounded fix to `/ogb-start` or a dedicated executor, then rerun this entire verification sequence.

## Output

Use `references/verification-report-template.md`. Include exact commands, exit status, meaningful result, verifier verdict, `check-work` status, and unverified areas. Avoid dumping full logs.
