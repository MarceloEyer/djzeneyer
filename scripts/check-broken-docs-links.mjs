#!/usr/bin/env node
/**
 * Varre MDs críticos em .context/ e .agents/ e reporta links internos quebrados.
 * Só verifica links relativos (./arquivo.md, ../path/arquivo.md).
 * Links externos (http/https) são ignorados intencionalmente.
 *
 * Uso: node scripts/check-broken-docs-links.mjs
 * Sai com código 1 se encontrar links quebrados.
 */

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const SCAN_DIRS = [
  path.join(root, '.context'),
  path.join(root, '.agents'),
];

// Padrão de link Markdown: [texto](./caminho) ou [texto](../caminho)
// Ignora âncoras puras (#section) e links externos (http/https/mailto)
const LINK_RE = /\[([^\]]*)\]\(([^)]+)\)/g;

function isRelativeLink(href) {
  if (!href) return false;
  if (href.startsWith('http://') || href.startsWith('https://')) return false;
  if (href.startsWith('mailto:')) return false;
  if (href.startsWith('#')) return false;
  return true;
}

function stripAnchor(href) {
  const idx = href.indexOf('#');
  return idx !== -1 ? href.slice(0, idx) : href;
}

function walkMd(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkMd(full));
    } else if (entry.name.endsWith('.md')) {
      results.push(full);
    }
  }
  return results;
}

const files = SCAN_DIRS.flatMap(walkMd);
const broken = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let match;
    LINK_RE.lastIndex = 0;
    while ((match = LINK_RE.exec(line)) !== null) {
      const href = match[2];
      if (!isRelativeLink(href)) continue;

      const targetPath = stripAnchor(href);
      const resolved = path.resolve(path.dirname(file), targetPath);

      if (!fs.existsSync(resolved)) {
        broken.push({
          file: path.relative(root, file),
          line: i + 1,
          href,
          resolved: path.relative(root, resolved),
        });
      }
    }
  }
}

if (broken.length === 0) {
  console.log('[docs-links] OK — nenhum link interno quebrado encontrado.');
  process.exit(0);
}

console.error(`[docs-links] ERRO — ${broken.length} link(s) interno(s) quebrado(s):\n`);
for (const b of broken) {
  console.error(`  ${b.file}:${b.line}`);
  console.error(`    Link:   ${b.href}`);
  console.error(`    Alvo:   ${b.resolved} (não existe)\n`);
}
process.exit(1);
