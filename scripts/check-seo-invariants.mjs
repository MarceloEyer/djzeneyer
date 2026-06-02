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
    // Check files that import HeadlessSEO for any window.location.origin usage,
    // not just inline inside JSX — variables assigned outside JSX can carry the
    // same localhost-origin bug during prerender.
    if (source.includes('HeadlessSEO') && source.includes('window.location.origin')) {
      failures.push(
        `${path.relative(ROOT, absolutePath)}: window.location.origin used in file with HeadlessSEO; use ARTIST.site.baseUrl or an API canonical URL`
      );
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

if (failures.length > 0) {
  console.error('\nSEO invariant check failed:\n');
  for (const failure of failures) console.error(`- ${failure}`);
  console.error('\nPrerender runs on localhost, so runtime origins must never define public SEO URLs.\n');
  process.exit(1);
}

console.log('SEO invariant check passed.');
