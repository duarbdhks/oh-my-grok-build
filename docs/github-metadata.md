# GitHub repository metadata (owner checklist)

[한국어](github-metadata.ko.md)

These settings improve first impression and discovery. **Most require GitHub UI or `gh` with owner permissions.** Checking a box here does not mean the setting is already applied on GitHub.com.

## Recommended description

```text
Native-first Grok Build plugin: consensus planning, bounded parallel execution, independent verification — no second runtime.
```

## Website URL

```text
https://github.com/duarbdhks/oh-my-grok-build
```

Optional later: a docs site only if maintenance cost is justified. README + `docs/` is enough for v0.1.

## Topics

Use only accurate topics:

- `grok-build`
- `grok`
- `ai-agents`
- `agent-orchestration`
- `developer-tools`
- `workflow`
- `planning`
- `verification`

Optional if still accurate: `multi-agent`, `worktree`. Avoid topics that imply official xAI ownership.

Example:

```bash
gh repo edit duarbdhks/oh-my-grok-build \
  --description "Native-first Grok Build plugin: consensus planning, bounded parallel execution, independent verification — no second runtime." \
  --add-topic grok-build --add-topic grok --add-topic ai-agents \
  --add-topic agent-orchestration --add-topic developer-tools \
  --add-topic workflow --add-topic planning --add-topic verification
```

## Social preview image

Upload:

```text
assets/brand/oh-my-grok-build-social-preview.png
```

Size: 1200×630. Source SVG: `assets/brand/social-preview.svg`.

Path in GitHub UI: Repository → Settings → General → Social preview.

## Issue templates

Suggested templates (not required for v0.1):

- Bug report: Grok Build version, install path, `/ogb-doctor` output, reproduction
- Skill behavior: command, expected vs actual, whether source was modified
- Docs: page path and broken link or unclear step

## Pull request template

Suggested checklist:

- [ ] Native-first: no reimplementation of session/goal/worktree/workflow runtime
- [ ] EN/KO doc pairs updated when docs change
- [ ] `npm test` passes
- [ ] Validation claims match `docs/validation.md` (no new live claims without evidence)
- [ ] No unsolicited commit/push/PR automation in skills

## Discussions

Optional. Useful for Q&A if issue noise grows. Not required for a content-only plugin.

## Release notes

Follow [CHANGELOG.md](../CHANGELOG.md). Tag from `plugin.json` version after live validation gates in [roadmap](roadmap.md). Keep notes factual: skills/agents added, validation scope, limitations.

## GitHub Pages / external docs site

Not required for v0.1. Prefer in-repo `docs/` pairs linked from the README. Revisit only if navigation cost becomes high.
