import { createHash } from 'node:crypto';

export const CSP_SCRIPT_HASH_PLACEHOLDER = "'sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='";

export function applyPrerenderScriptHashes(html, route = 'unknown route') {
  const hashes = new Set();
  const scriptPattern = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
  for (const match of html.matchAll(scriptPattern)) {
    const attributes = match[1];
    const body = match[2];
    if (/\bsrc\s*=/i.test(attributes) || body.length === 0) continue;
    const digest = createHash('sha256').update(body, 'utf8').digest('base64');
    hashes.add(`'sha256-${digest}'`);
  }

  if (hashes.size === 0) {
    throw new Error(`No inline scripts found to hash for ${route}`);
  }

  const scriptDirective = /(content="[^"]*?script-src\s+)([^;]+)/i;
  const directiveMatch = html.match(scriptDirective);
  if (!directiveMatch) throw new Error(`CSP script-src missing for ${route}`);

  const currentSources = directiveMatch[2];
  const existingHashes = /'sha256-[A-Za-z0-9+/]{43}='/g;
  if (!currentSources.includes(CSP_SCRIPT_HASH_PLACEHOLDER) && !existingHashes.test(currentSources)) {
    throw new Error(`CSP script hash slot missing for ${route}`);
  }

  const nextSources = currentSources
    .replaceAll(CSP_SCRIPT_HASH_PLACEHOLDER, '')
    .replace(existingHashes, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace("'self'", `'self' ${[...hashes].join(' ')}`);

  return html.replace(scriptDirective, `$1${nextSources}`);
}
