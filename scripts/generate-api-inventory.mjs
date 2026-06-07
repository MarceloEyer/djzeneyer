#!/usr/bin/env node
/**
 * Gera .context/API_GENERATED.md varrendo register_rest_route() em todos os
 * arquivos PHP do projeto (inc/ e plugins/).
 *
 * O arquivo gerado é inventário automático — não substitui .context/API.md,
 * que é o mapa curado para humanos e agentes.
 *
 * Uso: node scripts/generate-api-inventory.mjs [--check]
 *   --check  Não grava arquivo; sai com código 1 se o gerado estiver desatualizado.
 *
 * Limitações conhecidas:
 *   - Resolve apenas variáveis de string simples ($var = 'value') e concatenações
 *     diretas ($var . '/suffix'). Expressões PHP complexas ficam como [expr].
 *   - Não executa PHP. Análise é puramente textual.
 */

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const OUTPUT = path.join(root, '.context', 'API_GENERATED.md');
const CHECK_MODE = process.argv.includes('--check');

const SCAN_DIRS = [
  path.join(root, 'inc'),
  path.join(root, 'plugins'),
];

// ---------------------------------------------------------------------------
// File walker
// ---------------------------------------------------------------------------

function walkPhp(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkPhp(full));
    } else if (entry.name.endsWith('.php')) {
      results.push(full);
    }
  }
  return results;
}

// ---------------------------------------------------------------------------
// WP_REST_Server constant map → HTTP methods
// ---------------------------------------------------------------------------

const WP_REST_SERVER = {
  READABLE:   'GET',
  CREATABLE:  'POST',
  EDITABLE:   'POST, PUT, PATCH',
  DELETABLE:  'DELETE',
  ALLMETHODS: 'GET, POST, PUT, PATCH, DELETE',
};

// ---------------------------------------------------------------------------
// String variable / constant resolver
// ---------------------------------------------------------------------------

function buildVarMap(content) {
  const map = {};

  // Simple variable assignment: $var = 'value'
  const varRe = /\$(\w+)\s*=\s*['"]([^'"]*)['"]/g;
  let m;
  while ((m = varRe.exec(content)) !== null) map[m[1]] = m[2];

  // Class property: private/protected/public (string) $prop = 'value'
  const propRe = /(?:private|protected|public)\s+(?:\?\w+\s+)?\$(\w+)\s*=\s*['"]([^'"]*)['"]/g;
  while ((m = propRe.exec(content)) !== null) map['this->' + m[1]] = m[2];

  // Class constant: const NAME = 'value'
  const constRe = /const\s+(\w+)\s*=\s*['"]([^'"]*)['"]/g;
  while ((m = constRe.exec(content)) !== null) map['self::' + m[1]] = m[2];

  return map;
}

function resolvePhpString(raw, vars) {
  raw = raw.trim();

  // Simple string literal
  const lit = raw.match(/^['"]([^'"]*)['"]\s*$/);
  if (lit) return lit[1];

  // $this->prop
  const thisProp = raw.match(/^\$this->(\w+)\s*$/);
  if (thisProp && vars['this->' + thisProp[1]] !== undefined) return vars['this->' + thisProp[1]];

  // self::CONST  or  ClassName::CONST
  const selfConst = raw.match(/^(?:self|\w+)::(\w+)\s*$/);
  if (selfConst) {
    const key = 'self::' + selfConst[1];
    if (vars[key] !== undefined) return vars[key];
  }

  // Simple variable
  const varOnly = raw.match(/^\$(\w+)\s*$/);
  if (varOnly && vars[varOnly[1]] !== undefined) return vars[varOnly[1]];

  // Concat: $var . '/suffix'
  const concat = raw.match(/^\$(\w+)\s*\.\s*['"]([^'"]*)['"]\s*$/);
  if (concat && vars[concat[1]] !== undefined) return vars[concat[1]] + concat[2];

  // Reverse concat: '/prefix' . $var
  const rconcat = raw.match(/^['"]([^'"]*)['"]\s*\.\s*\$(\w+)\s*$/);
  if (rconcat && vars[rconcat[2]] !== undefined) return rconcat[1] + vars[rconcat[2]];

  // Fallback: return trimmed raw
  return `[${raw}]`;
}

