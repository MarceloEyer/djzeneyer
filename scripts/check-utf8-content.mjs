#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

// PHP dirs to scan for mojibake (glob-style, checked recursively)
const phpDirs = ['inc', 'plugins'];

const phpFiles = phpDirs.flatMap(dir => {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return [];
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.php') ? [path.join(d, e.name)] : []
  );
  return walk(abs).map(f => path.relative(root, f));
});

const filesToCheck = [
  ...phpFiles,
  'public/llms.txt',
  'public/llms-full.txt',
  'public/robots.txt',
  'public/ai-bots.txt',
  'public/.well-known/ai-bots.txt',
  'public/.well-known/ai-plugin.json',
  'public/.well-known/api-catalog',
  'public/.well-known/auth.md',
  'public/.well-known/oauth-protected-resource',
  'public/.well-known/oauth-authorization-server',
  'public/.well-known/agent-registration',
  'public/.well-known/agent.json',
  'public/.well-known/mcp/server-card.json',
  'public/.well-known/agent-skills/index.json',
  'public/.well-known/agent-skills/artist-context.md',
  'public/.well-known/agent-skills/llms-reference.md',
  'public/.well-known/agent-skills/mcp-discovery.md',
  'public/.well-known/agent-skills/auth-discovery.md',
  '.context/IDENTITY.md',
  'AI_CONTEXT_INDEX.md',
  'AGENTS.md',
];

const suspiciousPatterns = [
  /\uFFFD/,
  /Ã[\x80-\xBF]/,
  /Â[\x80-\xBF]/,
  /â[€\x80-\xBF]/,
  /ðŸ/,
];

const failures = [];

for (const relativePath of filesToCheck) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    failures.push(`${relativePath}: missing`);
    continue;
  }

  const content = fs.readFileSync(absolutePath, 'utf8');
  for (const pattern of suspiciousPatterns) {
    const match = content.match(pattern);
    if (match?.index !== undefined) {
      const line = content.slice(0, match.index).split(/\r?\n/).length;
      failures.push(`${relativePath}:${line}: suspicious text marker "${match[0]}"`);
      break;
    }
  }
}

if (failures.length > 0) {
  console.error('[utf8-content-check] Suspicious UTF-8/mojibake markers found:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`[utf8-content-check] OK: ${filesToCheck.length} files checked.`);
