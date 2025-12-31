// scripts/prerender.js
// v5.0 - PATH FIX (Corrige o erro 404 dos scripts no build)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import express from 'express';
import { createServer } from 'http';

// Configurações
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;
const DIST_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');

// O caminho exato onde o WP procura os assets (conforme visto no seu HTML)
const PUBLIC_PATH = '/wp-content/themes/zentheme/dist';

// Rotas para pré-renderizar
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
  console.log('🏗️  Iniciando Pré-renderização (Path Fix Mode)...');

  const app = express();

  // --- CORREÇÃO CRÍTICA AQUI ---
  // Ensina o servidor a entregar os arquivos quando o navegador pedir o caminho longo do WP
  app.use(PUBLIC_PATH, express.static(DIST_PATH));
  
  // Também serve na raiz por garantia (para favicon, etc)
  app.use(express.static(DIST_PATH));

  // Fallback para SPA (qualquer outra rota serve o index.html)
  app.use('*', (req, res) => res.sendFile(path.join(DIST_PATH, 'index.html')));
  
  const server = createServer(app);
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`📡 Servidor de Build rodando em ${BASE_URL}`);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  // Otimização: Ignora recursos pesados desnecessários para o SEO
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const resourceType = req.resourceType();
    if (resourceType === 'image' || resourceType === 'font') {
      req.abort();
    } else {
      req.continue();
    }
  });

  for (const route of ROUTES) {
    try {
      const url = `${BASE_URL}${route}`;
      // console.log(`📸 Processando: ${route}`);

      // Navega e espera a rede ficar ociosa
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

      // Espera o conteúdo REAL aparecer (H1 ou Footer)
      try {
        await page.waitForSelector('h1, footer', { timeout: 15000 });
      } catch (e) {
        console.warn(`⚠️ Timeout esperando seletor em ${route}. O React pode ter falhado se os scripts não carregaram.`);
      }

      const content = await page.content();

      // Verificação de Segurança
      if (content.includes('React Development Env') && !content.includes('footer')) {
        console.error(`❌ ERRO: ${route} gerou HTML vazio. Verifique os caminhos dos assets!`);
      } else {
        console.log(`✅ ${route} renderizado com sucesso!`);
      }

      const routePath = route === '/' ? '/index.html' : `${route}/index.html`;
      const filePath = path.join(DIST_PATH, routePath);
      const dir = path.dirname(filePath);
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(filePath, content);

    } catch (err) {
      console.error(`❌ Falha em ${route}:`, err.message);
    }
  }

  await browser.close();
  server.close();
  console.log('🎉 Pré-renderização concluída.');
  process.exit(0);
}

prerender();