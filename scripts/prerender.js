// scripts/prerender.js
// v4.0 - FORCE WAIT (Corrige o problema do HTML vazio)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import express from 'express';
import { createServer } from 'http';

// Configurações
const PORT = 4173; // Porta temporária para o render
const BASE_URL = `http://localhost:${PORT}`;
const DIST_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');

// Rotas para pré-renderizar (Baseado no seu Sitemap e Menu)
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
  console.log('🏗️  Iniciando Pré-renderização (Force Wait Mode)...');

  // 1. Iniciar servidor estático temporário para ler a pasta dist
  const app = express();
  app.use(express.static(DIST_PATH));
  // Fallback para SPA (necessário para o router funcionar)
  app.use('*', (req, res) => res.sendFile(path.join(DIST_PATH, 'index.html')));
  
  const server = createServer(app);
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`📡 Servidor de Build rodando em ${BASE_URL}`);

  // 2. Iniciar Puppeteer
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Necessário para rodar no CI/Build
  });
  const page = await browser.newPage();

  // Otimização: Ignora imagens e fontes para carregar mais rápido
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
      req.abort();
    } else {
      req.continue();
    }
  });

  // 3. Loop pelas rotas
  for (const route of ROUTES) {
    try {
      const url = `${BASE_URL}${route}`;
      // console.log(`📸 Renderizando: ${route}...`); // Comentei para limpar o log

      // Aumenta o timeout para garantir
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

      // --- O PULO DO GATO (CORREÇÃO) ---
      // Espera explicitamente pelo conteúdo aparecer!
      // Espera aparecer um H1 OU o texto do footer OU qualquer div com conteúdo
      try {
        await page.waitForSelector('h1, .container, footer', { timeout: 10000 });
      } catch (e) {
        console.warn(`⚠️ Aviso: Timeout esperando seletor em ${route}. O React pode estar lento.`);
      }

      // Pequena pausa extra de segurança para animações terminarem
      await new Promise(r => setTimeout(r, 1000));

      // Pega o HTML final
      const content = await page.content();

      // Verifica se pegou o conteúdo certo (Debug de Segurança)
      if (content.includes('React Development Env')) {
        console.error(`❌ ERRO CRÍTICO em ${route}: Capturei o HTML vazio! O H1 não carregou.`);
      } else {
        console.log(`✅ ${route} renderizado com sucesso (HTML Rico detectado).`);
      }

      // Caminho para salvar
      const routePath = route === '/' ? '/index.html' : `${route}/index.html`;
      const filePath = path.join(DIST_PATH, routePath);

      // Garante que a pasta existe
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Salva o arquivo
      fs.writeFileSync(filePath, content);

    } catch (err) {
      console.error(`❌ Falha ao renderizar ${route}:`, err.message);
    }
  }

  // 4. Limpeza
  await browser.close();
  server.close();
  console.log('🎉 Pré-renderização concluída! Arquivos salvos em /dist');
  process.exit(0);
}

prerender();