# Roadmap

[한국어](roadmap.ko.md)

## v0.1 — Content-type Preview

- Marketplace and plugin manifest
- Plan/execute/parallel/verify/workflow/diagnostic skills
- 6 role-based agents
- Static validation and CI
- No hooks, MCP, daemon, or external state storage

## v0.1 Validation Gate

Before a stable release, the following real-session scenarios must pass.

1. ✅ Adding the GitHub marketplace, and install/enable/reload
2. ✅ `/ogb-doctor` confirms 6 skills and 6 agents
3. ✅ `/ogb-plan` creates a saved plan without modifying the source
4. ✅ `/ogb-start` merges two independent worktree jobs
5. ⬜ Blocking conflicting file ownership before execution — a scenario with overlapping ownership hasn't been created yet
6. ✅ Does not misjudge a failed test as a success
7. ✅ `oh-my-grok-build:verifier` and `check-work` run independently
8. ✅ `/ogb-workflow` only proposes scripts that passed `validate_only`

Evidence is in `docs/validation.md`. Only item 5 is unverified, and it can only be reproduced by deliberately creating a conflicting work split.

## v0.2 — Validated Workflow Recipes

After smoke-testing on the real Grok CLI, add the following Rhai workflow candidates.

- Parallel review per changed file
- Per-module test diagnostics
- Plan review panel
- Migration preflight

Static examples ship only once Grok Build's workflow interface stabilizes.

## v0.3 — Team Policy

- Managed configuration examples for organizations
- SHA-pinned marketplace deployment examples
- Cost budget policy and high-risk task policy templates
- Team-specific AGENTS.md integration guide

## v1.0 Criteria

- Used in three or more real projects
- Install and worktree validated on Linux and macOS
- Manifest compatible across two consecutive Grok Build releases
- Reproducible plan-stop and validation-failure handling for high-risk tasks
- Fixed input/output contract for public commands
