#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const localesDir = path.join(root, 'src', 'locales');
const srcDir = path.join(root, 'src');

const readJson = (filePath) => {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.error(`[i18n-check] Failed to read ${filePath}`);
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
};

const walk = (dir) => {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full));
      continue;
    }
    if (/\.(tsx?|jsx?)$/i.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
};

const hasPath = (obj, dottedPath) => {
  const parts = dottedPath.split('.');
  let cur = obj;

  for (const part of parts) {
    if (cur == null || typeof cur !== 'object' || !(part in cur)) {
      return false;
    }
    cur = cur[part];
  }

  return true;
};

const loadLocaleResources = (lang) => {
  const langDir = path.join(localesDir, lang);
  const resources = {};

  for (const entry of fs.readdirSync(langDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) continue;

    const namespace = path.basename(entry.name, '.json');
    resources[namespace] = readJson(path.join(langDir, entry.name));
  }

  return resources;
};

const getUsedNamespaces = (code) => {
  const namespaces = new Set(['translation']);
  const useTranslationCall = /\buseTranslation\(\s*([^)]+?)?\)/g;
  let m;

  while ((m = useTranslationCall.exec(code)) !== null) {
    const arg = (m[1] || '').trim();
    if (!arg) continue;

    const quoted = arg.match(/^['"]([^'"]+)['"]/);
    if (quoted?.[1]) {
      namespaces.add(quoted[1]);
      continue;
    }

    const array = arg.match(/^\[\s*([\s\S]*?)\s*\]/);
    if (!array?.[1]) continue;

    const namespaceLiteral = /['"]([^'"]+)['"]/g;
    let namespaceMatch;
    while ((namespaceMatch = namespaceLiteral.exec(array[1])) !== null) {
      namespaces.add(namespaceMatch[1]);
    }
  }

  return namespaces;
};

const collectUsedKeys = (code) => {
  const keys = new Set();

  // t('foo.bar') / i18n.t("foo.bar")
  const tCall = /\b(?:i18n\.)?t\(\s*(['"])([^'"\n]+?)\1/g;
  let m;
  while ((m = tCall.exec(code)) !== null) {
    const key = m[2].trim();
    if (key) keys.add(key);
  }

  // <Trans i18nKey="foo.bar" />
  const transKey = /\bi18nKey\s*=\s*(['"])([^'"\n]+?)\1/g;
  while ((m = transKey.exec(code)) !== null) {
    const key = m[2].trim();
    if (key) keys.add(key);
  }

  return keys;
};

const en = loadLocaleResources('en');
const pt = loadLocaleResources('pt');

const allNamespaces = new Set([
  ...Object.keys(en),
  ...Object.keys(pt),
]);

const files = walk(srcDir);
const usedKeys = new Map();

for (const file of files) {
  const code = fs.readFileSync(file, 'utf8');
  const namespaces = getUsedNamespaces(code);

  for (const key of collectUsedKeys(code)) {
    if (!usedKeys.has(key)) usedKeys.set(key, new Set());
    const keyNamespaces = usedKeys.get(key);
    for (const namespace of namespaces) {
      keyNamespaces.add(namespace);
    }
  }
}

const hasKey = (resources, key, namespaces) => {
  if (key.includes(':')) {
    const [namespace, ...rest] = key.split(':');
    return hasPath(resources[namespace], rest.join(':'));
  }

  const candidateNamespaces = new Set(namespaces);

  for (const namespace of allNamespaces) {
    if (hasPath(resources[namespace], key)) {
      candidateNamespaces.add(namespace);
    }
  }

  for (const namespace of candidateNamespaces) {
    if (hasPath(resources[namespace], key)) return true;
  }

  return false;
};

const missingInPt = [];
const missingInEn = [];

for (const [key, namespaces] of [...usedKeys.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  if (!hasKey(pt, key, namespaces)) missingInPt.push(key);
  if (!hasKey(en, key, namespaces)) missingInEn.push(key);
}

if (missingInPt.length === 0 && missingInEn.length === 0) {
  console.log(`[i18n-check] OK: ${usedKeys.size} used keys are present in EN/PT locale namespaces.`);
  process.exit(0);
}

console.error('[i18n-check] Missing translation keys used in code.');

if (missingInPt.length > 0) {
  console.error(`\nMissing in PT (${missingInPt.length}):`);
  for (const key of missingInPt) {
    console.error(`  - ${key}`);
  }
}

if (missingInEn.length > 0) {
  console.error(`\nMissing in EN (${missingInEn.length}):`);
  for (const key of missingInEn) {
    console.error(`  - ${key}`);
  }
}

process.exit(1);
