import { pathToFileURL } from 'node:url';
import {
  CACHE_RULE_DESCRIPTION,
  assertCacheRuleSafety,
  buildPublicHtmlCacheRule,
} from './cloudflare-cache-rule.mjs';

const API_BASE = 'https://api.cloudflare.com/client/v4';
const PHASE = 'http_request_cache_settings';

const parseMode = (args) => {
  if (args.includes('--apply')) return 'apply';
  if (args.includes('--check')) return 'check';
  return 'dry-run';
};

const cloudflareRequest = async (path, token, init = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.success === false) {
    const details = payload.errors?.map((error) => error.message).join('; ') || response.statusText;
    const error = new Error(`Cloudflare API ${response.status}: ${details}`);
    error.status = response.status;
    throw error;
  }
  return payload.result;
};

export const configureCloudflareCache = async ({
  mode,
  zoneId,
  token,
  log = console.log,
}) => {
  const rule = buildPublicHtmlCacheRule();
  assertCacheRuleSafety(rule);

  if (mode === 'dry-run') {
    log(JSON.stringify(rule, null, 2));
    return { status: 'dry-run', rule };
  }

  if (!zoneId || !token) {
    throw new Error('CLOUDFLARE_ZONE_ID and CLOUDFLARE_API_TOKEN are required');
  }

  let entrypoint;
  try {
    entrypoint = await cloudflareRequest(
      `/zones/${zoneId}/rulesets/phases/${PHASE}/entrypoint`,
      token,
    );
  } catch (error) {
    if (error.status !== 404 || mode === 'check') throw error;
  }

  const existingRule = entrypoint?.rules?.find(
    (candidate) => candidate.description === CACHE_RULE_DESCRIPTION,
  );

  if (mode === 'check') {
    if (!existingRule) throw new Error('Managed public HTML cache rule is not installed');
    assertCacheRuleSafety(existingRule);
    log(`Cloudflare cache rule verified: ${existingRule.id}`);
    return { status: 'verified', rule: existingRule };
  }

  if (!entrypoint) {
    const created = await cloudflareRequest(`/zones/${zoneId}/rulesets`, token, {
      method: 'POST',
      body: JSON.stringify({
        name: 'Zen Eyer cache rules',
        description: 'Project-managed Cloudflare cache rules',
        kind: 'zone',
        phase: PHASE,
        rules: [rule],
      }),
    });
    log(`Cloudflare cache ruleset created: ${created.id}`);
    return { status: 'created', rule: created.rules?.[0] };
  }

  if (existingRule) {
    const updated = await cloudflareRequest(
      `/zones/${zoneId}/rulesets/${entrypoint.id}/rules/${existingRule.id}`,
      token,
      { method: 'PATCH', body: JSON.stringify(rule) },
    );
    log(`Cloudflare cache rule updated: ${updated.id}`);
    return { status: 'updated', rule: updated };
  }

  const created = await cloudflareRequest(
    `/zones/${zoneId}/rulesets/${entrypoint.id}/rules`,
    token,
    { method: 'POST', body: JSON.stringify(rule) },
  );
  log(`Cloudflare cache rule created: ${created.id}`);
  return { status: 'created', rule: created };
};

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const mode = parseMode(process.argv.slice(2));
  configureCloudflareCache({
    mode,
    zoneId: process.env.CLOUDFLARE_ZONE_ID,
    token: process.env.CLOUDFLARE_API_TOKEN,
  }).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
