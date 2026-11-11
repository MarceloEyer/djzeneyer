import puppeteer from 'puppeteer';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { extname, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = join(__dirname, '..');
const MD_PATH = join(ROOT, 'public', 'media', 'dj-zen-eyer-bio.md');
const PDF_PATH = join(ROOT, 'public', 'media', 'dj-zen-eyer-bio.pdf');
const PREVIEW_DIR = join(ROOT, 'tmp', 'pdfs');
const PREVIEW_PATH = join(PREVIEW_DIR, 'dj-zen-eyer-bio-preview.png');
const HERO_IMAGE_PATH = join(ROOT, 'public', 'images', 'artist', 'dj-zen-eyer-smiling-at-deck.jpg');

function ensureDir(path) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function toDataUri(filePath) {
  const extension = extname(filePath).toLowerCase();
  const mimeType = extension === '.png' ? 'image/png' : 'image/jpeg';
  const base64 = readFileSync(filePath).toString('base64');
  return `data:${mimeType};base64,${base64}`;
}

function parseMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/);
  const document = {
    title: '',
    subtitle: '',
    sections: []
  };

  let currentSection = null;

  const ensureSection = () => {
    if (!currentSection) {
      currentSection = { heading: '', paragraphs: [], bullets: [] };
      document.sections.push(currentSection);
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }

    if (line.startsWith('# ')) {
      document.title = line.slice(2).trim();
      continue;
    }

    if (line.startsWith('> ')) {
      document.subtitle = line.slice(2).trim();
      continue;
    }

    if (line.startsWith('## ')) {
      currentSection = { heading: line.slice(3).trim(), paragraphs: [], bullets: [] };
      document.sections.push(currentSection);
      continue;
    }

    ensureSection();

    if (line.startsWith('- ')) {
      currentSection.bullets.push(line.slice(2).trim());
      continue;
    }

    currentSection.paragraphs.push(line);
  }

  return document;
}

function renderSection(section) {
  const paragraphs = section.paragraphs
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join('');

  const bullets = section.bullets.length
    ? `<ul>${section.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}</ul>`
    : '';

  return `
    <section class="content-section">
      <h2>${escapeHtml(section.heading)}</h2>
      ${paragraphs}
      ${bullets}
    </section>
  `;
}

