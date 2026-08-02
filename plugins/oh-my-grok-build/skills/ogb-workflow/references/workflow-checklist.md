# Workflow Readiness Checklist

- [ ] The bundled `create-workflow` skill was read first and remains the mandatory authoring path.
- [ ] `meta.name` is stable, unique, and a pure literal.
- [ ] Inputs are finite and validated.
- [ ] Phases and dependencies are explicit.
- [ ] Every child prompt has an input/output contract.
- [ ] `agent_budget` is passed explicitly.
- [ ] Parallel panels fit within the remaining budget.
- [ ] Partial failures are represented in the output.
- [ ] External side effects are identified.
- [ ] The workflow does not launch nested workflows.
- [ ] `validate_only: true` passed for representative arguments.
- [ ] Untested branches are documented.
- [ ] A live run requires explicit user intent and is reported separately from saved-definition validation.
- [ ] Saved workflow definition, workflow execution, workflow-run resume, saved plan source, and actual session continuity through `grok -c` / `grok -r` are reported separately.
- [ ] Workflow-run resume uses native Grok Build journal and resume behavior; OGB adds no run journal.
- [ ] `validate_only: true`, saved-definition discovery, live execution, and workflow-run resume are not treated as interchangeable proof.
- [ ] An unexecuted optional branch is `NOT RUN`; an attempted branch blocked by a host, trust, or environment boundary is `LIMITATION`; neither is `PASS`.
- [ ] Manual Rhai or host-API details stay in the Advanced path; the bundled reference remains authoritative.
