# Contributing

Thanks for helping keep oh-my-grok-build a trustworthy, native-first plugin.

## Principles

Contributions must preserve the Grok-native boundary:

1. Prefer a native Grok Build capability over a plugin-side reimplementation.
2. Keep default fan-out bounded and explicit.
3. Do not add hooks, MCP servers, binaries, network calls, or persistent databases without an architecture decision record and a security review.
4. Keep planning, execution, and verification responsibilities separate. `/ogb-plan` never implements. `/ogb-graph` is an execution skill that prints a short phase plan and then runs it; it is not a second planner.
5. Never claim completion without fresh evidence.
6. Do not invent validation metrics, community size, or live-run results in docs.

## Documentation

- English is the default; every user doc under `docs/` ships as `<name>.md` + `<name>.ko.md`.
- Update both halves in the same change. `npm test` fails when a pair is missing.
- README is the landing page; long detail belongs in `docs/`.
- Status and validation claims must match [docs/validation.md](docs/validation.md).

## Local checks

```bash
npm test
npm run validate:grok
```

`npm run validate:grok` skips the official Grok validation step when the `grok` CLI is not installed. Node.js `>=20` is required for `npm test` only.

## Pull requests

Include:

- the problem and expected user impact,
- the native Grok capability considered first,
- compatibility risks,
- commands used for validation,
- whether the change expands tool privileges or cost exposure,
- EN/KO pair updates when docs change.

Suggested checklist:

- [ ] No reimplementation of session / goal / worktree / workflow runtime
- [ ] Skill and agent product behavior unchanged unless the PR is intentionally about that behavior
- [ ] `npm test` passes
- [ ] No new “verified on Grok X” claims without receipts in `docs/validation.md`

## Brand assets

See [assets/brand/README.md](assets/brand/README.md) for regeneration rules. Prefer SVG sources plus optimized PNG; avoid huge binaries and external runtime image services.
