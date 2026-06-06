#!/usr/bin/env node
/**
 * DNS-AID record verification via DNS-over-HTTPS.
 * No credentials required — queries public resolvers only.
 *
 * Usage:
 *   node scripts/check-dns-aid.mjs
 *   node scripts/check-dns-aid.mjs --verbose
 *
 * Exit codes:
 *   0 — all records found and DNSSEC-validated
 *   1 — one or more records missing or DNSSEC not validated
 */

const DOMAIN = 'djzeneyer.com';
const DOH_RESOLVER = 'https://cloudflare-dns.com/dns-query';
const VERBOSE = process.argv.includes('--verbose');

const DNS_AID_NAMES = [
  `_index._agents.${DOMAIN}`,
];

/**
 * Query a DNS-AID SVCB record through public DNS-over-HTTPS.
 *
 * @param {string} name Fully-qualified DNS name to verify.
 * @returns {Promise<{name: string, found: boolean, dnssec: boolean, rdata: string | null, rcode: number}>}
 */
async function checkRecord(name) {
  const params = new URLSearchParams({ name, type: '64', do: '1' });
  const response = await fetch(`${DOH_RESOLVER}?${params}`, {
    headers: { accept: 'application/dns-json' },
  });

  if (!response.ok) {
    throw new Error(`DoH HTTP ${response.status} for ${name}`);
  }

  const json = await response.json();

  if (VERBOSE) {
    console.log(`[${name}] raw:`, JSON.stringify(json, null, 2));
  }

  const answer = json.Answer?.find((entry) => entry.type === 64);

  return {
    name,
    found: Boolean(answer),
    dnssec: json.AD === true,
    rdata: answer?.data ?? null,
    rcode: json.Status,
  };
}

/**
 * Verify every DNS-AID entrypoint and report missing records or DNSSEC gaps.
 *
 * @returns {Promise<void>}
 */
async function main() {
  let allOk = true;

  for (const name of DNS_AID_NAMES) {
    let result;
    try {
      result = await checkRecord(name);
    } catch (err) {
      console.error(`❌ ${name}: fetch failed — ${err.message}`);
      allOk = false;
      continue;
    }

    if (!result.found) {
      console.error(`❌ ${name}: SVCB record not found (RCODE=${result.rcode})`);
      console.error('   → Export CLOUDFLARE_API_TOKEN and CLOUDFLARE_ZONE_ID first, then run: npm run dns-aid:publish');
      allOk = false;
      continue;
    }

    if (!result.dnssec) {
      console.warn(`⚠️  ${name}: record found but AD=false (DNSSEC not validated)`);
      console.warn(`   → Ensure the DS record is published at your domain registrar.`);
      console.warn(`   → Data: ${result.rdata}`);
      allOk = false;
      continue;
    }

    console.log(`✅ ${name}`);
    if (VERBOSE) console.log(`   Data: ${result.rdata}`);
  }

  if (!allOk) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exitCode = 1;
});
