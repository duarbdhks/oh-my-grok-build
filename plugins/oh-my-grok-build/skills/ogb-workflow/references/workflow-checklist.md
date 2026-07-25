# Workflow Readiness Checklist

- [ ] The bundled `create-workflow` skill was read first.
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
- [ ] A live run requires explicit user intent.
