#!/usr/bin/env node
/**
 * Verifica fronteiras arquiteturais: proíbe fetch() em pages/, components/ e contexts/.
 * Requests devem ficar em src/hooks/ ou src/services/.
 *
 * Dívida técnica conhecida está listada em KNOWN_DEBT abaixo.
 * Arquivos nessa lista passam com aviso, não erro.
 * Qualquer nova ocorrência FORA da lista falha o check.
 *
 * Uso: node scripts/check-architecture-boundaries.mjs
 * Sai com código 1 se encontrar violações novas.
 */

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

// Pastas proibidas de conter fetch()
const FORBIDDEN_DIRS = [
  path.join(root, 'src', 'pages'),
  path.join(root, 'src', 'components'),
  path.join(root, 'src', 'contexts'),
];

// Dívida técnica conhecida — arquivos com fetch() legítimo e rastreado.
// Remover daqui quando a refatoração correspondente for concluída.
// Ref: .context/ENGINEERING_PRINCIPLES.md — "Dívida técnica conhecida e rastreada"
// Dívida técnica conhecida. Remover entrada quando a refatoração for concluída.
// Ref: .context/ENGINEERING_PRINCIPLES.md — "Dívida técnica conhecida e rastreada"
const KNOWN_DEBT = new Set([]);

// Padrão: \bfetch( — captura chamadas diretas à Fetch API.
// \b garante word boundary: não casa com onPrefetch(, prefetch(, etc.
// Ignora linhas que começam com // (comentários de linha única)
const FETCH_RE = /\bfetch\s*\(/;
const COMMENT_RE = /^\s*\/\//;

function walk(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(full));
    } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

const files = FORBIDDEN_DIRS.flatMap(walk);
const violations = [];
const debt = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const matches = [];

  for (let i = 0; i < lines.length; i++) {
    if (!COMMENT_RE.test(lines[i]) && FETCH_RE.test(lines[i])) {
      matches.push(i + 1);
    }
  }

  if (matches.length === 0) continue;

  const rel = path.relative(root, file);
  if (KNOWN_DEBT.has(file)) {
    debt.push({ file: rel, lines: matches });
  } else {
    violations.push({ file: rel, lines: matches });
  }
}

// Relatório de dívida conhecida (aviso, não erro)
if (debt.length > 0) {
  console.warn('[arch-check] AVISO — dívida técnica rastreada (não bloqueia):');
  for (const d of debt) {
    console.warn(`  ${d.file} — fetch() nas linhas: ${d.lines.join(', ')}`);
  }
  console.warn('  → Ver .context/ENGINEERING_PRINCIPLES.md para plano de correção.\n');
}

// Violações novas (erro)
if (violations.length === 0) {
  console.log('[arch-check] OK — nenhuma violação nova de fronteira encontrada.');
  process.exit(0);
}

console.error(`[arch-check] ERRO — ${violations.length} violação(ões) nova(s) de fronteira arquitetural:\n`);
for (const v of violations) {
  console.error(`  ${v.file}`);
  console.error(`    fetch() nas linhas: ${v.lines.join(', ')}`);
  console.error(`    fetch() pertence a src/hooks/ ou src/services/ — não a pages/components/contexts/.\n`);
}
console.error('  Ref: .context/ENGINEERING_PRINCIPLES.md — "Regra de ouro"\n');
process.exit(1);
