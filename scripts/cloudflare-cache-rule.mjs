export const CACHE_RULE_DESCRIPTION = 'Zen Eyer public HTML edge cache';

const PRIVATE_PATHS = [
  '/wp-admin',
  '/wp-login.php',
  '/wp-json',
  '/cart',
  '/carrinho',
  '/checkout',
  '/finalizar-compra',
  '/tickets-checkout',
  '/finalizar-ingressos',
  '/dashboard',
  '/painel',
  '/my-account',
  '/minha-conta',
];

const PRIVATE_COOKIES = [
  'wordpress_logged_in_',
  'wordpress_sec_',
  'wp-postpass_',
  'comment_author_',
  'woocommerce_',
  'wp_woocommerce_session_',
];

const pathGuards = PRIVATE_PATHS
  .map((path) => `not starts_with(http.request.uri.path, "${path}")`)
  .join(' and ');

const cookieGuards = PRIVATE_COOKIES
  .map((cookie) => `not http.cookie contains "${cookie}"`)
  .join(' and ');

export const PUBLIC_HTML_CACHE_EXPRESSION = [
  '(http.host eq "djzeneyer.com")',
  '(http.request.method in {"GET" "HEAD"})',
  '(http.request.uri.query eq "")',
  '(not http.request.uri.path contains ".")',
  `(${pathGuards})`,
  `(${cookieGuards})`,
].join(' and ');

export const buildPublicHtmlCacheRule = () => ({
  action: 'set_cache_settings',
  action_parameters: {
    cache: true,
    edge_ttl: {
      mode: 'respect_origin',
    },
    browser_ttl: {
      mode: 'respect_origin',
    },
    cache_key: {
      cache_deception_armor: true,
      ignore_query_strings_order: true,
    },
  },
  expression: PUBLIC_HTML_CACHE_EXPRESSION,
  description: CACHE_RULE_DESCRIPTION,
  enabled: true,
});

export const assertCacheRuleSafety = (rule) => {
  const expression = rule?.expression ?? '';
  const requiredFragments = [
    'http.request.uri.query eq ""',
    'not starts_with(http.request.uri.path, "/wp-json")',
    'not starts_with(http.request.uri.path, "/checkout")',
    'not starts_with(http.request.uri.path, "/my-account")',
    'not http.cookie contains "wordpress_logged_in_"',
    'not http.cookie contains "woocommerce_"',
  ];

  for (const fragment of requiredFragments) {
    if (!expression.includes(fragment)) {
      throw new Error(`Unsafe Cloudflare cache rule: missing ${fragment}`);
    }
  }

  return true;
};
