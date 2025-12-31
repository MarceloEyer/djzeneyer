// scripts/prerender.js
// v6.0 - REAL DATA INJECTION (Conecta na API Real durante o build)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import express from 'express';
import { createServer } from 'http';

// Configurações
const PORT = 5173; // Porta padrão do Vite (ajuda no CORS)
const BASE_URL = `http://localhost:${PORT}`;
const DIST_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');

// Caminho dos assets do WP
const PUBLIC_PATH = '/wp-content/themes/zentheme/dist';

const ROUTES = [
  '/', 
  '/events', 
  '/music', 
  '/about', 
  '/zentribe', 
  '/shop', 
  '/work-with-me',
  '/media',
  '/faq',
  '/conduct',
  '/privacy-policy',
  '/terms'
];

async function prerender() {
  console.log('🏗️  Iniciando Pré-renderização (Real Data Mode)...');

  const app = express();
  // Serve os assets tanto no caminho WP quanto na raiz
  app.use(PUBLIC_PATH, express.static(DIST_PATH));
  app.use(express.static(DIST_PATH));
  app.use('*', (req, res) => res.sendFile(path.join(DIST_PATH, 'index.html')));
  
  const server = createServer(app);
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`📡 Servidor rodando em ${BASE_URL}`);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  // --- O PULO DO GATO ---
  // Injeta a configuração apontando para o SITE REAL.
  // Isso permite que o build busque os eventos de verdade no banco de dados.
  await page.evaluateOnNewDocument(() => {
    window.wpData = {
      siteUrl: 'https://djzeneyer.com',
      restUrl: 'https://djzeneyer.com/wp-json/',
      themeUrl: 'https://djzeneyer.com/wp-content/themes/zentheme',
      nonce: '', // APIs públicas (GET) geralmente não exigem nonce
      isUserLoggedIn: false
    };
  });

  // Mostra erros do console do navegador no terminal (DEBUG)
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error') console.log(`[Browser Error] ${msg.text()}`);
  });
  
  page.on('pageerror', err => {
    console.log(`[Page Crash] ${err.toString()}`);
  });

  // Otimização de rede
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const type = req.resourceType();
    if (type === 'image' || type === 'font' || type === 'media') {
      req.abort();
    } else {
      req.continue();
    }
  });

  for (const route of ROUTES) {
    try {
      const url = `${BASE_URL}${route}`;
      // Aumentei o timeout para 60s caso a API demore
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

      // Espera o conteúdo REAL aparecer
      try {
        await page.waitForSelector('h1', { timeout: 15000 });
      } catch (e) {
        console.warn(`⚠️ Timeout esperando H1 em ${route}.`);
      }

      const content = await page.content();

      // Validação final
      if (content.includes('React Development Env') && !content.includes('footer')) {
        console.error(`❌ FALHA: ${route} ficou vazio! Verifique os logs de [Browser Error] acima.`);
      } else {
        console.log(`✅ ${route} gerado com sucesso!`);
      }

      const routePath = route === '/' ? '/index.html' : `${route}/index.html`;
      const filePath = path.join(DIST_PATH, routePath);
      const dir = path.dirname(filePath);
      
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, content);

    } catch (err) {
      console.error(`❌ Erro fatal em ${route}:`, err.message);
    }
  }

  await browser.close();
  server.close();
  console.log('🎉 Fim do processo.');
  process.exit(0);
}

prerender();