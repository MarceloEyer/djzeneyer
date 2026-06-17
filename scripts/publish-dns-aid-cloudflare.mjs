#!/usr/bin/env node

const DOMAIN = 'djzeneyer.com';
const TTL = 3600;
const API_BASE = 'https://api.cloudflare.com/client/v4';
const DOH_RESOLVER = 'https://cloudflare-dns.com/dns-query';

const DNS_AID_RECORDS = [
  {
    type: 'SVCB',
    name: `_index._agents.${DOMAIN}`,
    ttl: TTL,
    data: {
      priority: 1,
      target: `${DOMAIN}`,
      value:
        'mandatory=alpn,port alpn="h2" port=443 key65280="/.well-known/ai-plugin.json" key65281="/llms.txt" key65282="/wp-json/djzeneyer/v1/ai-context"',
    },
    comment: `DNS-AID index for ${DOMAIN}. key65280-65282: experimental private-use descriptor locators.`,
  },
];

function getEnv(name, aliases = []) {
  for (const key of [name, ...aliases]) {
    if (process.env[key]) {
      return process.env[key];
    }
  }

  return '';
}

function apiHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

async function cloudflareRequest(path, { method = 'GET', body, token } = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: apiHeaders(token),
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await response.json();

  if (!response.ok || json.success === false) {
    const errors = json.errors?.map((error) => error.message).join('; ') || response.statusText;
    throw new Error(`Cloudflare API ${method} ${path} failed: ${errors}`);
  }

  return json.result;
}

function normalizeRecordData(data = {}) {
  return {
    priority: Number(data.priority),
    target: String(data.target || '').replace(/\.$/, ''),
    value: String(data.value || '').trim().replace(/\s+/g, ' '),
  };
}

function recordNeedsUpdate(existing, desired) {
  const existingData = normalizeRecordData(existing.data);
  const desiredData = normalizeRecordData(desired.data);

  return (
    Number(existing.ttl) !== desired.ttl ||
    existingData.priority !== desiredData.priority ||
    existingData.target !== desiredData.target ||
    existingData.value !== desiredData.value ||
    existing.comment !== desired.comment
  );
}

async function ensureDnssec({ zoneId, token, dryRun }) {
  const dnssec = await cloudflareRequest(`/zones/${zoneId}/dnssec`, { token });

  if (dnssec.status === 'active') {
    console.log('DNSSEC is active for the zone.');
    return;
  }

  if (dryRun) {
    console.log(`DNSSEC status is "${dnssec.status || 'unknown'}"; dry-run will not request activation.`);
    return;
  }

  console.log(`DNSSEC status is "${dnssec.status || 'unknown'}"; requesting activation.`);
  const updated = await cloudflareRequest(`/zones/${zoneId}/dnssec`, {
    method: 'PATCH',
    token,
    body: { status: 'active' },
  });

  console.log(`DNSSEC status after update: ${updated.status || 'unknown'}.`);
  if (updated.status !== 'active') {
    console.log(
      'Registrar DS publication required: go to Cloudflare Dashboard → djzeneyer.com → DNS → DNSSEC ' +
        '→ copy the DS record → paste it at your domain registrar. ' +
        'Validators return AD=true only after the DS record propagates (up to 48h).',
    );
  }
}

async function upsertRecord({ zoneId, token, desired, dryRun }) {
  const params = new URLSearchParams({
    type: desired.type,
    name: desired.name,
    per_page: '100',
  });
  const existingRecords = await cloudflareRequest(`/zones/${zoneId}/dns_records?${params}`, {
    token,
  });
  const existing = existingRecords[0];

  if (!existing) {
    console.log(`Create ${desired.type} ${desired.name}`);
    if (!dryRun) {
      await cloudflareRequest(`/zones/${zoneId}/dns_records`, {
        method: 'POST',
        token,
        body: desired,
      });
    }
    return;
  }

  if (!recordNeedsUpdate(existing, desired)) {
    console.log(`No change ${desired.type} ${desired.name}`);
    return;
  }

  console.log(`Update ${desired.type} ${desired.name}`);
  if (!dryRun) {
    await cloudflareRequest(`/zones/${zoneId}/dns_records/${existing.id}`, {
      method: 'PUT',
      token,
      body: desired,
    });
  }
}

async function queryDoh(record) {
  const params = new URLSearchParams({
    name: record.name,
    type: '64',
    do: '1',
  });
  const response = await fetch(`${DOH_RESOLVER}?${params}`, {
    headers: { accept: 'application/dns-json' },
  });
  const json = await response.json();
  const answer = json.Answer?.find((entry) => entry.type === 64);

  if (!answer) {
    throw new Error(`DoH validation did not find SVCB answer for ${record.name}.`);
  }

  if (!json.AD) {
    throw new Error(`DoH validation found ${record.name}, but AD=false. Check DNSSEC/DS chain.`);
  }

  console.log(`Validated ${record.name}: ${answer.data}`);
}

async function main() {
  const token = getEnv('CLOUDFLARE_API_TOKEN', ['CF_API_TOKEN']);
  const zoneId = getEnv('CLOUDFLARE_ZONE_ID', ['CF_ZONE_ID']);
  const dryRun = process.argv.includes('--dry-run');
  const skipDoh = process.argv.includes('--skip-doh');

  if (!token || !zoneId) {
    throw new Error(
      'Set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ZONE_ID, or aliases CF_API_TOKEN and CF_ZONE_ID.',
    );
  }

  await ensureDnssec({ zoneId, token, dryRun });

  for (const desired of DNS_AID_RECORDS) {
    await upsertRecord({ zoneId, token, desired, dryRun });
  }

  if (!dryRun && !skipDoh) {
    for (const record of DNS_AID_RECORDS) {
      await queryDoh(record);
    }
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
