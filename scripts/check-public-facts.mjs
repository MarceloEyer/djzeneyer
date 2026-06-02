#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CANONICAL_COUNTRIES_PLAYED = 14;
const REQUIRED_FILES = [
  'src/data/artistData.ts',
  'src/locales/en/translation.json',
  'src/locales/pt/translation.json',
  '.context/IDENTITY.md',
  '.human/TASK_LIST.md',
];

const read = (relativePath) => fs.readFileSync(path.join(ROOT, relativePath), 'utf8');

const failures = [];
const assertIncludes = (relativePath, needle, reason) => {
  const content = read(relativePath);
  if (!content.includes(needle)) {
    failures.push(`${relativePath}: missing ${JSON.stringify(needle)} (${reason})`);
  }
};

const artistData = read('src/data/artistData.ts');
const countriesMatch = artistData.match(/countriesPlayed:\s*(\d+)/);

if (!countriesMatch) {
  failures.push('src/data/artistData.ts: missing ARTIST.stats.countriesPlayed');
} else if (Number(countriesMatch[1]) !== CANONICAL_COUNTRIES_PLAYED) {
  failures.push(
    `src/data/artistData.ts: countriesPlayed is ${countriesMatch[1]}, expected ${CANONICAL_COUNTRIES_PLAYED}`
  );
}

for (const relativePath of REQUIRED_FILES) {
  if (!fs.existsSync(path.join(ROOT, relativePath))) {
    failures.push(`${relativePath}: required public-fact file is missing`);
  }
}

assertIncludes(
  '.context/IDENTITY.md',
  '14 países presenciais',
  'identity SSOT must state the canonical country count'
);
assertIncludes(
  '.human/TASK_LIST.md',
  '14 países presenciais',
  'human/off-page tasks must preserve the canonical country count memory'
);
assertIncludes(
  'src/locales/en/translation.json',
  '14 countries',
  'English public copy must use the canonical country count'
);
assertIncludes(
  'src/locales/pt/translation.json',
  '14 países',
  'Portuguese public copy must use the canonical country count'
);

if (failures.length > 0) {
  console.error('\nPublic fact drift check failed:\n');
  for (const failure of failures) console.error(`- ${failure}`);
  console.error('\nUpdate the canonical source or align public copy before merging.\n');
  process.exit(1);
}

console.log('Public fact drift check passed.');
