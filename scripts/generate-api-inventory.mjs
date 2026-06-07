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
 *   - Não executa PHP. Análise é puramente textual.
 *   - Expressões dinâmicas que não seguem padrões reconhecíveis ficam como [expr].
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
  let m;

  // Simple variable assignment: $var = 'value'
  const varRe = /\$(\w+)\s*=\s*['"]([^'"]*)['"]/g;
  while ((m = varRe.exec(content)) !== null) map[m[1]] = m[2];

  // Class property: private/protected/public (string) $prop = 'value'
  const propRe = /(?:private|protected|public)\s+(?:\?\w+\s+)?\$(\w+)\s*=\s*['"]([^'"]*)['"]/g;
  while ((m = propRe.exec(content)) !== null) map['this->' + m[1]] = m[2];

  // Class constant: const NAME = 'value'
  const constRe = /const\s+(\w+)\s*=\s*['"]([^'"]*)['"]/g;
  while ((m = constRe.exec(content)) !== null) map['self::' + m[1]] = m[2];

  // Variable alias: $var = $this->prop  (resolve immediately if prop is known)
  const thisAlias = /\$(\w+)\s*=\s*\$this->(\w+)/g;
  while ((m = thisAlias.exec(content)) !== null) {
    const resolved = map['this->' + m[2]];
    if (resolved !== undefined) map[m[1]] = resolved;
  }

  // Variable alias: $var = self::CONST or ClassName::CONST
  const constAlias = /\$(\w+)\s*=\s*(?:self|\w+)::(\w+)/g;
  while ((m = constAlias.exec(content)) !== null) {
    const resolved = map['self::' + m[2]] ?? WP_REST_SERVER[m[2]];
    if (resolved !== undefined) map[m[1]] = resolved;
  }

  return map;
}

// Build a merged var map for all PHP files in the same plugin directory.
// This lets class properties defined in the main plugin file be visible
// when parsing sibling files (e.g. zen-bit/v2 resolved in class-zen-bit-api.php).
function buildPluginVarMap(filePath) {
  const pluginRoot = detectPluginRoot(filePath);
  if (!pluginRoot) return buildVarMap(fs.readFileSync(filePath, 'utf8'));

  const merged = {};
  for (const f of walkPhp(pluginRoot)) {
    Object.assign(merged, buildVarMap(fs.readFileSync(f, 'utf8')));
  }
  return merged;
}

// Returns the plugin root dir (the directory containing the main .php header),
// or null if the file is not inside a plugin directory.
function detectPluginRoot(filePath) {
  const pluginsBase = path.join(root, 'plugins');
  if (!filePath.startsWith(pluginsBase + path.sep)) return null;
  const rel = filePath.slice(pluginsBase.length + 1);
  const parts = rel.split(path.sep);
  // File must be inside a plugin subdirectory, not directly in plugins/
  if (parts.length < 2) return null;
  const candidate = path.join(pluginsBase, parts[0]);
  try {
    if (!fs.statSync(candidate).isDirectory()) return null;
  } catch {
    return null;
  }
  return candidate;
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

  // Branch token pattern: WP_REST_Server::CONST, 'string', or $var (no :: ambiguity)
  const BRANCH = String.raw`(WP_REST_Server::\w+|'[^']*'|\$\w+)`;

  // String-equality ternary: ($var === 'val' ? A : B) — resolve condition when var is known
  const eqTernary = raw.match(
    new RegExp(String.raw`\$(\w+)\s*===\s*'([^']*)'\s*\?\s*` + BRANCH + String.raw`\s*:\s*` + BRANCH)
  );
  if (eqTernary) {
    const [, varName, expected, trueExpr, falseExpr] = eqTernary;
    const actual = vars[varName];
    if (actual !== undefined) {
      return actual === expected
        ? resolveMethod(trueExpr.trim(), vars)
        : resolveMethod(falseExpr.trim(), vars);
    }
    // Condition unknown — show both branches
    const a = resolveMethod(trueExpr.trim(), vars);
    const b = resolveMethod(falseExpr.trim(), vars);
    return a === b ? a : `${a} | ${b}`;
  }

  // Generic ternary: (? A : B)
  const ternary = raw.match(new RegExp(String.raw`\?\s*` + BRANCH + String.raw`\s*:\s*` + BRANCH));
  if (ternary) {
    const a = resolveMethod(ternary[1], vars);
    const b = resolveMethod(ternary[2], vars);
    return a === b ? a : `${a} | ${b}`;
  }

  // WP_REST_Server::CONST
  const wpConst = raw.match(/WP_REST_Server::(\w+)/);
  if (wpConst && WP_REST_SERVER[wpConst[1]]) return WP_REST_SERVER[wpConst[1]];

  return resolvePhpString(raw, vars);
}

