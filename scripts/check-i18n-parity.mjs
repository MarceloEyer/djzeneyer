#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const enPath = path.join(root, 'src', 'locales', 'en', 'translation.json');
const ptPath = path.join(root, 'src', 'locales', 'pt', 'translation.json');
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

const en = readJson(enPath);
const pt = readJson(ptPath);

const files = walk(srcDir);
const usedKeys = new Set();

for (const file of files) {
  const code = fs.readFileSync(file, 'utf8');
  for (const key of collectUsedKeys(code)) {
    usedKeys.add(key);
  }
}

const missingInPt = [];
const missingInEn = [];

for (const key of [...usedKeys].sort()) {
  if (!hasPath(pt, key)) missingInPt.push(key);
  if (!hasPath(en, key)) missingInEn.push(key);
}

if (missingInPt.length === 0 && missingInEn.length === 0) {
  console.log(`[i18n-check] OK: ${usedKeys.size} used keys are present in EN/PT.`);
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
