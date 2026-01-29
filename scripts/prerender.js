#!/usr/bin/env node
/**
 * SSR PRERENDER v18.7 - SHELL ONLY (Offline Safe)
 * * OBJETIVO: Gerar a estrutura de arquivos (index.html em cada pasta)
 * sem depender de chamadas de API externas.
 * * Lógica:
 * 1. Carrega a página.
 * 2. Espera o React montar (#root).
 * 3. Salva imediatamente (App Shell), confiando que o cliente buscará os dados.
 */

import { spawn } from 'child_process';
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// =============================
// 1. CARREGAR ROTAS (SSOT)
// =============================
let routesList = [];
const ROUTES_CONFIG_PATH = join(__dirname, 'routes-config.json');

try {
    if (!existsSync(ROUTES_CONFIG_PATH)) {
        // Fallback de segurança caso o JSON não exista
        console.warn('⚠️ JSON de rotas não encontrado. Usando lista mínima.');
        routesList = ['/', '/about', '/shop'];
    } else {
        const routesConfig = JSON.parse(readFileSync(ROUTES_CONFIG_PATH, 'utf8'));
        routesList = routesConfig.routes;
        console.log(`📋 SSOT: ${routesList.length} rotas carregadas para geração de estrutura.`);
    }
} catch (e) {
    console.error('❌ Erro ao ler rotas. Continuando com home apenas.');
    routesList = ['/'];
}

// =============================
// CONFIGURAÇÃO
// =============================
const CONFIG = {
  serverBase: 'http://localhost:5173',
  entryPoint: 'http://localhost:5173',
  distDir: join(process.cwd(), 'dist'),
  timeout: 60000, 
  // Espera apenas o container principal, não o conteúdo da API
  waitForSelector: '#root', 
  routes: routesList
};

console.log('╔═══════════════════════════════════════════════════════╗');
console.log('║   🏗️  PRERENDER v18.7 - SHELL ONLY (Offline Safe)     ║');
console.log('╚═══════════════════════════════════════════════════════╝');

const wait = (ms) => new Promise(r => setTimeout(r, ms));

async function checkConnection(url, timeout) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 404) return true;
    } catch (e) {}
    await wait(1000);
    process.stdout.write('.');
  }
  return false;
}

let viteProcess = null;

function startDevServer() {
  return new Promise(async (resolve, reject) => {
    console.log('🚀 Iniciando servidor Vite (Preview)...');
    
    // Herda stdio para debug se necessário
    viteProcess = spawn('npx', ['vite', 'preview', '--port', '5173', '--host'], {
      cwd: process.cwd(),
      stdio: 'inherit',
      env: { ...process.env, FORCE_COLOR: '1' }
    });

    viteProcess.on('error', (err) => reject(err));
    
    console.log(`⏳ Aguardando servidor...`);
    const isReady = await checkConnection(CONFIG.serverBase, 60000);

    if (isReady) {
      console.log('\n✅ Servidor Online.');
      resolve();
    } else {
      stopDevServer();
      reject(new Error(`Timeout ao conectar no Vite.`));
    }
  });
}

function stopDevServer() {
  if (viteProcess) {
    console.log('🛑 Parando servidor...');
    viteProcess.kill();
    viteProcess = null;
  }
}

async function prerender() {
  let browser = null;
  
  try {
    await startDevServer();
    
    browser = await puppeteer.launch({
      headless: 'shell',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    });

    const page = await browser.newPage();
    // User Agent genérico para não bloquear nada
    await page.setUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)');

    let successCount = 0;

    for (const route of CONFIG.routes) {
      const routePath = route.startsWith('/') ? route : `/${route}`;
      const url = `${CONFIG.entryPoint}${routePath}`;
      
      // Definição de Caminhos
      let outputPath;
      if (route === '/' || route === '') {
        outputPath = join(CONFIG.distDir, 'index.html');
      } else {
        const folderName = routePath.slice(1);
        const targetDir = join(CONFIG.distDir, folderName);
        if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true });
        outputPath = join(targetDir, 'index.html');
      }

      try {
        // Navegação rápida: domcontentloaded é suficiente para o Shell
        await page.goto(url, { 
          waitUntil: 'domcontentloaded', 
          timeout: 30000 
        });

        // Espera mínima para o React montar o básico (Header/Footer)
        try {
            await page.waitForSelector('#root', { timeout: 5000 });
            await wait(1000); // Pequena pausa para injeção de CSS/JS
        } catch (e) {
            // Se falhar, salva assim mesmo (melhor um HTML vazio que 404)
        }

        const html = await page.content();
        
        // Injeta meta tag para confirmar prerender
        const finalHtml = html.replace('<head>', `<head>\n  <meta name="prerender-generated" content="true">`);
        
        writeFileSync(outputPath, finalHtml, 'utf8');
        
        // Log simplificado
        console.log(`✅ Gerado: ${route} (${finalHtml.length} bytes)`);
        successCount++;

      } catch (error) {
        console.error(`❌ Erro em ${route}: ${error.message}`);
        // Não falha o build, apenas loga o erro
      }
    }

    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log(`║  ✅ CONCLUSÃO: ${successCount}/${CONFIG.routes.length} arquivos gerados.`);
    console.log('╚═══════════════════════════════════════════════════════╝\n');

  } catch (error) {
    console.error('\n❌ ERRO FATAL:', error);
    process.exit(1);
  } finally {
    if (browser) try { await browser.close(); } catch(e) {}
    stopDevServer();
    process.exit(0);
  }
}

process.on('SIGINT', () => { stopDevServer(); process.exit(0); });
process.on('SIGTERM', () => { stopDevServer(); process.exit(0); });

prerender();