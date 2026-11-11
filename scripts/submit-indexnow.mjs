#!/usr/bin/env node
/**
 * submit-indexnow.mjs
 *
 * Submits public sitemap URLs through IndexNow after deploy.
 *
 * Required env:
 * - INDEXNOW_KEY: key also deployed as https://djzeneyer.com/<key>.txt
 *
 * Optional env:
 * - INDEXNOW_STRICT=true: exit non-zero if any batch fails
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const KEY = process.env.INDEXNOW_KEY?.trim();
const STRICT = process.env.INDEXNOW_STRICT === 'true';
const HOST = 'djzeneyer.com';
const BASE = `https://${HOST}`;
const KEY_LOCATION = `${BASE}/${KEY}.txt`;

const ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
];

if (!KEY) {
  console.warn('[indexnow] INDEXNOW_KEY env var not set; skipping submission.');
  process.exit(0);
}

if (!/^[A-Za-z0-9_-]{8,128}$/.test(KEY)) {
  console.warn('[indexnow] INDEXNOW_KEY has unusual characters or length; provider verification may fail.');
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Poll the public key file until the same bytes are visible over HTTPS.
 * LiteSpeed/Cloudflare may serve stale content briefly after deploy.
 */
async function waitForKeyFile(maxAttempts = 8, delayMs = 5000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const cacheBustUrl = `${KEY_LOCATION}?indexnow_check=${Date.now()}`;
      const res = await fetch(cacheBustUrl, {
        cache: 'no-store',
        signal: AbortSignal.timeout(8000),
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          'User-Agent': 'djzeneyer-indexnow-verifier/1.0',
        },
      });

      const body = res.ok ? (await res.text()).trim() : '';
      if (res.ok && body === KEY) {
        console.log(`[indexnow] Key file verified at ${KEY_LOCATION} (attempt ${attempt}).`);
        return true;
      }

      console.warn(
        `[indexnow] Key file not ready on attempt ${attempt}/${maxAttempts}: ` +
        `HTTP ${res.status}; body prefix="${body.slice(0, 24)}".`
      );
    } catch (err) {
      console.warn(`[indexnow] Key file fetch error on attempt ${attempt}/${maxAttempts}: ${err.message}`);
    }

    if (attempt < maxAttempts) {
      await sleep(delayMs);
    }
  }

  return false;
}

function parseLocsFromFile(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const xml = fs.readFileSync(filePath, 'utf-8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => match[1].trim())
    .filter((url) => url.startsWith(`${BASE}/`));
}

function getUrlsToSubmit() {
  const sitemapFiles = [
    '../public/sitemap-pages.xml',
    '../public/sitemap-events.xml',
    '../public/sitemap-posts.xml',
  ].map((relativePath) => path.resolve(__dirname, relativePath));

  const sitemapUrls = sitemapFiles.flatMap(parseLocsFromFile);
  const extraUrls = [
    `${BASE}/sitemap.xml`,
    `${BASE}/sitemap-pages.xml`,
    `${BASE}/sitemap-events.xml`,
    `${BASE}/sitemap-posts.xml`,
  ];

  return [...new Set([...sitemapUrls, ...extraUrls])];
}

async function submitToEndpoint(endpoint, urls) {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': 'djzeneyer-indexnow-submit/1.0',
      },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: KEY_LOCATION,
        urlList: urls,
      }),
    });

    let detail = '';
    try {
      detail = await res.text();
    } catch {
      detail = '';
    }

    return {
      endpoint,
      ok: res.status === 200 || res.status === 202,
      status: res.status,
      detail: detail.slice(0, 240),
    };
  } catch (err) {
    return {
      endpoint,
      ok: false,
      status: 0,
      detail: err instanceof Error ? err.message.slice(0, 240) : 'Network request failed',
    };
  }
}

async function submitBatch(urls, batchIndex) {
  const attempts = [];

  for (const endpoint of ENDPOINTS) {
    const result = await submitToEndpoint(endpoint, urls);
    attempts.push(result);

    if (result.ok) {
      console.log(
        `[indexnow] Batch ${batchIndex}: ${urls.length} URLs accepted by ${endpoint} ` +
        `(HTTP ${result.status}).`
      );
      return { ok: true, attempts };
    }

    console.warn(
      `[indexnow] Batch ${batchIndex}: ${endpoint} returned HTTP ${result.status}` +
      (result.detail ? ` - ${result.detail}` : '.')
    );

    if (![0, 403, 408, 429, 500, 502, 503, 504].includes(result.status)) {
      break;
    }
  }

  return { ok: false, attempts };
}

const keyReady = await waitForKeyFile();
if (!keyReady) {
  console.error(`[indexnow] Key file was not publicly verifiable at ${KEY_LOCATION}; skipping submission.`);
  process.exit(STRICT ? 1 : 0);
}

const allUrls = getUrlsToSubmit();
if (allUrls.length === 0) {
  console.warn('[indexnow] No sitemap URLs found to submit.');
  process.exit(0);
}

console.log(`[indexnow] Submitting ${allUrls.length} URLs for ${HOST}.`);

const BATCH_SIZE = 500;
let failedBatches = 0;

for (let i = 0; i < allUrls.length; i += BATCH_SIZE) {
  const batch = allUrls.slice(i, i + BATCH_SIZE);
  const result = await submitBatch(batch, Math.floor(i / BATCH_SIZE) + 1);
  if (!result.ok) failedBatches += 1;
}

if (failedBatches > 0) {
  console.error(`[indexnow] Completed with ${failedBatches} failed batch(es).`);
  process.exit(STRICT ? 1 : 0);
}

console.log('[indexnow] Submission complete: all batches accepted.');
