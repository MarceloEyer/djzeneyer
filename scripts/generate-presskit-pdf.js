import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const outputDir = path.join(root, 'public', 'assets', 'press');

const img = (relativePath) => pathToFileURL(path.join(root, 'public', relativePath)).href;

const assets = {
  hero: img('images/artist/dj-zen-eyer-performing-live.jpg'),
  deck: img('images/artist/dj-zen-eyer-smiling-at-deck.jpg'),
  trophy: img('images/artist/dj-zen-eyer-world-champion-celebration.jpg'),
  portrait: img('images/artist/dj-zen-eyer-official-hero.jpg'),
  club: img('images/artist/dj-zen-eyer-club-performance.jpg'),
};

const shared = {
  website: 'djzeneyer.com',
  bookingEmail: 'booking@djzeneyer.com',
  whatsapp: '+55 21 98741-3091',
  instagram: '@djzeneyer',
  spotify: 'open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw',
  appleMusic: 'music.apple.com/us/artist/1439280950',
  youtube: 'youtube.com/@djzeneyer',
  photos: 'photos.djzeneyer.com',
  countries: [
    ['BR', 'Brazil'],
    ['PT', 'Portugal'],
    ['ES', 'Spain'],
    ['NL', 'Netherlands'],
    ['CZ', 'Czech Republic'],
    ['CH', 'Switzerland'],
    ['PL', 'Poland'],
    ['SI', 'Slovenia'],
    ['HR', 'Croatia'],
    ['IT', 'Italy'],
    ['DE', 'Germany'],
    ['US', 'United States'],
    ['JP', 'Japan'],
    ['AU', 'Australia'],
    ['AR', 'Argentina'],
  ],
};