function buildHtml(document) {
  const heroImage = toDataUri(HERO_IMAGE_PATH);
  const [profileSection, highlightsSection, footprintSection, directionSection, bookingSection] = document.sections;

  const spotlightItems = [
    { value: '2x', label: 'World titles' },
    { value: '10+', label: 'Countries played' },
    { value: 'Global', label: 'Booking availability' },
    { value: 'Mensa', label: 'Member' }
  ];

  const contactBullets = bookingSection?.bullets ?? [];
  const highlightBullets = highlightsSection?.bullets ?? [];

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>${escapeHtml(document.title)}</title>
        <style>
          @page {
            size: A4;
            margin: 0;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            color: #171717;
            background: #f4efe8;
          }

          .page {
            width: 210mm;
            min-height: 297mm;
            padding: 18mm 16mm;
            position: relative;
            overflow: hidden;
          }

          .page + .page {
            page-break-before: always;
          }

          .page--cover {
            background:
              radial-gradient(circle at top left, rgba(201, 143, 255, 0.35), transparent 30%),
              linear-gradient(135deg, #0f0f16 0%, #1b1230 45%, #25184d 100%);
            color: #f6f2ff;
          }

          .cover-grid {
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: 12mm;
            align-items: stretch;
          }

          .eyebrow {
            display: inline-block;
            padding: 4px 10px;
            border: 1px solid rgba(255, 255, 255, 0.22);
            border-radius: 999px;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            background: rgba(255, 255, 255, 0.08);
            color: #d6c0ff;
          }

          h1 {
            margin: 12px 0 10px;
            font-size: 30px;
            line-height: 1;
            letter-spacing: 0.02em;
            text-transform: uppercase;
          }

          .subtitle {
            margin: 0 0 20px;
            max-width: 92%;
            color: rgba(246, 242, 255, 0.76);
            font-size: 14px;
            line-height: 1.55;
          }

          .lead {
            margin: 0;
            color: rgba(246, 242, 255, 0.88);
            font-size: 12px;
            line-height: 1.7;
          }

          .hero-photo {
            min-height: 122mm;
            border-radius: 18px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.12);
            box-shadow: 0 24px 70px rgba(0, 0, 0, 0.35);
          }

          .hero-photo img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }

          .spotlight-grid {
            margin-top: 10mm;
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 8px;
          }

          .spotlight-card {
            border-radius: 14px;
            padding: 12px;
            background: rgba(255, 255, 255, 0.09);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }

          .spotlight-card strong {
            display: block;
            margin-bottom: 4px;
            font-size: 16px;
            color: #ffffff;
          }

          .spotlight-card span {
            display: block;
            font-size: 10px;
            line-height: 1.35;
            color: rgba(246, 242, 255, 0.7);
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }

          .section-shell {
            margin-top: 10mm;
            display: grid;
            grid-template-columns: 1fr 0.95fr;
            gap: 10mm;
          }

          .panel {
            border-radius: 18px;
            padding: 18px;
            background: rgba(255, 255, 255, 0.94);
            color: #1e1731;
          }

          .panel--soft {
            background: rgba(255, 255, 255, 0.08);
            color: #f6f2ff;
            border: 1px solid rgba(255, 255, 255, 0.08);
          }

          .panel h2,
          .content-section h2,
          .booking-card h2 {
            margin: 0 0 10px;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.18em;
            text-transform: uppercase;
          }

          .panel p,
          .content-section p,
          .booking-card li {
            margin: 0 0 9px;
            font-size: 12px;
            line-height: 1.7;
          }

          .highlight-list {
            margin: 0;
            padding: 0;
            list-style: none;
            display: grid;
            gap: 8px;
          }

          .highlight-list li {
            border-radius: 12px;
            padding: 10px 12px;
            background: rgba(255, 255, 255, 0.08);
            font-size: 11px;
            line-height: 1.5;
          }

          .pull-quote {
            margin-top: 10mm;
            border-left: 3px solid #cfb1ff;
            padding-left: 12px;
            font-size: 15px;
            line-height: 1.55;
            color: #ffffff;
          }

          .footer-strip {
            position: absolute;
            left: 16mm;
            right: 16mm;
            bottom: 14mm;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: rgba(246, 242, 255, 0.72);
            font-size: 10px;
            letter-spacing: 0.04em;
          }

          .page--details {
            background:
              linear-gradient(180deg, #f7f1e9 0%, #f4efe8 100%);
          }

          .details-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            gap: 10mm;
            margin-bottom: 10mm;
          }

          .details-header h2 {
            margin: 0;
            font-size: 24px;
            line-height: 1;
            text-transform: uppercase;
            color: #25184d;
          }

          .details-header p {
            margin: 0;
            max-width: 74mm;
            font-size: 11px;
            line-height: 1.6;
            color: #4b4760;
          }

          .details-grid {
            display: grid;
            grid-template-columns: 1.15fr 0.85fr;
            gap: 10mm;
          }

          .content-section {
            border-radius: 18px;
            padding: 16px 18px;
            background: rgba(255, 255, 255, 0.74);
            border: 1px solid rgba(37, 24, 77, 0.08);
            margin-bottom: 8mm;
          }

          .content-section ul,
          .booking-card ul {
            margin: 0;
            padding-left: 18px;
          }

          .content-section li,
          .booking-card li {
            margin-bottom: 7px;
          }

          .booking-card {
            border-radius: 18px;
            padding: 18px;
            background: #25184d;
            color: #f6f2ff;
            box-shadow: 0 18px 50px rgba(37, 24, 77, 0.18);
          }

          .booking-card ul {
            list-style: none;
            padding-left: 0;
          }

          .booking-card li {
            border-bottom: 1px solid rgba(255, 255, 255, 0.12);
            padding: 0 0 9px;
            margin-bottom: 9px;
          }

          .booking-card li:last-child {
            border-bottom: 0;
            margin-bottom: 0;
            padding-bottom: 0;
          }

          .accent-note {
            margin-top: 8mm;
            padding: 14px 16px;
            border-radius: 16px;
            background: #e9dcff;
            color: #2c1f52;
            font-size: 12px;
            line-height: 1.65;
          }

          .page-number {
            position: absolute;
            right: 16mm;
            bottom: 10mm;
            font-size: 10px;
            color: rgba(37, 24, 77, 0.45);
          }
        </style>
      </head>
      <body>
        <main class="page page--cover">
          <section class="cover-grid">
            <div>
              <div class="eyebrow">Official Press Kit</div>
              <h1>${escapeHtml(document.title)}</h1>
              <p class="subtitle">${escapeHtml(document.subtitle)}</p>
              <p class="lead">${escapeHtml(profileSection?.paragraphs?.[0] ?? '')}</p>
              <p class="lead" style="margin-top: 10px;">${escapeHtml(profileSection?.paragraphs?.[1] ?? '')}</p>
            </div>
            <div class="hero-photo">
              <img src="${heroImage}" alt="DJ Zen Eyer" />
            </div>
          </section>

          <section class="spotlight-grid">
            ${spotlightItems
              .map(
                (item) => `
                  <div class="spotlight-card">
                    <strong>${escapeHtml(item.value)}</strong>
                    <span>${escapeHtml(item.label)}</span>
                  </div>
                `
              )
              .join('')}
          </section>

          <section class="section-shell">
            <div class="panel">
              <h2>${escapeHtml(highlightsSection?.heading ?? 'Career Highlights')}</h2>
              <ul class="highlight-list">
                ${highlightBullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}
              </ul>
            </div>
            <div class="panel panel--soft">
              <h2>${escapeHtml(directionSection?.heading ?? 'Musical Direction')}</h2>
              ${(directionSection?.paragraphs ?? [])
                .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
                .join('')}
            </div>
          </section>

          <div class="pull-quote">"Haste is the enemy of creaminess." A set architecture built for connection, tension, and release.</div>

          <div class="footer-strip">
            <span>www.djzeneyer.com</span>
            <span>booking@djzeneyer.com</span>
          </div>
        </main>

        <section class="page page--details">
          <header class="details-header">
            <div>
              <div class="eyebrow" style="background: #efe6ff; border-color: rgba(37, 24, 77, 0.1); color: #6a3fe6;">Promoter Asset</div>
              <h2>Global Presence</h2>
            </div>
            <p>Use this press kit for booking decks, festival websites, media features, and promoter materials that need a clean summary of positioning, credibility, and contact details.</p>
          </header>

          <div class="details-grid">
            <div>
              ${renderSection(footprintSection)}
              ${renderSection(directionSection)}
            </div>
            <div>
              <aside class="booking-card">
                <h2>${escapeHtml(bookingSection?.heading ?? 'Booking Details')}</h2>
                <ul>
                  ${contactBullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}
                </ul>
              </aside>
              <div class="accent-note">DJ Zen Eyer is particularly recognized for long-form transitions, emotional continuity, and reliable floor reading in Brazilian Zouk environments ranging from intimate socials to headline festival rooms.</div>
            </div>
          </div>

          <div class="page-number">02</div>
        </section>
      </body>
    </html>
  `;
}

async function generatePDF() {
  console.log('Generating DJ Zen Eyer press kit PDF...');

  if (!existsSync(MD_PATH)) {
    console.error(`Markdown source not found: ${MD_PATH}`);
    process.exit(1);
  }

  ensureDir(PREVIEW_DIR);

  const markdown = readFileSync(MD_PATH, 'utf8');
  const document = parseMarkdown(markdown);
  const html = buildHtml(document);

  writeFileSync(join(PREVIEW_DIR, 'dj-zen-eyer-bio-preview.html'), html, 'utf8');

  let browser;

  try {
    browser = await puppeteer.launch({
      headless: 'shell',
      args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 1980, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: PREVIEW_PATH, fullPage: true });
    await page.pdf({
      path: PDF_PATH,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true
    });

    console.log(`PDF generated at ${PDF_PATH}`);
    console.log(`Preview generated at ${PREVIEW_PATH}`);
  } catch (error) {
    console.error('Failed to generate press kit PDF:', error);
    process.exitCode = 1;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

generatePDF();

