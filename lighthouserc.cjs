const target = process.env.LIGHTHOUSE_TARGET === 'production' ? 'production' : 'local';
const profile = process.env.LIGHTHOUSE_PROFILE === 'mobile' ? 'mobile' : 'desktop';

const isProduction = target === 'production';
const productionBaseUrl = process.env.LIGHTHOUSE_URL || 'https://djzeneyer.com';
const baseUrl = isProduction ? productionBaseUrl : 'http://127.0.0.1:4173';

const urls = [
  '/',
  '/pt/eventos-zouk/',
  '/releases/',
  '/zouk-music/',
  '/shop/',
].map((path) => new URL(path, baseUrl).toString());

const settings = profile === 'desktop'
  ? {
      preset: 'desktop',
      throttlingMethod: 'simulate',
    }
  : {
      formFactor: 'mobile',
      screenEmulation: {
        mobile: true,
        width: 390,
        height: 844,
        deviceScaleFactor: 3,
        disabled: false,
      },
      throttlingMethod: 'simulate',
    };

module.exports = {
  ci: {
    collect: {
      url: urls,
      numberOfRuns: isProduction ? 3 : 2,
      startServerCommand: isProduction ? undefined : 'npm run preview -- --host 127.0.0.1 --port 4173',
      startServerReadyPattern: isProduction ? undefined : 'Local:',
      settings,
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        'categories:performance': ['error', { minScore: profile === 'mobile' ? 0.55 : 0.75 }],
        'categories:accessibility': ['error', { minScore: 0.85 }],
        'categories:best-practices': ['error', { minScore: 0.85 }],
        'categories:seo': ['error', { minScore: 0.8 }],
        'document-title': ['error', { minScore: 1 }],
        'html-has-lang': ['error', { minScore: 1 }],
        'meta-description': ['error', { minScore: 1 }],
        canonical: ['warn', { minScore: 1 }],
        'button-name': ['error', { minScore: 1 }],
        'color-contrast': ['warn', { minScore: 1 }],
        deprecations: ['warn', { minScore: 1 }],
        'errors-in-console': ['error', { minScore: 1 }],
        'image-alt': ['error', { minScore: 1 }],
        'inspector-issues': ['warn', { minScore: 0.9 }],
        'label-content-name-mismatch': ['warn', { minScore: 1 }],
        'link-name': ['error', { minScore: 1 }],
        redirects: ['warn', { minScore: 1 }],
        'uses-responsive-images': ['warn', { minScore: 1 }],
        'bf-cache': ['warn', { minScore: 0.9 }],
        'cls-culprits-insight': ['warn', { minScore: 1 }],
        'document-latency-insight': ['warn', { minScore: 1 }],
        'lcp-discovery-insight': 'off',
        'network-dependency-tree-insight': 'off',
        'render-blocking-insight': 'off',
        'render-blocking-resources': 'off',
        'robots-txt': isProduction ? ['warn', { minScore: 1 }] : 'off',
        'unused-javascript': 'off',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
