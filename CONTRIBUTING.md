# Contributing

## Principles

Contributions must preserve the Grok-native boundary:

1. Prefer a native Grok Build capability over a plugin-side reimplementation.
2. Keep default fan-out bounded and explicit.
3. Do not add hooks, MCP servers, binaries, network calls, or persistent databases without an architecture decision record and a security review.
4. Keep planning, execution, and verification responsibilities separate.
5. Never claim completion without fresh evidence.

## Local checks

```bash
npm test
npm run validate:grok
```

`npm run validate:grok` skips the official Grok validation step when the `grok` CLI is not installed.

## Pull requests

Include:

- the problem and expected user impact,
- the native Grok capability considered first,
- compatibility risks,
- commands used for validation,
- whether the change expands tool privileges or cost exposure.