// Clean up callback: extract just the method name from array callbacks.
// [$api_class, 'list_events'] or [__CLASS__, 'login'] → 'login'
function cleanCallback(cb) {
  if (!cb) return cb;
  // Has a comma — likely [object/class, 'method'] pattern
  if (cb.includes(',')) {
    const parts = cb.split(',');
    const last = parts[parts.length - 1].trim().replace(/^['"]|['"]$/g, '');
    return last;
  }
  return cb;
}

// ---------------------------------------------------------------------------
// Extract top-level comma-separated arguments from inside register_rest_route(...)
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
// ---------------------------------------------------------------------------

function extractArrayValue(text, key, vars = {}) {
  const re = new RegExp(
    `['"]${key}['"]\\s*=>\\s*` +
    `(?:` +
    `(['"][^'"]+['"])` +                          // quoted string
    `|(WP_REST_Server::\\w+)` +                   // WP constant
    `|(\\([^)]+\\))` +                            // parenthesised expression (ternary)
    `|\\[\\s*([^\\]]+)\\s*\\]` +                 // array [...]
    `)`,
    's'
  );
  const m = text.match(re);
  if (!m) return null;

  if (m[1]) return resolvePhpString(m[1], vars);
  if (m[2]) return resolveMethod(m[2], vars);
  if (m[3]) return resolveMethod(m[3], vars);   // ternary
  if (m[4]) {
    // Array of values — could be strings or WP constants or variables
    const vals = [];
    const parts = m[4].split(',');
    for (const part of parts) {
      const t = part.trim();
      if (!t) continue;
      const lit = t.match(/^['"]([^'"]+)['"]$/);
      if (lit) { vals.push(lit[1]); continue; }
      const wpC = t.match(/WP_REST_Server::(\w+)/);
      if (wpC && WP_REST_SERVER[wpC[1]]) { vals.push(WP_REST_SERVER[wpC[1]]); continue; }
      vals.push(resolvePhpString(t, vars));
    }
    return vals.join(', ');
  }
  return null;
}

// ---------------------------------------------------------------------------
// Foreach route expansion
// Extract foreach ($arrayVar as $keyVar => $valVar) { register_rest_route($ns, $keyVar, ...) }
// Returns a map from loop-key-var → [{key, value}] pairs for per-iteration substitution.
// ---------------------------------------------------------------------------

function extractForeachPairs(content) {
  // Map from array var name → array of {key, value} string pairs
  const arrayPairs = {};

  // Find PHP array literals: $name = ['key1' => 'val1', 'key2' => 'val2']
  const arrayLitRe = /\$(\w+)\s*=\s*\[([^\]]+?)\]/gs;
  let m;
  while ((m = arrayLitRe.exec(content)) !== null) {
    const varName = m[1];
    const body = m[2];
    const pairRe = /['"]([^'"]+)['"]\s*=>\s*['"]([^'"]+)['"]/g;
    const pairs = [];
    let pm;
    while ((pm = pairRe.exec(body)) !== null) pairs.push({ key: pm[1], value: pm[2] });
    if (pairs.length > 0) arrayPairs[varName] = pairs;
  }

  // Find foreach ($array as $keyVar => $valVar) and map keyVar → pairs
  const foreachRe = /foreach\s*\(\s*\$(\w+)\s+as\s+\$(\w+)\s*=>\s*\$(\w+)\s*\)/g;
  const result = {};
  while ((m = foreachRe.exec(content)) !== null) {
    const [, arrayVar, keyVar, valVar] = m;
    if (arrayPairs[arrayVar]) {
      result[keyVar] = { pairs: arrayPairs[arrayVar], valVar };
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Main extractor
// ---------------------------------------------------------------------------

function extractRoutes(content, filePath) {
  const vars = buildPluginVarMap(filePath);
  const loopKeys = extractForeachPairs(content);
  const routes = [];
  const startRe = /register_rest_route\s*\(/g;
  let m;

  while ((m = startRe.exec(content)) !== null) {
    // Collect the full call by tracking parenthesis depth
    let depth = 1;
    let i = m.index + m[0].length;
    let inStr = false;
    let strChar = '';

    while (i < content.length && depth > 0) {
      const ch = content[i];
      if (inStr) {
        if (ch === strChar && content[i - 1] !== '\\') inStr = false;
      } else if (ch === "'" || ch === '"') {
        inStr = true;
        strChar = ch;
      } else if (ch === '(') {
        depth++;
      } else if (ch === ')') {
        depth--;
      }
      i++;
    }

    const inner = content.slice(m.index + m[0].length, i - 1);
    const args = splitTopLevelArgs(inner);

    if (args.length < 3) continue;

    const namespace = resolvePhpString(args[0], vars);
    const rawRoute  = args[1].trim();
    const optionsText = args[2];

    const methods    = extractArrayValue(optionsText, 'methods', vars) ?? 'GET';
    const rawCb      = extractArrayValue(optionsText, 'callback', vars) ?? '';
    const permission = extractArrayValue(optionsText, 'permission_callback', vars) ?? '';
    const callback   = cleanCallback(rawCb);

    // Check if the route argument is a foreach loop-key variable
    const loopVar = rawRoute.match(/^\$(\w+)$/);
    if (loopVar && loopKeys[loopVar[1]]) {
      const { pairs, valVar } = loopKeys[loopVar[1]];
      // Expand: one route entry per {key, value} pair, substituting both vars
      for (const { key, value } of pairs) {
        const iterVars = { ...vars, [loopVar[1]]: key, [valVar]: value };
        const iterMethods = (extractArrayValue(optionsText, 'methods', iterVars) ?? 'GET').toUpperCase();
        const iterRawCb   = extractArrayValue(optionsText, 'callback', iterVars) ?? '';
        const iterCb      = cleanCallback(iterRawCb);
        routes.push({
          namespace,
          route: key,
          methods: iterMethods,
          callback: iterCb,
          permission,
          file: path.relative(root, filePath),
        });
      }
      continue;
    }

    const routePath = resolvePhpString(rawRoute, vars);

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
// Namespace guessing for unresolved [expr]
// When a namespace can't be resolved statically, scan all plugin PHP files
// for strings matching the WP namespace pattern (word/vN) as a fallback.
// ---------------------------------------------------------------------------

function guessNamespace(filePath) {
  const pluginRoot = detectPluginRoot(filePath);
  if (!pluginRoot) return null;

  const nsPattern = /['"]([a-z][a-z0-9-]*\/v\d+)['"]/g;
  const candidates = new Set();

  for (const f of walkPhp(pluginRoot)) {
    const text = fs.readFileSync(f, 'utf8');
    let m;
    while ((m = nsPattern.exec(text)) !== null) candidates.add(m[1]);
    nsPattern.lastIndex = 0;
  }

  if (candidates.size === 1) return [...candidates][0];
  return null; // ambiguous — don't guess
}

// ---------------------------------------------------------------------------
// Collect all routes
// ---------------------------------------------------------------------------

const files = SCAN_DIRS.flatMap(walkPhp);
const allRoutes = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const routes = extractRoutes(content, file);

  // Post-process: fill in guessed namespaces for unresolved ones
  for (const r of routes) {
    if (r.namespace.startsWith('[')) {
      const guess = guessNamespace(file);
      if (guess) r.namespace = guess + ' ⚠';
    }
  }

  allRoutes.push(...routes);
}

// Group by namespace — strip the " ⚠" suffix so guessed and canonical namespaces
// are merged into the same group instead of creating duplicate sections.
const byNamespace = {};
for (const r of allRoutes) {
  const nsKey = r.namespace.replace(' ⚠', '');
  if (!byNamespace[nsKey]) byNamespace[nsKey] = [];
  byNamespace[nsKey].push(r);
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
  const nsLabel = ns.endsWith(' ⚠') ? `${ns.slice(0, -2)} *(namespace inferido)*` : ns;
  lines.push(`## \`${nsLabel}\``);
  lines.push(``);
  lines.push(`| Método | Rota | Callback | Permission | Arquivo |`);
  lines.push(`|--------|------|----------|------------|---------|`);

  for (const r of routes) {
    const methods = r.methods.split(/[,|]/).map(m => `\`${m.trim()}\``).join(' ');
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
    const methods = r.methods.split(/[,|]/).map(m => `\`${m.trim()}\``).join(' ');
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