function resolveMethod(raw, vars) {
  raw = raw.trim();

  // WP_REST_Server::CONST
  const wpConst = raw.match(/WP_REST_Server::(\w+)/);
  if (wpConst && WP_REST_SERVER[wpConst[1]]) return WP_REST_SERVER[wpConst[1]];

  // Might be a regular string or variable
  return resolvePhpString(raw, vars);
}

// ---------------------------------------------------------------------------
// Extract top-level comma-separated arguments from inside register_rest_route(...)
// Handles nested () [] {} but not quoted strings with commas — good enough for PHP routes
// ---------------------------------------------------------------------------

function splitTopLevelArgs(inner) {
  const args = [];
  let depth = 0;
  let cur = '';
  let inStr = false;
  let strChar = '';

  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i];

    if (inStr) {
      cur += ch;
      if (ch === strChar && inner[i - 1] !== '\\') inStr = false;
      continue;
    }

    if (ch === "'" || ch === '"') {
      inStr = true;
      strChar = ch;
      cur += ch;
      continue;
    }

    if (ch === '(' || ch === '[' || ch === '{') { depth++; cur += ch; continue; }
    if (ch === ')' || ch === ']' || ch === '}') { depth--; cur += ch; continue; }

    if (ch === ',' && depth === 0) {
      args.push(cur.trim());
      cur = '';
      continue;
    }

    cur += ch;
  }

  if (cur.trim()) args.push(cur.trim());
  return args;
}

// ---------------------------------------------------------------------------
// Parse a single value from a PHP array for a known key
// e.g. 'methods' => 'GET'  or  'methods' => WP_REST_Server::CREATABLE
// ---------------------------------------------------------------------------

function extractArrayValue(text, key, vars = {}) {
  const re = new RegExp(
    `['"]${key}['"]\\s*=>\\s*` +
    `(?:` +
    `(['"][^'"]+['"])` +                          // quoted string
    `|(WP_REST_Server::\\w+)` +                   // WP constant
    `|\\[\\s*([^\\]]+)\\s*\\]` +                 // array [...]
    `)`,
    's'
  );
  const m = text.match(re);
  if (!m) return null;

  if (m[1]) return resolvePhpString(m[1], vars);
  if (m[2]) return resolveMethod(m[2], vars);
  if (m[3]) {
    // Array of values — could be strings or WP constants
    const vals = [];
    const parts = m[3].split(',');
    for (const part of parts) {
      const t = part.trim();
      if (!t) continue;
      const lit = t.match(/^['"]([^'"]+)['"]$/);
      if (lit) { vals.push(lit[1]); continue; }
      const wpC = t.match(/WP_REST_Server::(\w+)/);
      if (wpC && WP_REST_SERVER[wpC[1]]) { vals.push(WP_REST_SERVER[wpC[1]]); continue; }
      vals.push(t);
    }
    return vals.join(', ');
  }
  return null;
}

// ---------------------------------------------------------------------------
// Main extractor
// ---------------------------------------------------------------------------

function extractRoutes(content, filePath) {
  const vars = buildVarMap(content);
  const routes = [];
  const startRe = /register_rest_route\s*\(/g;
  let m;

  while ((m = startRe.exec(content)) !== null) {
    // Collect the full call by tracking parenthesis depth
    let depth = 1;
    let i = m.index + m[0].length;

    while (i < content.length && depth > 0) {
      const ch = content[i];
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
      i++;
    }

    // inner = everything between register_rest_route( and the closing )
    const inner = content.slice(m.index + m[0].length, i - 1);
    const args = splitTopLevelArgs(inner);

    if (args.length < 3) continue;

    const namespace = resolvePhpString(args[0], vars);
    const routePath = resolvePhpString(args[1], vars);
    const optionsText = args[2];

    const methods = extractArrayValue(optionsText, 'methods', vars) ?? 'GET';
    const callback = extractArrayValue(optionsText, 'callback', vars) ?? '';
    const permission = extractArrayValue(optionsText, 'permission_callback', vars) ?? '';

    routes.push({
      namespace,
      route: routePath,
      methods: methods.toUpperCase(),
      callback,
      permission,
      file: path.relative(root, filePath),
    });
  }

  return routes;
}

// ---------------------------------------------------------------------------
// Collect all routes
// ---------------------------------------------------------------------------

const files = SCAN_DIRS.flatMap(walkPhp);
const allRoutes = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  allRoutes.push(...extractRoutes(content, file));
}

