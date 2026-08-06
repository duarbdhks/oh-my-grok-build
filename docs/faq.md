# FAQ

[한국어](faq.ko.md)

## Is this a fork of Grok Build?

No. It is an independent third-party plugin that installs into Grok Build.

## Is it a separate execution engine like oh-my-claudecode?

No. It is content-only skills and agents. Runtime orchestration stays in Grok Build (subagents, worktrees, workflows, goal, sessions). See [Upstream evaluation](upstream-evaluation.md).

## Do I need the Claude API or Anthropic API?

No. OGB does not call Anthropic or Claude APIs. You use Grok Build as usual.

## Is an external agent pack required?

No. The seven skills only need the six shipped agents. Optional third-party agent rosters are suggestions for work outside that scope, not dependencies.

## Does OGB replace `/goal`?

No. Use `/ogb-plan` to lock quality, native `/goal` for long autonomous runs if you want, then `/ogb-verify` for independent evidence.

## Does it run unlimited parallel agents?

No. Parallelism is bounded (`C*`, isolation caps, residual child budget, workflow `agent_budget`). Speed comes from removing serial waits under ownership rules, not from unbounded fan-out.

## Does it protect my Git state?

Skills instruct agents not to commit, push, open PRs, force-reset, or discard unrelated changes without an explicit user request. You still control Grok permission modes.

## Which Grok Build versions are validated?

Historical live runs: `0.2.112`. Static + plugin validate receipt: `0.2.118`. See [Compatibility](compatibility.md) and [Validation](validation.md).

## Do plans persist across brand-new sessions?

Not automatically. Use `grok -c` or `grok -r` to continue/resume the session that holds the saved plan.

## Is production work auto-approved?

No. Planning ends pending approval. High-risk work should keep plan and verify explicit. Skills with `disable-model-invocation` will not silently fire inside `/goal`.

## Is this an official xAI project?

No. Not affiliated with or endorsed by xAI. Grok and Grok Build may be trademarks of their respective owners.

## How do I report security issues?

See [SECURITY.md](../SECURITY.md).
