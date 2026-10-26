#!/usr/bin/env node
// devcrew installer: one source of truth (src/) -> Claude Code and GitHub Copilot formats.
// Zero dependencies. Usage: devcrew init [--claude] [--copilot] [--force] [--dir <path>]

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = join(dirname(fileURLToPath(import.meta.url)), '..', 'src');

const args = process.argv.slice(2);
const cmd = args[0];
const flag = (n) => args.includes(`--${n}`);
const dirIdx = args.indexOf('--dir');
const target = resolve(dirIdx >= 0 ? args[dirIdx + 1] : process.cwd());

if (cmd !== 'init') {
  console.log(`devcrew - AI dev crew for Claude Code + GitHub Copilot

Usage:
  devcrew init [--claude] [--copilot] [--force] [--dir <path>]

  --claude    install only Claude Code files
  --copilot   install only GitHub Copilot files
  --force     overwrite files that already exist
  --dir       target project (default: current directory)`);
  process.exit(cmd ? 1 : 0);
}

const wantClaude = flag('claude') || !flag('copilot');
const wantCopilot = flag('copilot') || !flag('claude');
const force = flag('force');
const written = [];
const skipped = [];

function put(relPath, content) {
  const full = join(target, relPath);
  if (existsSync(full) && !force) {
    skipped.push(relPath);
    return;
  }
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content);
  written.push(relPath);
}

// Minimal frontmatter parser: "key: value" lines between --- fences.
function parse(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: text };
  const meta = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { meta, body: m[2].replace(/^\n+/, '') };
}

const fm = (obj) =>
  '---\n' +
  Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n') +
  '\n---\n\n';

const read = (p) => readFileSync(join(SRC, p), 'utf8');
const list = (p) => readdirSync(join(SRC, p)).filter((f) => f.endsWith('.md'));

// Agents
for (const file of list('agents')) {
  const { meta, body } = parse(read(`agents/${file}`));
  const name = meta.name;
  if (wantClaude) {
    put(
      `.claude/agents/${name}.md`,
      fm({ name, description: meta.description, tools: meta.claude_tools, model: meta.claude_model }) + body,
    );
  }
  if (wantCopilot) {
    put(`.github/agents/${name}.agent.md`, fm({ name, description: meta.description }) + body);
  }
}

// Commands (Claude slash commands) / prompt files (Copilot)
for (const file of list('commands')) {
  const { meta, body } = parse(read(`commands/${file}`));
  const name = file.replace(/\.md$/, '');
  if (wantClaude) {
    put(`.claude/commands/${name}.md`, fm({ description: meta.description, 'argument-hint': meta.hint }) + body);
  }
  if (wantCopilot) {
    // Copilot prompt files take input via ${input:name:placeholder}, not $ARGUMENTS.
    const placeholder = (meta.hint || 'details').replace(/[<>:{}]/g, '').trim();
    const copilotBody = body.replaceAll('$ARGUMENTS', '${input:task:' + placeholder + '}');
    put(`.github/prompts/${name}.prompt.md`, fm({ description: meta.description, agent: 'agent' }) + copilotBody);
  }
}

// Shared project files (both tools read AGENTS.md; docs are the shared memory)
put('AGENTS.md', read('templates/AGENTS.md'));
put('docs/blueprint.md', read('templates/docs/blueprint.md'));
put('docs/sprint-plan.md', read('templates/docs/sprint-plan.md'));
put('docs/decisions.md', read('templates/docs/decisions.md'));
if (wantClaude) put('CLAUDE.md', read('templates/CLAUDE.md'));
if (wantCopilot) put('.github/copilot-instructions.md', read('templates/copilot-instructions.md'));

console.log(`devcrew installed into ${target}`);
console.log(`  created: ${written.length} file(s)`);
for (const f of written) console.log(`    + ${f}`);
if (skipped.length) {
  console.log(`  skipped (already exist, use --force to overwrite): ${skipped.length}`);
  for (const f of skipped) console.log(`    = ${f}`);
}
console.log('\nNext: fill docs/blueprint.md and the "Project" section of AGENTS.md, then run /plan (Claude) or the plan prompt (Copilot).');
