---
name: ogb-doctor
description: Diagnose oh-my-grok-build installation, skill and agent discovery, Grok native capability availability, git worktree readiness, and configuration risks. Use for setup problems or /ogb-doctor.
argument-hint: "[--fix-plan]"
disable-model-invocation: true
compatibility: Requires the grok CLI for complete diagnostics.
license: MIT
metadata:
  author: duarbdhks
  short-description: Plugin readiness diagnostics
---

# OGB Doctor

Diagnose the plugin without changing the user's environment by default. This complements Grok Build's native `/doctor`; it focuses on this plugin's orchestration prerequisites.

## Checks

1. **CLI and plugin**
   - Run `grok --version`.
   - Run `grok plugin details oh-my-grok-build`.
   - Run `grok inspect --json` when available.
   - Confirm the plugin is installed, enabled, and trusted as expected.

2. **Component inventory**
   - Confirm seven skills: `ogb-interview`, `ogb-plan`, `ogb-start`, `ogb-ultrawork`, `ogb-verify`, `ogb-workflow`, `ogb-doctor`.
   - Confirm six agents. Grok registers plugin agents under a plugin-qualified name, so look for `oh-my-grok-build:planner`, `oh-my-grok-build:architect`, `oh-my-grok-build:critic`, `oh-my-grok-build:explorer`, `oh-my-grok-build:executor`, and `oh-my-grok-build:verifier`. Only the qualified form belongs to this plugin.
   - Report any unqualified agent of the same short name — from `~/.grok/agents/`, `~/.claude/agents/`, or another plugin — as a `WARN`, naming the file it came from. It does not displace the qualified entry, but it is what an instruction that drops the prefix will silently reach instead.

3. **Native prerequisites**
   - Confirm Plan mode and `/view-plan` are available.
   - Confirm subagents are enabled.
   - Confirm worktree isolation is available in the current git repository.
   - Confirm native workflows and the bundled `create-workflow` skill are available when workflow authoring is requested.
   - Confirm the bundled `check-work` skill is available for final verification.

4. **Repository readiness**
   - Run `git status --short --branch`.
   - Confirm the directory is a git repository before recommending worktree isolation.
   - Detect existing uncommitted changes and explain that they must be preserved.

5. **Configuration risk**
   - Report disabled plugins or skills, disabled subagents, marketplace pinning requirements, missing trust, and permission modes that automatically approve all tools.
   - Never expose secret values from configuration or environment variables.

## Fix behavior

Without `--fix-plan`, perform no writes and no installs. With `--fix-plan`, provide an ordered set of exact commands and expected results, but do not execute destructive or trust-changing actions automatically.

## Output

Return a table with `PASS`, `WARN`, `FAIL`, or `SKIP` for each check, followed by the smallest safe remediation sequence. Distinguish “not installed” from “installed but disabled” and “enabled but untrusted.”
