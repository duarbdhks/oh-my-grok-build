# GitHub Publishing Procedure

[한국어](publishing.ko.md)

Run the following commands from the repository root.

```bash
npm test
git status --short --branch
gh auth status
gh repo create duarbdhks/oh-my-grok-build --public --source=. --remote=origin --push
```

If the remote repository has already been created:

```bash
git remote add origin git@github.com:duarbdhks/oh-my-grok-build.git
git push -u origin main
```

Verify after publishing.

```bash
grok plugin marketplace add duarbdhks/oh-my-grok-build
grok plugin install oh-my-grok-build --trust
grok plugin enable oh-my-grok-build
grok plugin details oh-my-grok-build
grok inspect
```

Set the repository topics so they make clear this is a Grok Build plugin.

```bash
gh repo edit duarbdhks/oh-my-grok-build \
  --add-topic grok-build --add-topic grok --add-topic xai \
  --add-topic xai-org --add-topic grok-plugin --add-topic ai-agents \
  --add-topic developer-tools
```

Create the first tag only after validation in a real Grok session is complete. `grok plugin tag` creates the tag from the version in `plugin.json`.

```bash
git tag -a v0.1.0 -m "oh-my-grok-build v0.1.0"
git push origin v0.1.0
```

## Official Marketplace

xAI operates [`xai-org/plugin-marketplace`](https://github.com/xai-org/plugin-marketplace) as the official marketplace, and `grok` registers it by default as the `xai-official` source. Listed plugins are pinned to a commit SHA in `.grok-plugin/marketplace.json`, so requesting a listing first requires this repository to have a tagged stable version.

Currently `oh-my-grok-build` is a third-party marketplace and has not applied for an official listing. This will be reconsidered after passing the real-session validation gates in the roadmap above.
