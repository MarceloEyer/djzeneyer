import assert from 'node:assert/strict';
import test from 'node:test';
import {
  PUBLIC_HTML_CACHE_EXPRESSION,
  assertCacheRuleSafety,
  buildPublicHtmlCacheRule,
} from './cloudflare-cache-rule.mjs';

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