// Group by namespace
const byNamespace = {};
for (const r of allRoutes) {
  if (!byNamespace[r.namespace]) byNamespace[r.namespace] = [];
  byNamespace[r.namespace].push(r);
}

// ---------------------------------------------------------------------------
// Generate Markdown
// ---------------------------------------------------------------------------

const now = new Date().toISOString().slice(0, 10);

const lines = [
  `# API_GENERATED.md`,
  ``,
  `> **Gerado automaticamente** por \`scripts/generate-api-inventory.mjs\` em ${now}.`,
  `> Não edite manualmente. Para o mapa curado, veja [\`.context/API.md\`](./API.md).`,
  ``,
  `Total de endpoints encontrados: **${allRoutes.length}**`,
  ``,
  `---`,
  ``,
];

const namespaces = Object.keys(byNamespace).sort();

for (const ns of namespaces) {
  const routes = byNamespace[ns];
  lines.push(`## \`${ns}\``);
  lines.push(``);
  lines.push(`| Método | Rota | Callback | Permission | Arquivo |`);
  lines.push(`|--------|------|----------|------------|---------|`);

  for (const r of routes) {
    const methods = r.methods.split(',').map(m => `\`${m.trim()}\``).join(' ');
    const route = `\`${r.route}\``;
    const cb = r.callback ? `\`${r.callback}\`` : '—';
    const perm = r.permission ? `\`${r.permission}\`` : '—';
    const file = `\`${r.file}\``;
    lines.push(`| ${methods} | ${route} | ${cb} | ${perm} | ${file} |`);
  }

  lines.push(``);
}

lines.push(`---`);
lines.push(``);
lines.push(`## Rotas consideradas inseguras`);
lines.push(``);
lines.push(`Endpoints com \`permission_callback => __return_true\` que merecem revisão:`);
lines.push(``);

const unsecured = allRoutes.filter(r => r.permission === '__return_true' || r.permission === '');
if (unsecured.length === 0) {
  lines.push(`Nenhum encontrado.`);
} else {
  lines.push(`| Método | Namespace | Rota | Arquivo |`);
  lines.push(`|--------|-----------|------|---------|`);
  for (const r of unsecured) {
    const methods = r.methods.split(',').map(m => `\`${m.trim()}\``).join(' ');
    lines.push(`| ${methods} | \`${r.namespace}\` | \`${r.route}\` | \`${r.file}\` |`);
  }
}

lines.push(``);

const output = lines.join('\n');

// ---------------------------------------------------------------------------
// Write or check
// ---------------------------------------------------------------------------

if (CHECK_MODE) {
  const existing = fs.existsSync(OUTPUT) ? fs.readFileSync(OUTPUT, 'utf8') : '';
  // Strip the date line for comparison (it changes daily)
  const normalize = (s) => s.replace(/gerado automaticamente.*?\n/i, '');
  if (normalize(existing) === normalize(output)) {
    console.log('[api-inventory] OK — inventário está atualizado.');
    process.exit(0);
  } else {
    console.error('[api-inventory] DESATUALIZADO — rode: node scripts/generate-api-inventory.mjs');
    process.exit(1);
  }
}

fs.writeFileSync(OUTPUT, output, 'utf8');
console.log(`[api-inventory] Gerado: .context/API_GENERATED.md (${allRoutes.length} endpoints)`);
