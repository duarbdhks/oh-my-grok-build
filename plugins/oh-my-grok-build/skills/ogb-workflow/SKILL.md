---
name: ogb-workflow
description: Design, create, and smoke-validate a reusable native Grok Build Rhai workflow for bounded fan-out or staged verification. Use when the user asks for automation, a reusable workflow, or invokes /ogb-workflow.
argument-hint: "<workflow purpose and bounded input>"
disable-model-invocation: true
compatibility: Requires Grok Build workflow and create-workflow support.
license: MIT
metadata:
  author: duarbdhks
  short-description: Safe native workflow authoring
---

# OGB Workflow

Create native Grok Build workflows instead of embedding another orchestration engine in this plugin.

## Hard requirements

1. Load and read Grok Build's bundled `create-workflow` skill before writing or editing any Rhai script.
2. Define a finite input schema, deterministic phases, explicit stop conditions, and a bounded child-agent budget.
3. Use a pure-literal `meta` map with a stable name and description.
4. Save reusable project workflows under `.grok/workflows/<name>.rhai`; use `~/.grok/workflows/` only when the user explicitly wants a user-wide workflow.
5. Run the workflow tool with `validate_only: true` and representative arguments before offering a live run.
6. A smoke validation proves metadata, compilation, and one canned path only. State that limitation.
7. Do not launch a live workflow unless the user explicitly asked to run it.

## Design protocol

1. Confirm the workflow is appropriate: repeated finite fan-out, staged research, multi-perspective review, or deterministic verification.
2. Prefer ordinary subagents for two to four one-off tasks.
3. Define:
   - input arguments and defaults,
   - phases and dependencies,
   - per-agent prompt contracts,
   - structured output schemas,
   - budget and concurrency limits,
   - error, partial-result, pause, and stop behavior.
4. Default `agent_budget` to eight. Raise it only from a concrete item count.
5. Prevent nested workflow launches; workflows and workflow-spawned agents must not start another workflow.
6. Validate with representative happy-path and edge-case arguments when path selection differs.
7. Review the script for external side effects that could repeat after pause or interruption.

## Output

Report the saved path, metadata name, expected arguments, declared phases, agent budget, validation command/result, untested branches, and the exact command for an optional live run.

Use the checklist in `references/workflow-checklist.md` before declaring the definition ready.
