# Security Policy

## Security posture

Version `0.1.0` is content-only. It ships skills and agent definitions, with no hooks, MCP servers, LSP servers, native binaries, package dependencies, or background daemon.

Installed skills and agents can still direct Grok Build to read files, edit code, execute commands, and spawn subagents under the user's existing permissions. Review the repository before installing it with `--trust`, keep normal permission prompts enabled for unfamiliar projects, and avoid `/always-approve` for high-risk work.

## Reporting

Report suspected vulnerabilities through a private GitHub security advisory when the repository supports it. Do not include credentials, private repository contents, or production data in a public issue.

## High-risk changes

The following require an explicit design and security review before merge:

- hooks or automatic command execution,
- MCP or LSP server configuration,
- network access,
- secret handling,
- installation scripts or downloaded binaries,
- permission bypasses,
- telemetry or usage collection.