const documents = {
  en: {
    lang: 'en',
    title: 'DJ Zen Eyer Press Kit',
    outputPdf: 'dj-zen-eyer-presskit-en.pdf',
    outputMd: 'dj-zen-eyer-presskit-en.md',
    eyebrow: 'Official artist EPK',
    heroTitle: 'DJ Zen Eyer',
    heroLead:
      'Brazilian Zouk DJ and music producer for festivals, congresses and dance marathons that need a musical journey built for dancers.',
    heroMeta: 'Rio de Janeiro / Niteroi, Brazil - available worldwide',
    stats: [
      ['2x', 'Ilha do Zouk DJ Championship titles'],
      ['15+', 'countries played'],
      ['4', 'continents'],
      ['2015', 'active as Zen Eyer since'],
    ],
    page2Title: 'Why Book Zen Eyer',
    bookingValue:
      'Zen Eyer is a dance-floor-first Brazilian Zouk DJ. His sets are built around long transitions, emotional continuity and precise floor reading, with Cremosidade frequently associated with his public artist materials: smooth, immersive and never rushed.',
    promoterFitTitle: 'Fit for festivals and marathons',
    promoterFit: [
      'Experienced with international Brazilian Zouk rooms, late-night socials and long-form dance floors.',
      'Musical identity focused on connection, smoothness and continuity instead of abrupt drops.',
      'Portable setup and professional communication for international bookings.',
      'Works well for headline socials, themed nights, congress parties and marathon rooms.',
    ],
    achievementsTitle: 'Credibility',
    achievements: [
      'Winner of Best DJ Performance at Ilha do Zouk DJ Championship 2022.',
      'Winner of Best Remix at Ilha do Zouk DJ Championship 2022.',
      'Brazilian Zouk DJ and music producer from Rio de Janeiro, Brazil.',
      'Member of Mensa International.',
    ],
    festivalsTitle: 'Selected International Footprint',
    festivals: [
      'Rio Zouk Congress - Brazil',
      'IZC Brazil - Brazil',
      'Prague Zouk Congress - Czech Republic',
      'Dutch Zouk - Netherlands',
      'One Zouk Congress - Australia',
      'Zurich Zouk Congress - Switzerland',
      'Lisbon Zouk Marathon - Portugal',
      'LA Zouk Marathon - United States',
      'Polish Zouk Festival / Katowice - Poland',
    ],
    musicTitle: 'Music and Media',
    musicCopy:
      'Official music profiles, remixes and releases are available on the main streaming platforms. For booking decisions, the strongest assets are the artist profile, selected tracks, live performance context and recent festival references.',
    linksTitle: 'Useful Links',
    contactTitle: 'Booking Contact',
    contactCopy:
      'For festival, congress and marathon bookings, send the event city, country, dates, format, expected audience and preferred set times.',
    creditTitle: 'Suggested Credit',
    credit: 'DJ Zen Eyer (Marcelo Eyer Fernandes), Brazilian Zouk DJ and music producer.',
    footer: 'Press Kit - May 2026',
  },
  pt: {
    lang: 'pt-BR',
    title: 'Press Kit DJ Zen Eyer',
    outputPdf: 'dj-zen-eyer-presskit-pt.pdf',
    outputMd: 'dj-zen-eyer-presskit-pt.md',
    eyebrow: 'EPK oficial do artista',
    heroTitle: 'DJ Zen Eyer',
    heroLead:
      'DJ e produtor musical de Zouk Brasileiro para festivais, congressos e maratonas que precisam de uma jornada musical feita para quem dança.',
    heroMeta: 'Rio de Janeiro / Niteroi, Brasil - disponibilidade internacional',
    stats: [
      ['2x', 'titulos no Ilha do Zouk DJ Championship'],
      ['15+', 'paises onde tocou'],
      ['4', 'continentes'],
      ['2015', 'ativo como Zen Eyer desde'],
    ],
    page2Title: 'Por que contratar Zen Eyer',
    bookingValue:
      'Zen Eyer é um DJ de Zouk Brasileiro com foco total na pista. Seus sets sao construidos com transicoes longas, continuidade emocional e leitura precisa da pista, com Cremosidade frequentemente associada aos seus materiais publicos: suave, imersivo e sem pressa.',
    promoterFitTitle: 'Ideal para festivais e maratonas',
    promoterFit: [
      'Experiencia com salas internacionais de Zouk Brasileiro, sociais noturnos e pistas de longa duracao.',
      'Identidade musical focada em conexao, suavidade e continuidade, sem quebras bruscas.',
      'Setup portatil e comunicacao profissional para bookings internacionais.',
      'Adequado para sociais principais, noites tematicas, festas de congresso e salas de maratona.',
    ],
    achievementsTitle: 'Credibilidade',
    achievements: [
      'Vencedor de Best DJ Performance no Ilha do Zouk DJ Championship 2022.',
      'Vencedor de Best Remix no Ilha do Zouk DJ Championship 2022.',
      'DJ e produtor musical de Zouk Brasileiro do Rio de Janeiro, Brasil.',
      'Membro da Mensa International.',
    ],
    festivalsTitle: 'Presenca Internacional Selecionada',
    festivals: [
      'Rio Zouk Congress - Brasil',
      'IZC Brazil - Brasil',
      'Prague Zouk Congress - Republica Tcheca',
      'Dutch Zouk - Holanda',
      'One Zouk Congress - Australia',
      'Zurich Zouk Congress - Suica',
      'Lisbon Zouk Marathon - Portugal',
      'LA Zouk Marathon - Estados Unidos',
      'Polish Zouk Festival / Katowice - Polonia',
    ],
    musicTitle: 'Musica e Midia',
    musicCopy:
      'Perfis oficiais de musica, remixes e lancamentos estao disponiveis nas principais plataformas de streaming. Para contratantes, os ativos mais fortes sao o perfil artistico, faixas selecionadas, contexto de performance ao vivo e referencias recentes de festivais.',
    linksTitle: 'Links Uteis',
    contactTitle: 'Contato para Booking',
    contactCopy:
      'Para bookings em festivais, congressos e maratonas, envie cidade, pais, datas, formato do evento, publico esperado e horarios de set desejados.',
    creditTitle: 'Credito sugerido',
    credit: 'DJ Zen Eyer (Marcelo Eyer Fernandes), DJ e produtor musical de Zouk Brasileiro.',
    footer: 'Press Kit - Maio de 2026',
  },
};

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const list = (items) => items.map((item) => `<li>${escapeHtml(item)}</li>`).join('');

const countryBadges = (countries) =>
  countries
    .map(([code, name]) => `<span class="country"><b>${code}</b>${escapeHtml(name)}</span>`)
    .join('');

