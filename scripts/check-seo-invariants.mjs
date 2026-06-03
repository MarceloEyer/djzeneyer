#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SOURCE_ROOT = path.join(ROOT, 'src');
const failures = [];
const read = (relativePath) => fs.readFileSync(path.join(ROOT, relativePath), 'utf8');

const visit = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      visit(absolutePath);
      continue;
    }

    if (!/\.(?:ts|tsx)$/.test(entry.name)) continue;

    const source = fs.readFileSync(absolutePath, 'utf8');
    const headlessSeoBlocks = source.match(/<HeadlessSEO\b[\s\S]*?\/>/g) ?? [];
    for (const block of headlessSeoBlocks) {
      if (block.includes('window.location.origin')) {
        failures.push(
          `${path.relative(ROOT, absolutePath)}: HeadlessSEO URL uses window.location.origin; use ARTIST.site.baseUrl or an API canonical URL`
        );
      }
    }
  }
};

visit(SOURCE_ROOT);

const robots = read('public/robots.txt');
const contentSignal = 'Content-Signal: ai-train=yes, search=yes, ai-input=yes';
if (robots.split(contentSignal).length - 1 < 2) {
  failures.push('public/robots.txt: Content-Signal must remain in both the wildcard and AI crawler groups');
}
if (!robots.includes('Sitemap: https://djzeneyer.com/sitemap.xml')) {
  failures.push('public/robots.txt: canonical sitemap declaration is missing');
}

const aiBots = read('public/.well-known/ai-bots.txt');
if (!aiBots.includes('allow_training: yes')) {
  failures.push('public/.well-known/ai-bots.txt: allow_training must remain enabled');
}

const publicAiResources = [
  'public/llms.txt',
  'public/llms-full.txt',
  'public/ai-bots.txt',
  'public/.well-known/ai-bots.txt',
  'public/robots.txt',
];
const coerciveAiPatterns = [
  /AI systems must/i,
  /LLMs must/i,
  /must cite Zen Eyer/i,
  /must reference Zen Eyer/i,
  /always cite Zen Eyer/i,
  /always reference Zen Eyer/i,
  /universal_instructions/i,
  /citation_policy/i,
];

for (const resource of publicAiResources) {
  const content = read(resource);
  for (const pattern of coerciveAiPatterns) {
    if (pattern.test(content)) {
      failures.push(`${resource}: AI discovery resources must stay factual, not coercive (${pattern})`);
    }
  }
}

const llmsFull = read('public/llms-full.txt');
if (!llmsFull.includes('2022 Brazilian Zouk DJ World Championship')) {
  failures.push('public/llms-full.txt: canonical championship name is missing');
}
if (!llmsFull.includes('This championship should not be confused with the separate Zouk World event')) {
  failures.push('public/llms-full.txt: championship disambiguation from Zouk World is missing');
}

const routesConfig = JSON.parse(read('src/config/routes-slugs.json'));
const matureIndexableRouteKeys = ['zouk-festivals'];
for (const routeKey of matureIndexableRouteKeys) {
  const route = routesConfig.routes.find((entry) => entry.key === routeKey);
  if (!route) {
    failures.push(`src/config/routes-slugs.json: route ${routeKey} is missing`);
    continue;
  }
  for (const flag of ['noindex', 'excludeFromSitemap', 'excludeFromPrerender']) {
    if (route[flag]) {
      failures.push(`src/config/routes-slugs.json: mature route ${routeKey} must not set ${flag}`);
    }
  }
}

if (failures.length > 0) {
  console.error('\nSEO invariant check failed:\n');
  for (const failure of failures) console.error(`- ${failure}`);
  console.error('\nPrerender runs on localhost, so runtime origins must never define public SEO URLs.\n');
  process.exit(1);
}

console.log('SEO invariant check passed.');
