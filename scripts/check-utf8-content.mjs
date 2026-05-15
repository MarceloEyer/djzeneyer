#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const filesToCheck = [
  'public/llms.txt',
  'public/llms-full.txt',
  'public/robots.txt',
  'public/ai-bots.txt',
  'public/.well-known/ai-bots.txt',
  'public/.well-known/ai-plugin.json',
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
