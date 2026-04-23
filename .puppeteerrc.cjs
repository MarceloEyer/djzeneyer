/**
 * @type {import("puppeteer").Configuration}
 *
 * skipDownload: true — impede que `npm install` baixe o Chromium (~120MB).
 *
 * Por quê:
 *  - Bolt.new (WebContainer) não consegue executar binários nativos como Chromium.
 *  - Dev local não precisa do Chromium — prerender é responsabilidade do CI.
 *  - No GitHub Actions, o Chrome é instalado explicitamente no passo de prerender
 *    via `npx puppeteer browsers install chrome`.
 *
 * Resultado: `npm install` e `npm ci` ficam rápidos e leves em todos os ambientes.
 */
module.exports = {
  skipDownload: true,
};
