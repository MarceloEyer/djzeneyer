#!/usr/bin/env node
/**
 * submit-indexnow.mjs
 * Submits URLs to IndexNow protocol after each deploy.
 * Called via: npm run indexnow
 * Requires env: INDEXNOW_KEY, SITE_BASE_URL (optional)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const KEY  = process.env.INDEXNOW_KEY;
const HOST = 'djzeneyer.com';
const BASE = `https://${HOST}`;

if (!KEY) {
  console.error('❌  INDEXNOW_KEY env var not set — skipping submission.');
  process.exit(0); // soft exit so CI doesn't fail
}

// ── Key-file readiness check ──────────────────────────────────────────────────

/**
 * Polls https://<host>/<key>.txt until it responds 200 with the correct key
 * content, or until MAX_ATTEMPTS is reached.
 * Needed because LiteSpeed may serve a cached 404 for a few seconds after
 * a newly-deployed file lands on the server.
 */
async function waitForKeyFile(maxAttempts = 6, delayMs = 5000) {
  const url = `${BASE}/${KEY}.txt`;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const body = (await res.text()).trim();
        if (body === KEY) {
          console.log(`✅ Key file verified at ${url} (attempt ${attempt})`);
          return true;
        }
        console.warn(`⚠️  Key file content mismatch on attempt ${attempt} — got: "${body.slice(0, 40)}"`);
      } else {
        console.warn(`⚠️  Key file not ready (HTTP ${res.status}) — attempt ${attempt}/${maxAttempts}`);
      }
    } catch (err) {
      console.warn(`⚠️  Key file fetch error on attempt ${attempt}: ${err.message}`);
    }
    if (attempt < maxAttempts) {
      console.log(`   Retrying in ${delayMs / 1000}s…`);
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
  return false;
}

console.log(`\n🔑 Verifying key file at https://${HOST}/${KEY}.txt…`);
const keyReady = await waitForKeyFile();
if (!keyReady) {
  console.error(`❌ Key file not accessible after all attempts — skipping submission to avoid wasted 403s.`);
  process.exit(0); // soft exit: don't fail the deploy, but don't submit either
}

// ── Collect URLs ─────────────────────────────────────────────────────────────

/**
 * Parse a sitemap XML file and return all <loc> URLs.
 * Works for both urlset (regular sitemap) and sitemapindex.
 */
function parseLocsFromFile(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const xml = fs.readFileSync(filePath, 'utf-8');
  const matches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)];
  return matches.map(m => m[1].trim()).filter(Boolean);
}

// Read pages sitemap (static routes in both EN + PT)
const pagesFile  = path.resolve(__dirname, '../public/sitemap-pages.xml');
const eventsFile = path.resolve(__dirname, '../public/sitemap-events.xml');

const pageUrls  = parseLocsFromFile(pagesFile);
const eventUrls = parseLocsFromFile(eventsFile);

// Always include the sitemap index itself
const extraUrls = [
  `${BASE}/sitemap.xml`,
  `${BASE}/sitemap-pages.xml`,
  `${BASE}/sitemap-events.xml`,
];

// Deduplicate
const allUrls = [...new Set([...pageUrls, ...eventUrls, ...extraUrls])];

if (allUrls.length === 0) {
  console.warn('⚠️  No URLs found to submit — sitemap files might be missing.');
  process.exit(0);
}

console.log(`\n📡 IndexNow — submitting ${allUrls.length} URLs to api.indexnow.org...`);

// ── Submit ────────────────────────────────────────────────────────────────────

// IndexNow accepts up to 10 000 URLs per request but recommends batches ≤ 10 000.
// We'll batch in 500 to stay safe.
const BATCH_SIZE = 500;

async function submitBatch(urls, batchIndex) {
  const body = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `${BASE}/${KEY}.txt`,
    urlList: urls,
  });

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body,
  });

  const status = res.status;
  let detail = '';
  try { detail = await res.text(); } catch (_) {}

  if (status === 200) {
    console.log(`  ✅ Batch ${batchIndex}: ${urls.length} URLs accepted (200 OK)`);
  } else if (status === 202) {
    console.log(`  ✅ Batch ${batchIndex}: ${urls.length} URLs received, crawl pending (202 Accepted)`);
  } else if (status === 400) {
    console.warn(`  ⚠️  Batch ${batchIndex}: Bad request (400) — ${detail.slice(0, 120)}`);
  } else if (status === 403) {
    console.error(`  ❌ Batch ${batchIndex}: Forbidden (403) — key file not found or key mismatch. Check https://${HOST}/${KEY}.txt`);
  } else if (status === 422) {
    console.warn(`  ⚠️  Batch ${batchIndex}: Unprocessable (422) — URLs may contain invalid characters.`);
  } else if (status === 429) {
    console.warn(`  ⚠️  Batch ${batchIndex}: Rate limited (429) — too many requests today.`);
  } else {
    console.warn(`  ⚠️  Batch ${batchIndex}: Unexpected status ${status} — ${detail.slice(0, 120)}`);
  }
}

(async () => {
  let batchIndex = 1;
  for (let i = 0; i < allUrls.length; i += BATCH_SIZE) {
    const batch = allUrls.slice(i, i + BATCH_SIZE);
    await submitBatch(batch, batchIndex++);
  }
  console.log('\n════════════════════════════════════════');
  console.log('✅ IndexNow submission complete!');
  console.log('════════════════════════════════════════\n');
})();
