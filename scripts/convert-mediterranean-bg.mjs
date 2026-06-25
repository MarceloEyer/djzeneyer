/**
 * Converts zen_na_europa.png to proper WebP assets for the Mediterranean hero.
 * Outputs:
 *   - hero-background-mediterranean-1440.webp  (1440px wide, ~0.85 quality)
 *   - hero-background-mediterranean.webp        (1672px wide = source native, ~0.85 quality)
 *
 * Requires: puppeteer (already in devDependencies)
 * Run: node scripts/convert-mediterranean-bg.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('../node_modules/puppeteer');

const __dirname = dirname(fileURLToPath(import.meta.url));
const imagesDir = join(__dirname, '..', 'public', 'images');

const SOURCE = join(imagesDir, 'zen_na_europa.png');

const OUTPUTS = [
  { file: 'hero-background-mediterranean-1440.webp', width: 1440 },
  { file: 'hero-background-mediterranean.webp', width: 1672 },
];

const QUALITY = 85;

async function convertToWebP(sourceFile, width, quality) {
  const sourceBytes = readFileSync(sourceFile);
  const base64 = sourceBytes.toString('base64');
  const dataUrl = `data:image/png;base64,${base64}`;

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  });
  const page = await browser.newPage();

  const webpBase64 = await page.evaluate(
    async ({ dataUrl, targetWidth, q }) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const aspectRatio = img.naturalHeight / img.naturalWidth;
          const targetHeight = Math.round(targetWidth * aspectRatio);

          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          const webpDataUrl = canvas.toDataURL('image/webp', q / 100);
          resolve(webpDataUrl.split(',')[1]);
        };
        img.onerror = reject;
        img.src = dataUrl;
      });
    },
    { dataUrl, targetWidth: width, q: quality }
  );

  await browser.close();
  return Buffer.from(webpBase64, 'base64');
}

async function main() {
  console.log(`Source: ${SOURCE}`);
  const sourceSize = readFileSync(SOURCE).length;
  console.log(`Source size: ${(sourceSize / 1024).toFixed(0)} KB`);

  for (const { file, width } of OUTPUTS) {
    process.stdout.write(`Converting to ${file} (${width}px wide, quality ${QUALITY})... `);
    const buffer = await convertToWebP(SOURCE, width, QUALITY);
    const outPath = join(imagesDir, file);
    writeFileSync(outPath, buffer);
    console.log(`done — ${(buffer.length / 1024).toFixed(0)} KB`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
