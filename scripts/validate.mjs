import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const pluginRoot = path.join(root, 'plugins', 'oh-my-grok-build');
const expectedSkills = [
  'ogb-interview',
  'ogb-plan',
  'ogb-start',
  'ogb-ultrawork',
  'ogb-verify',
  'ogb-workflow',
  'ogb-doctor',
].sort();
// Agents carry no `ogb-` prefix: Grok registers them as `oh-my-grok-build:<agent>`, so the
// qualifier already namespaces them. Skills do keep the prefix, because they register bare.
const expectedAgents = [
  'planner',
  'architect',
  'critic',
  'explorer',
  'executor',
  'verifier',
].sort();

const failures = [];
const checks = [];

function check(condition, message) {
  if (condition) checks.push(message);
  else failures.push(message);
}

function readJson(relativePath) {
  const absolutePath = path.join(root, relativePath);
  try {
    return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
  } catch (error) {
    failures.push(`${relativePath}: invalid JSON (${error.message})`);
    return null;
  }
}

function readFrontmatter(absolutePath) {
  const content = fs.readFileSync(absolutePath, 'utf8');
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return { content, fields: null };
  const fields = {};
  for (const key of ['name', 'description', 'disable-model-invocation', 'permissionMode']) {
    const keyMatch = match[1].match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
    if (keyMatch) fields[key] = keyMatch[1].trim().replace(/^['"]|['"]$/g, '');
  }
  return { content, fields };
}

function listDirectories(absolutePath) {
  return fs.readdirSync(absolutePath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function listMarkdownStems(absolutePath) {
  return fs.readdirSync(absolutePath, { withFileTypes: true })
    // Hierarchical AI docs (AGENTS.md) are not Grok agent definitions.
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'AGENTS.md')
    .map((entry) => entry.name.slice(0, -3))
    .sort();
}

function listMarkdownFilesRecursively(absolutePath) {
  return fs.readdirSync(absolutePath, { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => path.join(entry.parentPath ?? entry.path, entry.name))
    .sort();
}

function sameMembers(actual, expected) {
  return JSON.stringify([...actual].sort()) === JSON.stringify([...expected].sort());
}

const marketplace = readJson('.grok-plugin/marketplace.json');
const pluginIndex = readJson('.grok-plugin/plugin-index.json');
const manifest = readJson('plugins/oh-my-grok-build/plugin.json');
const packageJson = readJson('package.json');

check(fs.existsSync(pluginRoot), 'plugin root exists');
check(marketplace?.name === 'oh-my-grok-build', 'marketplace name is correct');
check(Array.isArray(marketplace?.plugins) && marketplace.plugins.length === 1, 'marketplace exposes one plugin');

const marketplacePlugin = marketplace?.plugins?.[0];
check(marketplacePlugin?.name === 'oh-my-grok-build', 'marketplace plugin name is correct');
check(marketplacePlugin?.version === manifest?.version, 'marketplace and manifest versions match');
check(marketplacePlugin?.source?.type === 'local', 'marketplace plugin source is local');
if (marketplacePlugin?.source?.path) {
  const sourcePath = path.resolve(root, marketplacePlugin.source.path);
  check(sourcePath === pluginRoot, 'marketplace source resolves to plugin root');
  check(fs.existsSync(sourcePath), 'marketplace source path exists');
}

check(manifest?.name === 'oh-my-grok-build', 'plugin manifest name is correct');
check(/^\d+\.\d+\.\d+$/.test(manifest?.version ?? ''), 'plugin version is semver');
check(manifest?.skills === 'skills', 'plugin skills path is conventional');
check(manifest?.agents === 'agents', 'plugin agents path is conventional');
check(!('hooks' in (manifest ?? {})), 'plugin manifest declares no hooks');
check(!('mcpServers' in (manifest ?? {})), 'plugin manifest declares no MCP servers');
check(!('lspServers' in (manifest ?? {})), 'plugin manifest declares no LSP servers');

check(packageJson?.private === true, 'repository package is private');
check(!packageJson?.dependencies, 'repository has no runtime dependencies');
check(!packageJson?.devDependencies, 'repository has no development dependencies');

const skillsRoot = path.join(pluginRoot, 'skills');
const agentsRoot = path.join(pluginRoot, 'agents');
const actualSkills = listDirectories(skillsRoot);
const actualAgents = listMarkdownStems(agentsRoot);
check(sameMembers(actualSkills, expectedSkills), `skill inventory matches: ${expectedSkills.join(', ')}`);
check(sameMembers(actualAgents, expectedAgents), `agent inventory matches: ${expectedAgents.join(', ')}`);

const namePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
for (const skillName of actualSkills) {
  const skillFile = path.join(skillsRoot, skillName, 'SKILL.md');
  check(fs.existsSync(skillFile), `${skillName}: SKILL.md exists`);
  if (!fs.existsSync(skillFile)) continue;
  const { fields } = readFrontmatter(skillFile);
  check(Boolean(fields), `${skillName}: frontmatter exists`);
  check(fields?.name === skillName, `${skillName}: frontmatter name matches directory`);
  check(namePattern.test(fields?.name ?? ''), `${skillName}: valid skill name`);
  check(Boolean(fields?.description), `${skillName}: description exists`);
  check(fields?.['disable-model-invocation'] === 'true', `${skillName}: heavy skill requires explicit invocation`);
}

// Grok Build emits `default`, `auto`, `plan`, and `bypassPermissions` only. Claude Code's
// `acceptEdits`/`dontAsk` have no Grok equivalent and would silently never match, so they are
// rejected here. Plugin agents may not declare `bypassPermissions` at all.
const grokPermissionModes = new Set(['default', 'auto', 'plan']);
// Grok registers plugin agents as `oh-my-grok-build:<agent>` but keeps skills on their bare name.
// Three rules guard the two directions of that asymmetry. They cover different shapes and are not
// redundant; do not collapse them.
//
// Rule 0 (qualified -> real agent): referring to a *skill* with the qualified form resolves to
// nothing at spawn time, so every qualified reference must name a real agent.
//
// Rules A and B cover the opposite mistake -- naming an agent without the prefix. Since agent names
// are short (`executor`, not `ogb-executor`), a missing prefix no longer fails loudly: it can
// resolve to an unrelated same-named agent from the user's own `~/.grok/agents/` or
// `~/.claude/agents/`. See docs/validation.md.
//
// Rule A (the executable shape): every `subagent_type:` value must be qualified and name a real
// agent. This is the rule that catches the mistake that actually matters -- the spawn shapes in
// `ogb-start` and `ogb-ultrawork` live in fenced text blocks with no backticks, so Rule B alone
// would never see them. The key appears nowhere but spawn shapes, so there are no false positives.
//
// Rule B (prose identifiers): a backtick-delimited bare agent name is always an identifier, and
// always the wrong one. Backticks are the deliberate boundary -- bare prose ("the executor reports
// its evidence") is left alone, because matching it produces false positives on ordinary English.
// All three rules cover every markdown file a skill ships, not just its SKILL.md. A `references/`
// file becomes instructions the moment the skill loads it, so a bad spawn shape there is as live as
// one in the skill body.
const bareAgentInBackticks = new RegExp(`\`(${expectedAgents.join('|')})\``, 'g');
for (const skillName of actualSkills) {
  for (const file of listMarkdownFilesRecursively(path.join(skillsRoot, skillName))) {
    const label = path.relative(skillsRoot, file);
    const body = fs.readFileSync(file, 'utf8');

    const referenced = [...body.matchAll(/oh-my-grok-build:([a-z0-9-]+)/g)].map((m) => m[1]);
    const unknown = [...new Set(referenced)].filter((ref) => !expectedAgents.includes(ref));
    check(unknown.length === 0, `${label}: qualified references name real agents${unknown.length ? ` (found: ${unknown.join(', ')})` : ''}`);

    const spawnTargets = [...body.matchAll(/subagent_type:\s*(\S+)/g)].map((m) => m[1]);
    const badSpawns = [...new Set(spawnTargets)]
      .filter((target) => !expectedAgents.includes(target.replace(/^oh-my-grok-build:/, '')) || !target.startsWith('oh-my-grok-build:'));
    check(badSpawns.length === 0, `${label}: every subagent_type is a qualified agent${badSpawns.length ? ` (found: ${badSpawns.join(', ')})` : ''}`);

    const bareMentions = [...new Set([...body.matchAll(bareAgentInBackticks)].map((m) => m[1]))];
    check(bareMentions.length === 0, `${label}: agent names are never written bare${bareMentions.length ? ` (found: ${bareMentions.join(', ')})` : ''}`);
  }
}

const expectedPermissionModes = {
  planner: 'plan',
  architect: 'plan',
  critic: 'plan',
  explorer: 'plan',
  executor: 'auto',
  verifier: 'plan',
};
// Frontmatter keys Grok Build does not document for agent definitions. Keeping them would look
// like configuration while having no effect.
const unsupportedAgentFields = ['promptMode', 'outputFormat', 'agentsMd'];
for (const agentName of actualAgents) {
  const agentFile = path.join(agentsRoot, `${agentName}.md`);
  const { content, fields } = readFrontmatter(agentFile);
  check(Boolean(fields), `${agentName}: frontmatter exists`);
  check(fields?.name === agentName, `${agentName}: frontmatter name matches file`);
  check(namePattern.test(fields?.name ?? ''), `${agentName}: valid agent name`);
  check(Boolean(fields?.description), `${agentName}: description exists`);
  check(grokPermissionModes.has(fields?.permissionMode ?? ''), `${agentName}: permission mode is a Grok Build value`);
  check(fields?.permissionMode === expectedPermissionModes[agentName], `${agentName}: permission mode is ${expectedPermissionModes[agentName]}`);
  const frontmatterBlock = content.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? '';
  for (const field of unsupportedAgentFields) {
    check(!new RegExp(`^${field}:`, 'm').test(frontmatterBlock), `${agentName}: no unsupported field ${field}`);
  }
}

const indexedSkills = pluginIndex?.plugins?.['oh-my-grok-build']?.components?.skills?.map((item) => item.name).sort() ?? [];
const indexedAgents = pluginIndex?.plugins?.['oh-my-grok-build']?.components?.agents?.map((item) => item.name).sort() ?? [];
check(pluginIndex?.version === 1, 'plugin index version is 1');
check(sameMembers(indexedSkills, expectedSkills), 'plugin index skill inventory matches files');
check(sameMembers(indexedAgents, expectedAgents), 'plugin index agent inventory matches files');
check(pluginIndex?.plugins?.['oh-my-grok-build']?.version === manifest?.version, 'plugin index and manifest versions match');

check(!fs.existsSync(path.join(pluginRoot, 'hooks')), 'content-only plugin has no hooks directory');
check(!fs.existsSync(path.join(pluginRoot, '.mcp.json')), 'content-only plugin has no .mcp.json');
check(!fs.existsSync(path.join(pluginRoot, '.lsp.json')), 'content-only plugin has no .lsp.json');

for (const required of ['README.md', 'README.ko.md', 'LICENSE', 'NOTICE.md', 'SECURITY.md', 'CHANGELOG.md']) {
  check(fs.existsSync(path.join(root, required)), `${required} exists`);
}

// English is the default language and Korean is the additional translation, so every document
// ships as a pair: `<name>.md` (English) alongside `<name>.ko.md` (Korean). A missing half means
// one language silently fell behind.
const docsRoot = path.join(root, 'docs');
// Product docs only. AGENTS.md is hierarchical AI-readable map docs (deepinit), not a bilingual
// user document, so it is excluded from EN/KO pair and language-switcher inventory checks.
const koreanDocs = fs.readdirSync(docsRoot).filter((name) => name.endsWith('.ko.md')).sort();
const englishDocs = fs.readdirSync(docsRoot)
  .filter((name) => name.endsWith('.md') && !name.endsWith('.ko.md') && name !== 'AGENTS.md')
  .sort();
check(koreanDocs.length > 0, 'docs directory contains Korean translations');
check(sameMembers(englishDocs, koreanDocs.map((name) => name.replace(/\.ko\.md$/, '.md'))),
  `every doc ships an English and a Korean version (en: ${englishDocs.length}, ko: ${koreanDocs.length})`);

// An English document that points at a Korean file sends the reader into the other language set.
// Cross-document references are written as backtick paths more often than as markdown links, so
// match any mention of a `.ko.md` file rather than link syntax only. Each document is allowed
// exactly one: its own language switcher.
const englishEntryPoints = [
  ...englishDocs.map((name) => ({ label: `docs/${name}`, file: path.join(docsRoot, name), own: name.replace(/\.md$/, '.ko.md') })),
  { label: 'README.md', file: path.join(root, 'README.md'), own: 'README.ko.md' },
];
for (const { label, file, own } of englishEntryPoints) {
  const body = fs.readFileSync(file, 'utf8');
  const strayRefs = [...body.matchAll(/([A-Za-z0-9-]+\.ko\.md)/g)]
    .map((match) => match[1])
    .filter((target) => target !== own);
  check(strayRefs.length === 0,
    `${label}: references stay in English${strayRefs.length ? ` (found: ${[...new Set(strayRefs)].join(', ')})` : ''}`);
}

if (failures.length > 0) {
  console.error(`Validation failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Validation passed: ${checks.length} checks`);
console.log(`Skills: ${actualSkills.join(', ')}`);
console.log(`Agents: ${actualAgents.join(', ')}`);
console.log(`Plugin version: ${manifest.version}`);
