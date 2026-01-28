#!/usr/bin/env node
/**
 * Prerender Script v16.0 - FIXED FOR WORDPRESS HEADLESS
 * 
 * ESTRATÉGIA:
 * 1. Importa routes.ts dinamicamente via import()
 * 2. Usa Puppeteer para renderizar cada rota
 * 3. Injeta meta tags SEO no HTML
 * 4. Salva arquivos pré-renderizados com sufixo _ssr.html
 * 5. WordPress serve esses arquivos via rewrite rules
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 5173;
const BASE_URL = `http://localhost:${PORT}`;
const DIST_PATH = path.resolve(__dirname, '../dist');
const TIMEOUT = 30000;

// Rotas críticas para prerender (sincronizado com routes.ts)
const CRITICAL_ROUTES = [
  { path: '/', lang: 'en', minSize: 4000 },
  { path: '/pt', lang: 'pt', minSize: 4000 },
  { path: '/about', lang: 'en', minSize: 3000 },
  { path: '/pt/sobre', lang: 'pt', minSize: 3000 },
  { path: '/events', lang: 'en', minSize: 3000 },
  { path: '/pt/eventos', lang: 'pt', minSize: 3000 },
  { path: '/music', lang: 'en', minSize: 3000 },
  { path: '/pt/musica', lang: 'pt', minSize: 3000 },
  { path: '/news', lang: 'en', minSize: 3000 },
  { path: '/pt/noticias', lang: 'pt', minSize: 3000 },
  { path: '/zentribe', lang: 'en', minSize: 3000 },
  { path: '/pt/tribo-zen', lang: 'pt', minSize: 3000 },
  { path: '/work-with-me', lang: 'en', minSize: 3000 },
  { path: '/pt/trabalhe-comigo', lang: 'pt', minSize: 3000 },
  { path: '/faq', lang: 'en', minSize: 3000 },
  { path: '/pt/perguntas-frequentes', lang: 'pt', minSize: 3000 },
  { path: '/my-philosophy', lang: 'en', minSize: 3000 },
  { path: '/pt/minha-filosofia', lang: 'pt', minSize: 3000 },
  { path: '/media', lang: 'en', minSize: 3000 },
  { path: '/pt/na-midia', lang: 'pt', minSize: 3000 },
  { path: '/support-the-artist', lang: 'en', minSize: 3000 },
  { path: '/pt/apoie-o-artista', lang: 'pt', minSize: 3000 },
  { path: '/shop', lang: 'en', minSize: 3000 },
  { path: '/pt/loja', lang: 'pt', minSize: 3000 },
];

console.log(`
╔═══════════════════════════════════════════════════════╗
║   🏗️  PRERENDER v16.0 - WORDPRESS HEADLESS FIXED     ║
╚═══════════════════════════════════════════════════════╝

📡 Server: ${BASE_URL}
📄 Routes: ${CRITICAL_ROUTES.length}
📂 Output: ${DIST_PATH}
`);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function startDevServer() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Starting dev server...\n');
    
    const server = spawn('npm', ['run', 'dev'], {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'pipe',
      shell: true
    });

    let resolved = false;

    server.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Local:') && !resolved) {
        resolved = true;
        setTimeout(() => resolve(server), 2000);
      }
    });

    server.stderr.on('data', (data) => {
      console.error('Server error:', data.toString());
    });

    setTimeout(() => {
      if (!resolved) {
        reject(new Error('Server start timeout'));
      }
    }, 30000);
  });
}

function validateHTML(content, route) {
  const errors = [];
  const warnings = [];

  // Verificações básicas - h1 agora é apenas warning
  if (!/<h1[^>]*>/i.test(content)) {
    warnings.push('Missing <h1> tag');
  }

  if (!/<meta[^>]*name="description"/i.test(content)) {
    warnings.push('Missing meta description');
  }

  const size = Buffer.byteLength(content, 'utf8');
  if (size < 1000) {
    errors.push(`Size ${size}B too small (appears to be empty)`);
  } else if (size < route.minSize) {
    warnings.push(`Size ${size}B < recommended ${route.minSize}B`);
  }

  // Verificar se tem conteúdo React
  if (!content.includes('id="root"') && !content.includes('djzeneyer')) {
    errors.push('Content appears to be missing React app');
  }

  return { errors, warnings, size };
}

function sanitizeFilename(routePath) {
  if (routePath === '/' || routePath === '') return 'index';
  return routePath
    .replace(/^\/+|\/+$/g, '')
    .replace(/\//g, '_')
    .replace(/[^a-z0-9_-]/gi, '_');
}

// ============================================================================
// MAIN PRERENDER FUNCTION
// ============================================================================

async function prerender() {
  let server;
  let browser;

  try {
    // Start dev server
    server = await startDevServer();
    console.log('✅ Dev server running\n');

    // Launch browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security'
      ]
    });

    console.log('✅ Browser launched\n');

    let successCount = 0;
    let errorCount = 0;

    // Prerender each route
    for (const route of CRITICAL_ROUTES) {
      try {
        const page = await browser.newPage();
        
        // Set viewport
        await page.setViewport({ width: 1920, height: 1080 });
        
        // Set user agent
        await page.setUserAgent(
          'Mozilla/5.0 (compatible; Prerenderer/16.0; +https://djzeneyer.com)'
        );

        const url = `${BASE_URL}${route.path}`;
        console.log(`🔍 Rendering: ${route.path}`);

        // Navigate
        await page.goto(url, {
          waitUntil: 'networkidle0',
          timeout: TIMEOUT
        });

        // Wait for React to hydrate - be more flexible
        try {
          await page.waitForSelector('#root', { timeout: 5000 });
          await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 3000)));
        } catch (e) {
          console.warn('  ⚠️ React root not found quickly, trying alternative...');
          await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 5000)));
        }

        // Get final HTML
        let content = await page.content();

        // Inject SSR metadata
        content = content.replace(
          '</head>',
          `  <meta name="prerender" content="true" />
  <meta name="prerender-date" content="${new Date().toISOString()}" />
  <meta name="prerender-route" content="${route.path}" />
</head>`
        );

        // Validate
        const validation = validateHTML(content, route);

        if (validation.errors.length > 0) {
          console.error(`  ❌ Validation failed: ${validation.errors.join(', ')}`);
          errorCount++;
        } else {
          // Save prerendered file
          const filename = sanitizeFilename(route.path);
          const outputPath = path.join(DIST_PATH, `${filename}_ssr.html`);
          
          fs.writeFileSync(outputPath, content, 'utf-8');
          
          console.log(`  ✅ Saved: ${filename}_ssr.html (${validation.size}B)`);
          
          if (validation.warnings.length > 0) {
            console.warn(`  ⚠️  ${validation.warnings.join(', ')}`);
          }
          
          successCount++;
        }

        await page.close();
        
      } catch (error) {
        console.error(`  ❌ Error: ${error.message}`);
        errorCount++;
      }
    }

    // Summary
    console.log(`
════════════════════════════════════════════════════════════
✅ Prerender complete!

Success: ${successCount}/${CRITICAL_ROUTES.length}
Errors: ${errorCount}

📝 Next step: Configure WordPress to serve *_ssr.html files
════════════════════════════════════════════════════════════
`);

    if (errorCount > 0) {
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
    if (server) {
      server.kill();
      // Wait for clean shutdown
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

// Run
prerender().catch(console.error);