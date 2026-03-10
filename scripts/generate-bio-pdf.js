import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MD_PATH = join(__dirname, '..', 'public', 'media', 'dj-zen-eyer-bio.md');
const PDF_PATH = join(__dirname, '..', 'public', 'media', 'dj-zen-eyer-bio.pdf');

async function generatePDF() {
  console.log('🚀 Generating Bio PDF...');

  if (!existsSync(MD_PATH)) {
    console.error(`❌ MD file not found at ${MD_PATH}`);
    process.exit(1);
  }

  const mdContent = readFileSync(MD_PATH, 'utf8');

  // Simple MD to HTML conversion for the PDF template
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #1a1a1a; padding: 40px; }
        h1 { color: #8b5cf6; font-size: 32px; border-bottom: 2px solid #8b5cf6; padding-bottom: 10px; }
        h2 { color: #6d28d9; font-size: 24px; margin-top: 30px; }
        h3 { color: #8b5cf6; font-size: 18px; }
        p, li { font-size: 14px; }
        ul { padding-left: 20px; }
        .footer { margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #666; }
        .success { color: #10b981; font-weight: bold; }
      </style>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
    </head>
    <body>
      ${mdContent
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^\- (.*$)/gim, '<li>$1</li>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/_(.*)_/gim, '<em>$1</em>')
        .split('\n\n').map(p => {
          if (p.includes('<li>')) return `<ul>${p}</ul>`;
          if (p.startsWith('<h')) return p;
          return `<p>${p.replace(/\n/g, '<br>')}</p>`;
        }).join('')}
      <div class="footer">
        <p><strong>www.djzeneyer.com</strong> | booking@djzeneyer.com</p>
      </div>
    </body>
    </html>
  `;

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'shell',
      args: ['--no-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    await page.pdf({
      path: PDF_PATH,
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });

    console.log(`✅ PDF generated successfully at ${PDF_PATH}`);
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
  } finally {
    if (browser) await browser.close();
  }
}

generatePDF();
