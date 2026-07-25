# Repository Instructions

This repository is a content-only Grok Build plugin marketplace.

- Preserve zero runtime dependencies.
- Prefer native Grok Build features over custom orchestration code.
- Keep all heavy skills explicit by retaining `disable-model-invocation: true`.
- Keep plugin agents under `plugins/oh-my-grok-build/agents/` and skill names under the `ogb-` namespace.
- Do not add hooks, `.mcp.json`, `.lsp.json`, executable binaries, or network installers without an accepted architecture decision.
- Run `npm test` after every manifest, skill, agent, or index change.
- Run `npm run validate:grok` when a Grok Build CLI is available.
- Update `CHANGELOG.md`, both READMEs, and `.grok-plugin/plugin-index.json` when public components change.
