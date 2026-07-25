import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const pluginRoot = path.join(root, 'plugins', 'oh-my-grok-build');
const expectedSkills = [
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

for (const required of ['README.md', 'README.en.md', 'LICENSE', 'NOTICE.md', 'SECURITY.md', 'CHANGELOG.md']) {
  check(fs.existsSync(path.join(root, required)), `${required} exists`);
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
