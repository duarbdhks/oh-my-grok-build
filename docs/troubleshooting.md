# Troubleshooting

[한국어](troubleshooting.ko.md)

## Skills or agents do not appear

1. Confirm install and enable:

   ```bash
   grok plugin details oh-my-grok-build
   grok inspect
   ```

2. Reload plugins in the session (`/plugins`) or start a new session.
3. Run `/ogb-doctor`.
4. Reinstall if the plugin source path is stale:

   ```bash
   grok plugin install oh-my-grok-build --trust
   grok plugin enable oh-my-grok-build
   ```

## Doctor warns about same-named agents

If `planner`, `executor`, or other short names exist under `~/.claude/agents/` or `~/.grok/agents/`, doctor reports a `WARN`. The qualified plugin agents still register as `oh-my-grok-build:<name>`. Always spawn the qualified form so work does not hit the wrong prompt.

## Plan is missing after a new session

A saved plan does not transfer into a fresh session by itself. Continue or resume the original session:

```bash
grok -c
# or
grok -r <session-id>
```

Then inspect with `/view-plan` before `/ogb-start`.

## Worktree isolation is unavailable

Worktree features require a git repository. Initialize git or run from a repo root. Doctor reports repository readiness.

## Parallel tasks keep colliding

Same-file ownership is forbidden in one wave. Split tasks, serialize with `/ogb-start`, or narrow each child’s file set. Shared ports, databases, or lockfiles also lower max-safe concurrency.

## Workflow `script_path` is not trusted

Grok Build may require folder trust for project workflow paths. Historical validation recorded this as a limitation for throwaway fixtures; see [Validation](validation.md). Prefer the documented authoring path via native `create-workflow`, and do not treat untrusted path errors as an OGB runtime bug.

## `/goal` did not call OGB skills

Expected. Skills set `disable-model-invocation: true`. Call `/ogb-plan`, `/ogb-start`, or `/ogb-verify` explicitly when you want those gates.

## Validation claims look different from my local CLI version

Public validation receipts pin specific Grok Build versions and dates. Your newer CLI may work, but absence of a restamped live run means current-command UX is `NOT RUN` for that version until revalidated. See [Compatibility](compatibility.md).

## Static repository checks fail when contributing

From the repository root:

```bash
npm test
```

Requires Node.js `>=20`. This validates manifests, frontmatter, and EN/KO doc pairs — not a live Grok session.