const renderHtml = (doc) => `<!doctype html>
<html lang="${doc.lang}">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(doc.title)}</title>
  <style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Inter, Arial, sans-serif;
      color: #f8fbff;
      background: #05070d;
    }
    .page {
      min-height: 297mm;
      padding: 17mm;
      position: relative;
      overflow: hidden;
      page-break-after: always;
      background:
        radial-gradient(circle at 18% 22%, rgba(0, 204, 255, 0.24), transparent 31%),
        linear-gradient(138deg, #071220 0%, #05070d 50%, #101014 100%);
    }
    .photo {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.42;
      filter: saturate(1.1) contrast(1.06);
    }
    .veil {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(90deg, rgba(5,7,13,.94), rgba(5,7,13,.62) 52%, rgba(5,7,13,.28)),
        linear-gradient(0deg, rgba(5,7,13,.9), transparent 40%);
    }
    .content { position: relative; z-index: 2; }
    .eyebrow {
      display: inline-block;
      padding: 7px 12px;
      border: 1px solid rgba(92, 220, 255, .62);
      color: #67dcff;
      font-size: 10px;
      letter-spacing: 2px;
      text-transform: uppercase;
      font-weight: 800;
    }
    h1 {
      margin: 33mm 0 6mm;
      font-size: 62px;
      line-height: .86;
      letter-spacing: 0;
      text-transform: uppercase;
    }
    h2 {
      margin: 0 0 7mm;
      font-size: 25px;
      line-height: 1;
      text-transform: uppercase;
      letter-spacing: 0;
    }
    h3 {
      margin: 7mm 0 3mm;
      color: #67dcff;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 1.2px;
    }
    p, li {
      font-size: 11.6px;
      line-height: 1.58;
      color: rgba(248, 251, 255, .78);
    }
    ul { margin: 0; padding-left: 17px; }
    li { margin: 0 0 2.5mm; }
    .lead {
      max-width: 118mm;
      font-size: 16.5px;
      line-height: 1.42;
      color: rgba(248, 251, 255, .94);
    }
    .meta {
      margin-top: 5mm;
      font-size: 11px;
      color: rgba(255,255,255,.68);
      text-transform: uppercase;
      letter-spacing: 1.2px;
    }
    .facts {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 4mm;
      margin-top: 23mm;
      max-width: 168mm;
    }
    .fact {
      border: 1px solid rgba(255,255,255,.14);
      background: rgba(255,255,255,.08);
      padding: 5mm;
      min-height: 24mm;
      backdrop-filter: blur(8px);
    }
    .fact strong { display: block; font-size: 22px; color: white; }
    .fact span { display: block; margin-top: 2mm; font-size: 8.8px; color: rgba(255,255,255,.64); text-transform: uppercase; letter-spacing: 1px; }
    .split {
      display: grid;
      grid-template-columns: 1fr 64mm;
      gap: 9mm;
      align-items: start;
    }
    .side-photo {
      width: 64mm;
      height: 88mm;
      object-fit: cover;
      border: 1px solid rgba(255,255,255,.18);
      box-shadow: 0 18px 50px rgba(0,0,0,.34);
    }
    .box {
      border: 1px solid rgba(255,255,255,.14);
      background: rgba(255,255,255,.055);
      padding: 5mm;
      margin-bottom: 4mm;
    }
    .festival-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3mm 6mm;
      margin-top: 4mm;
    }
    .festival {
      padding: 3mm 0;
      border-bottom: 1px solid rgba(255,255,255,.1);
      font-size: 10.6px;
      color: rgba(255,255,255,.8);
    }
    .countries {
      display: flex;
      flex-wrap: wrap;
      gap: 2mm;
      margin-top: 5mm;
    }
    .country {
      display: inline-flex;
      align-items: center;
      gap: 1.8mm;
      border: 1px solid rgba(103,220,255,.24);
      background: rgba(103,220,255,.08);
      padding: 2mm 2.8mm;
      font-size: 9.4px;
      color: rgba(255,255,255,.78);
    }
    .country b {
      color: #67dcff;
      font-size: 9px;
      letter-spacing: .5px;
    }
    .links p {
      margin: 1.7mm 0;
      font-size: 10.4px;
      word-break: break-word;
    }
    .contact {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4mm;
      margin-top: 5mm;
    }
    .contact-card {
      background: rgba(103,220,255,.09);
      border: 1px solid rgba(103,220,255,.24);
      padding: 4mm;
      min-height: 22mm;
    }
    .contact-card b {
      display: block;
      color: white;
      font-size: 11px;
      margin-bottom: 1.6mm;
      text-transform: uppercase;
    }
    .contact-card span {
      font-size: 11px;
      color: rgba(255,255,255,.78);
    }
    .footer {
      position: absolute;
      left: 17mm;
      right: 17mm;
      bottom: 10mm;
      display: flex;
      justify-content: space-between;
      color: rgba(255,255,255,.42);
      font-size: 8.8px;
      z-index: 2;
    }
  </style>
</head>
<body>
  <section class="page">
    <img class="photo" src="${assets.hero}" alt="" />
    <div class="veil"></div>
    <div class="content">
      <div class="eyebrow">${escapeHtml(doc.eyebrow)}</div>
      <h1>${escapeHtml(doc.heroTitle)}</h1>
      <p class="lead">${escapeHtml(doc.heroLead)}</p>
      <p class="meta">${escapeHtml(doc.heroMeta)}</p>
      <div class="facts">
        ${doc.stats.map(([value, label]) => `<div class="fact"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`).join('')}
      </div>
    </div>
    <div class="footer"><span>${shared.website}</span><span>${escapeHtml(doc.footer)}</span></div>
  </section>

  <section class="page">
    <div class="content split">
      <main>
        <h2>${escapeHtml(doc.page2Title)}</h2>
        <p class="lead">${escapeHtml(doc.bookingValue)}</p>
        <h3>${escapeHtml(doc.promoterFitTitle)}</h3>
        <ul>${list(doc.promoterFit)}</ul>
        <h3>${escapeHtml(doc.achievementsTitle)}</h3>
        <ul>${list(doc.achievements)}</ul>
      </main>
      <aside>
        <img class="side-photo" src="${assets.deck}" alt="" />
        <div class="box links">
          <h3>${escapeHtml(doc.contactTitle)}</h3>
          <p>${shared.bookingEmail}</p>
          <p>WhatsApp: ${shared.whatsapp}</p>
          <p>Instagram: ${shared.instagram}</p>
        </div>
      </aside>
    </div>
    <div class="footer"><span>${shared.website}</span><span>${escapeHtml(doc.credit)}</span></div>
  </section>

  <section class="page">
    <img class="photo" src="${assets.trophy}" alt="" />
    <div class="veil"></div>
    <div class="content">
      <h2>${escapeHtml(doc.festivalsTitle)}</h2>
      <div class="festival-grid">
        ${doc.festivals.map((festival) => `<div class="festival">${escapeHtml(festival)}</div>`).join('')}
      </div>
      <div class="countries">${countryBadges(shared.countries)}</div>
      <div class="split" style="margin-top: 10mm;">
        <main>
          <h3>${escapeHtml(doc.musicTitle)}</h3>
          <p>${escapeHtml(doc.musicCopy)}</p>
          <h3>${escapeHtml(doc.contactTitle)}</h3>
          <p>${escapeHtml(doc.contactCopy)}</p>
          <div class="contact">
            <div class="contact-card"><b>Email</b><span>${shared.bookingEmail}</span></div>
            <div class="contact-card"><b>WhatsApp</b><span>${shared.whatsapp}</span></div>
          </div>
        </main>
        <aside class="box links">
          <h3>${escapeHtml(doc.linksTitle)}</h3>
          <p>Website: ${shared.website}</p>
          <p>Photos: ${shared.photos}</p>
          <p>Spotify: ${shared.spotify}</p>
          <p>Apple Music: ${shared.appleMusic}</p>
          <p>YouTube: ${shared.youtube}</p>
          <p>Instagram: ${shared.instagram}</p>
        </aside>
      </div>
    </div>
    <div class="footer"><span>${shared.website}</span><span>${escapeHtml(doc.footer)}</span></div>
  </section>
</body>
</html>`;

