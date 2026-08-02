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

Use this skill as a thin OGB guardrail wrapper around Grok Build's bundled `create-workflow` skill. Native `create-workflow` remains the mandatory authoring path and owns workflow syntax, authoring, saving, smoke validation, execution, and journal semantics.

## Mandatory native path

1. Decide whether the request needs a reusable workflow: repeated finite fan-out, staged research, multi-perspective review, or deterministic verification.
2. Prefer ordinary subagents for two to four one-off tasks.
3. When a workflow is appropriate, load and follow Grok Build's bundled `create-workflow` skill before writing or editing any workflow.
4. Follow its procedure for intent gathering, naming, authoring, `validate_only` smoke validation, saving, optional live execution, and reporting.
5. Do not launch a live workflow unless the user explicitly asked to run it.

OGB adds only these guards:

- Inputs are finite, bounded, and validated before use.
- Phases and dependencies are deterministic and explicit.
- Child prompts declare their scope and output contract.
- `agent_budget` is explicit and bounded. Default it to eight unless a concrete item count justifies another value.
- Workflows and workflow-spawned agents do not launch nested workflows.
- Partial failures, pauses, and stop conditions remain visible in the result.
- External side effects are identified and safe against repetition after a pause or interruption.
- Approval is required before an optional live run or external side effect.

## Advanced path

Use this path only when the user explicitly asks to edit a saved workflow manually or needs a Rhai-specific explanation.

Read the bundled `create-workflow` reference for pure-literal `meta`, the Rhai dialect, host APIs, schemas, phases, parallel panels, pause behavior, journal resume, `validate_only`, `script_path`, and saved workflow handling. Do not duplicate that reference here. Every OGB guard in the mandatory path still applies.

## Lifecycle and output

Report the saved path, metadata name, expected arguments, declared phases, agent budget, validation command/result, untested branches, and the exact command for an optional live run.

Keep these native states separate:

- Saved workflow definition: the reusable `.grok/workflows/<name>.rhai` file and its discovery or path result.
- Workflow execution: an invocation of a saved, inline, or `script_path` workflow.
- Workflow-run resume: continuation of a paused run through Grok Build's native journal and resume behavior.
- Saved plan source and session continuity: the current native saved plan is available in the same session or after an actual `grok -c` / `grok -r`; an explicit plan path or concrete task does not imply session resume and is not a workflow run.

OGB does not add a run journal, redefine resume behavior, or treat definition discovery, plan resume, and workflow-run resume as interchangeable. A `validate_only` smoke proves metadata, compilation, and one canned path only.

Use `NOT RUN` when an optional branch was not attempted and `LIMITATION` when an attempted branch could not be proved because of a host, trust, or environment boundary. Never report one branch as proof of another.

Use the checklist in `references/workflow-checklist.md` before declaring the definition ready.
