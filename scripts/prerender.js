/**
 * Pre-render Script - Static Site Generation
 * Generates static HTML for React routes using Puppeteer
 *
 * @version 2.0.0 - Puppeteer Migration (Security Fix)
 */

import { createServer } from 'http';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const DIST_PATH = join(__dirname, '../dist');
const PORT = 3333;
const BASE_URL = `http://localhost:${PORT}`;

// Routes to pre-render (EN + PT)
const ROUTES = [
  // English routes
  '/',
  '/about',
  '/events',
  '/music',
  '/news',
  '/tribe',
  '/work-with-me',
  '/shop',
  '/dashboard',
  '/my-account',
  '/faq',
  '/my-philosophy',

  // Portuguese routes
  '/pt',
  '/pt/sobre',
  '/pt/eventos',
  '/pt/musica',
  '/pt/noticias',
  '/pt/tribo',
  '/pt/contrate',
  '/pt/loja',
  '/pt/painel',
  '/pt/minha-conta',
  '/pt/faq',
  '/pt/minha-filosofia',
];

/**
 * Simple HTTP server to serve dist folder
 */
function createStaticServer() {
  const indexHtml = readFileSync(join(DIST_PATH, 'index.html'), 'utf-8');

  return createServer((req, res) => {
    let filePath = join(DIST_PATH, req.url === '/' ? 'index.html' : req.url);

    // Serve static files (CSS, JS, images)
    if (existsSync(filePath) && !filePath.endsWith('/')) {
      const content = readFileSync(filePath);

      // Set correct Content-Type
      let contentType = 'text/html';
      if (filePath.endsWith('.js')) contentType = 'application/javascript';
      else if (filePath.endsWith('.css')) contentType = 'text/css';
      else if (filePath.endsWith('.json')) contentType = 'application/json';
      else if (filePath.endsWith('.png')) contentType = 'image/png';
      else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) contentType = 'image/jpeg';
      else if (filePath.endsWith('.svg')) contentType = 'image/svg+xml';
      else if (filePath.endsWith('.webp')) contentType = 'image/webp';

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    } else {
      // SPA fallback - serve index.html for all routes
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(indexHtml);
    }
  });
}

/**
 * Pre-render a single route
 */
async function prerenderRoute(browser, route) {
  const page = await browser.newPage();

  try {
    console.log(`  → Rendering: ${route}`);

    // Navigate to route
    await page.goto(`${BASE_URL}${route}`, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // Wait for React to hydrate
    await page.waitForSelector('#root', { timeout: 5000 });

    // Get rendered HTML
    const html = await page.content();

    // Save to file
    const outputPath = route === '/'
      ? join(DIST_PATH, 'index.html')
      : join(DIST_PATH, route, 'index.html');

    const outputDir = dirname(outputPath);
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    writeFileSync(outputPath, html, 'utf-8');
    console.log(`  ✓ Saved: ${outputPath}`);

  } catch (error) {
    console.warn(`  ⚠ Failed to render ${route}: ${error.message}`);
  } finally {
    await page.close();
  }
}

/**
 * Main pre-render function
 */
async function prerender() {
  console.log('\n🚀 Starting Static Site Generation...\n');

  // Check if dist folder exists
  if (!existsSync(DIST_PATH)) {
    console.error('❌ Error: dist/ folder not found. Run `npm run build` first.');
    process.exit(1);
  }

  let server = null;
  let browser = null;

  try {
    // Start static server
    server = createStaticServer();
    await new Promise((resolve) => {
      server.listen(PORT, () => {
        console.log(`📡 Server running at ${BASE_URL}\n`);
        resolve();
      });
    });

    // Launch Puppeteer
    // CRITICAL: Use --no-sandbox for Linux/GitHub Actions compatibility
    const puppeteer = await import('puppeteer');

    browser = await puppeteer.default.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ],
    });

    console.log('🎭 Puppeteer initialized\n');

    // Pre-render all routes
    for (const route of ROUTES) {
      await prerenderRoute(browser, route);
    }

    console.log('\n✅ Pre-rendering completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Pre-rendering failed:', error.message);

    // CRITICAL: Don't fail the build in Bolt/preview environments
    if (error.message.includes('Failed to launch') ||
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('Could not find')) {
      console.warn('\n⚠️  Skipping prerender in this environment (Bolt/Sandbox detected)');
      console.log('    Static HTML generation will be skipped, but build continues.\n');
      process.exit(0); // Exit gracefully
    }

    // For real errors, exit with error code
    process.exit(1);

  } finally {
    // Cleanup
    if (browser) {
      await browser.close();
      console.log('🎭 Puppeteer closed');
    }
    if (server) {
      server.close();
      console.log('📡 Server stopped\n');
    }
  }
}

// Run
prerender();