const renderMarkdown = (doc) => `# ${doc.title}

${doc.heroLead}

## ${doc.page2Title}

${doc.bookingValue}

## ${doc.promoterFitTitle}

${doc.promoterFit.map((item) => `- ${item}`).join('\n')}

## ${doc.achievementsTitle}

${doc.achievements.map((item) => `- ${item}`).join('\n')}

## ${doc.festivalsTitle}

${doc.festivals.map((item) => `- ${item}`).join('\n')}

Countries represented in the booking footprint: ${shared.countries.map(([code]) => code).join(', ')}.

## ${doc.musicTitle}

${doc.musicCopy}

- Spotify: https://${shared.spotify}
- Apple Music: https://${shared.appleMusic}
- YouTube: https://${shared.youtube}
- Instagram: https://www.instagram.com/djzeneyer/
- Photos: https://${shared.photos}

## ${doc.contactTitle}

${doc.contactCopy}

- Email: ${shared.bookingEmail}
- WhatsApp: ${shared.whatsapp}
- Instagram: ${shared.instagram}

## ${doc.creditTitle}

${doc.credit}
`;

await fs.mkdir(outputDir, { recursive: true });

const browser = await puppeteer.launch({ headless: 'new' });
try {
  for (const doc of Object.values(documents)) {
    const page = await browser.newPage();
    await page.setContent(renderHtml(doc), { waitUntil: 'networkidle0' });
    await page.pdf({
      path: path.join(outputDir, doc.outputPdf),
      printBackground: true,
      preferCSSPageSize: true,
    });
    await page.close();

    await fs.writeFile(path.join(outputDir, doc.outputMd), renderMarkdown(doc), 'utf8');
    console.log(`Generated ${path.join('public', 'assets', 'press', doc.outputPdf)}`);
    console.log(`Generated ${path.join('public', 'assets', 'press', doc.outputMd)}`);
  }

  await fs.copyFile(
    path.join(outputDir, documents.en.outputPdf),
    path.join(outputDir, 'dj-zen-eyer-presskit.pdf')
  );
  await fs.copyFile(
    path.join(outputDir, documents.en.outputMd),
    path.join(outputDir, 'dj-zen-eyer-presskit.md')
  );
} finally {
  await browser.close();
}
