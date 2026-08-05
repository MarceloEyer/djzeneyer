import { readFileSync } from 'node:fs';
import {
  assertCacheRuleSafety,
  buildPublicHtmlCacheRule,
} from './cloudflare-cache-rule.mjs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const failures = [];

const cspMatch = html.match(
  /<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]+)"/i,
);

if (!cspMatch) {
  failures.push('index.html must define a Content-Security-Policy meta tag for SSG output');
} else {
  const policy = cspMatch[1];
  for (const directive of [
    "object-src 'none'",
    "base-uri 'self'",
    "connect-src 'self'",
    "frame-src 'self'",
    'upgrade-insecure-requests',
  ]) {
    if (!policy.includes(directive)) failures.push(`SSG CSP missing: ${directive}`);
  }
  if (policy.includes("'unsafe-eval'")) failures.push("SSG CSP must not allow 'unsafe-eval'");
}

try {
  assertCacheRuleSafety(buildPublicHtmlCacheRule());
} catch (error) {
  failures.push(error.message);
}

if (failures.length) {
  for (const failure of failures) console.error(`[security-check] ${failure}`);
  process.exit(1);
}

console.log('[security-check] SSG CSP and Cloudflare cache boundaries are safe.');
