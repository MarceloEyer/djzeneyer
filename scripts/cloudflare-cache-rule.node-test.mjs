import assert from 'node:assert/strict';
import test from 'node:test';
import {
  PUBLIC_HTML_CACHE_EXPRESSION,
  assertCacheRuleSafety,
  buildPublicHtmlCacheRule,
} from './cloudflare-cache-rule.mjs';
import { applyPrerenderScriptHashes } from './csp-hashes.mjs';

test('public HTML cache rule preserves private and personalized boundaries', () => {
  assertCacheRuleSafety(buildPublicHtmlCacheRule());
  for (const value of [
    '/wp-json',
    '/wp-admin',
    '/checkout',
    '/finalizar-compra',
    '/my-account',
    '/minha-conta',
    'wordpress_logged_in_',
    'woocommerce_',
    'wp_woocommerce_session_',
  ]) {
    assert.match(PUBLIC_HTML_CACHE_EXPRESSION, new RegExp(value.replaceAll('/', '\\/')));
  }
});

test('cache rule respects origin TTL and enables cache deception armor', () => {
  const rule = buildPublicHtmlCacheRule();
  assert.equal(rule.action_parameters.edge_ttl.mode, 'respect_origin');
  assert.equal(rule.action_parameters.cache_key.cache_deception_armor, true);
});

test('prerender replaces the CSP placeholder with hashes for every inline script', () => {
  const html = '<meta http-equiv="Content-Security-Policy" content="script-src \'self\' \'sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=\'"><script>window.a=1;</script><script type="application/ld+json">{"name":"Zen Eyer"}</script><script src="/assets/app.js"></script>';
  const result = applyPrerenderScriptHashes(html, '/test');

  assert.doesNotMatch(result, /sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=|'unsafe-inline'/);
  assert.equal((result.match(/'sha256-[A-Za-z0-9+/=]+'/g) ?? []).length, 2);
});

test('prerender fails closed when the CSP placeholder is absent', () => {
  assert.throws(
    () => applyPrerenderScriptHashes('<script>window.a=1;</script>', '/test'),
    /script-src missing/,
  );
});
