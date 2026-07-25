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
const expectedAgents = [
  'ogb-planner',
  'ogb-architect',
  'ogb-critic',
  'ogb-explorer',
  'ogb-executor',
  'ogb-verifier',
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
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name.slice(0, -3))
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
// Referring to a skill with the qualified form resolves to nothing at spawn time, so every
// qualified reference in a SKILL.md must name a real agent.
//
// This check is deliberately one-way. The opposite mistake -- naming an agent without the prefix --
// is not detectable here: a bare `ogb-executor` in prose is indistinguishable from a legitimate
// mention of the file, and scanning for it produces false positives. That case is covered by the
// spawn-shape blocks in `ogb-start` and `ogb-ultrawork`, and by running `/ogb-doctor` in a live
// session. See docs/validation.md.
for (const skillName of actualSkills) {
  const skillFile = path.join(skillsRoot, skillName, 'SKILL.md');
  if (!fs.existsSync(skillFile)) continue;
  const body = fs.readFileSync(skillFile, 'utf8');
  const referenced = [...body.matchAll(/oh-my-grok-build:([a-z0-9-]+)/g)].map((m) => m[1]);
  const unknown = [...new Set(referenced)].filter((ref) => !expectedAgents.includes(ref));
  check(unknown.length === 0, `${skillName}: qualified references name real agents${unknown.length ? ` (found: ${unknown.join(', ')})` : ''}`);
}

const expectedPermissionModes = {
  'ogb-planner': 'plan',
  'ogb-architect': 'plan',
  'ogb-critic': 'plan',
  'ogb-explorer': 'plan',
  'ogb-executor': 'auto',
  'ogb-verifier': 'plan',
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
const koreanDocs = fs.readdirSync(docsRoot).filter((name) => name.endsWith('.ko.md')).sort();
const englishDocs = fs.readdirSync(docsRoot)
  .filter((name) => name.endsWith('.md') && !name.endsWith('.ko.md'))
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
