# Getting started

[한국어](getting-started.ko.md)

Install the plugin, confirm it is healthy, and run the first plan → execute → verify loop in under a few minutes.

## Prerequisites

- [Grok Build](https://github.com/xai-org/grok-build) CLI available as `grok`
- A git repository for any work that needs worktree isolation
- Node.js is **not** required to use the plugin at runtime (only for this repository’s static validation)

Historical live installs and sessions in this project used Grok Build `0.2.112`. A later static + `grok plugin validate` receipt used `0.2.118`. See [Compatibility](compatibility.md) and [Validation](validation.md).

## Install

### Marketplace method (recommended)

```bash
grok plugin marketplace add duarbdhks/oh-my-grok-build
grok plugin install oh-my-grok-build --trust
grok plugin enable oh-my-grok-build
```

### Repository subdirectory

```bash
grok plugin install duarbdhks/oh-my-grok-build#plugins/oh-my-grok-build --trust
grok plugin enable oh-my-grok-build
```

### Confirm registration

```bash
grok plugin details oh-my-grok-build
grok inspect
```

In a Grok Build session, reload from `/plugins` or start a new session, then run:

```text
/ogb-doctor
```

You should see seven skills and six plugin-qualified agents (`oh-my-grok-build:planner`, and so on). Same-named agents from `~/.claude/agents/` or `~/.grok/agents/` may appear as warnings; that is expected and does not displace the qualified plugin agents.

## First productive loop

1. **Plan** (no source edits):

   ```text
   /ogb-plan Add a health endpoint that returns 200 and a build id
   ```

2. **Inspect the saved plan** with native Grok controls:

   ```text
   /view-plan
   ```

3. **Execute** only after approval:

   ```text
   /ogb-start Implement the currently approved plan
   ```

4. **Verify** independently:

   ```text
   /ogb-verify Re-check the acceptance criteria for the current changes
   ```

If the request is still vague, start with `/ogb-interview` instead of `/ogb-plan`.

## What success looks like

| Step | Healthy signal |
|---|---|
| Install | `grok plugin details` shows the plugin enabled and trusted |
| Doctor | Skills and agents discoverable; native plan/subagent/worktree checks reported |
| Plan | Saved plan pending approval; working tree unchanged by planning |
| Start | Owned tasks, worktree isolation when writing, no unsolicited commit/push |
| Verify | Fresh checks and an independent verifier verdict (`PASS` / `FAIL` / `INCONCLUSIVE`) |

## Next reading

- [Concepts](concepts.md) — what OGB owns vs Grok Build
- [Command reference](command-reference.md) — full skill contracts
- [Examples](examples.md) — copy-paste scenarios
- [Troubleshooting](troubleshooting.md) — common install and runtime issues
