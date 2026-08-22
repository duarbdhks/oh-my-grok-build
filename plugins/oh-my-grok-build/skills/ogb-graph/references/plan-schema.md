# Machine-readable plan format

Emit this only when the plan is being handed to an external runner: a scheduler, a CI job, another agent. For a human reader it is noise; use the markdown phase plan in `SKILL.md` instead.

Nothing in this schema executes on its own. Fields like `max_concurrency` and `retry` are instructions to a runner you have written. If no such runner exists, omit them rather than emitting values that imply a scheduler is enforcing them.

## Schema

```json
{
  "goal": "One-sentence statement of what done looks like",
  "nodes": [
    {
      "id": "classify_endpoint",
      "description": "Classify one endpoint's auth posture",
      "inputs": ["read_handler.output", "read_middleware.output"],
      "outputs": ["endpoint_id", "auth_mode", "severity", "evidence"],
      "cardinality": 60,
      "executor": "subagent",
      "tier": "standard"
    }
  ],
  "edges": [
    {
      "from": "read_middleware",
      "to": "classify_endpoint",
      "reason": "Classification is relative to middleware defaults"
    }
  ],
  "phases": [
    {
      "phase": 1,
      "mode": "parallel",
      "nodes": ["read_handler", "read_middleware"],
      "batch_size": 20
    }
  ],
  "consolidation": {
    "layers": [
      { "inputs": 60, "batch_size": 20, "outputs": 3 },
      { "inputs": 3, "batch_size": 3, "outputs": 1 }
    ],
    "completeness_check": "received == expected, list any missing by id"
  },
  "verification": {
    "method": "re-derive from source",
    "scope": "top 5 findings by severity"
  }
}
```

## Field notes

`outputs`: name the fields each node returns, not just "a summary." Uniform output shape across a cardinality group is what makes fan-in cheap.

`cardinality`: how many instances of this node run. Lets a runner size batches without inspecting inputs.

`edges.reason`: required. Writing the reason is what catches phantom edges. If you cannot articulate what flows across it, there is probably no edge.

`batch_size`: cap it at the binding constraint (API rate limit, context budget, host spawn cost), not at an aspirational number. Prefer 10 to 25 items per child so a 60-item phase stays inside 16 lifetime child calls.

executor (JSON field): `"inline"` or `"subagent"`. Irreversible nodes and final synthesis are always `"inline"`. On Grok, `"subagent"` maps to `oh-my-grok-build:explorer` for reads, `oh-my-grok-build:executor` for writes, and `oh-my-grok-build:verifier` for the verification node.

`tier`: `"fast"`, `"standard"`, or `"strongest"`. A tier name, never a model ID. Let the runner resolve the tier. Grok inherit is the default when the host does not route by tier. Strongest is reserved for fresh-context verification of high-stakes output.

Human gates: a node whose `description` is an irreversible action (send, deploy, delete, production write) must list a human approval node among its `inputs`. A runner that cannot pause for approval must not be handed a plan containing one.

Omit rather than fabricate. No `timeout_seconds` unless something enforces timeouts. No `retry` unless something retries. A spec that describes infrastructure you do not have is worse than a shorter honest one.
