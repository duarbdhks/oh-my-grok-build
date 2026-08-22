# Examples

[한국어](examples.ko.md)

Copy-paste prompts. Adjust paths and names to your repository. These illustrate intent; they are not recorded live session transcripts.

## 1. Small bug fix

```text
/ogb-plan Fix the null pointer when the profile API receives a missing displayName. Keep the public response shape stable.
```

```text
/view-plan
```

```text
/ogb-start Implement the currently approved plan
```

```text
/ogb-verify Confirm the null-profile case and existing happy path still pass
```

## 2. Structural feature

```text
/ogb-plan Add optimistic locking to the user profile update endpoint. Return 409 on version conflict. Include tests and a short rollback note.
```

Review with `/view-plan`, then `/ogb-start`, then `/ogb-verify`.

## 3. Parallel independent modules

```text
/ogb-ultrawork Fix TypeScript errors in packages/alpha, packages/beta, and packages/gamma. One package per executor, worktree isolation, no shared config edits, verify each package.
```

Use only when ownership is truly disjoint. If two tasks must edit the same file, split waves or serialize with `/ogb-start`. If later tasks must read earlier results, use `/ogb-graph` instead.

## 4. Mixed-dependency graph

```text
/ogb-graph Audit every HTTP handler under src/api for missing authentication, patch independent handlers, and re-verify the highest-severity findings from source
```

Use when the work has real result edges plus a large independent fan-out. Do not flatten that DAG through `/ogb-ultrawork`, and do not wait for a second `/ogb-start` after the phase plan.

## 5. Independent re-verification of existing work

```text
/ogb-verify Re-verify that origin/main...HEAD meets the acceptance criteria in the current plan. Do not modify source. Report PASS, FAIL, or INCONCLUSIVE with fresh command evidence.
```

## 6. Long-running work with native `/goal`

OGB does not replace `/goal`. Lock the plan first, run long work natively, verify separately.

```text
/ogb-plan Fix the duplicate-processing bug in the payment webhook. Include idempotency and regression tests.
```

```text
/goal Implement the currently saved plan. Preserve unrelated changes, isolate parallel writes in worktrees, and do not commit, push, or deploy.
```

```text
/ogb-verify Do a final re-verification of the currently saved plan's acceptance criteria
```

Because skills set `disable-model-invocation`, `/goal` will not silently invoke OGB skills.

## 7. Vague requirements → interview first

```text
/ogb-interview We need rate limiting on the public API. I'm unsure about identity keys, limits, and where middleware should live.
```

When the direction brief is approved:

```text
/ogb-plan Build an implementation plan from the approved direction brief for public API rate limiting
```

Then `/view-plan` → `/ogb-start` → `/ogb-verify`.

## 8. Reusable workflow authoring

```text
/ogb-workflow Author a reusable workflow that reviews each changed TypeScript file in parallel with a bounded agent budget, validates with validate_only, and does not run live unless I ask
```

## 9. Install diagnosis

```text
/ogb-doctor
```

If components are missing, reinstall or re-enable the plugin, reload `/plugins`, and run doctor again.
