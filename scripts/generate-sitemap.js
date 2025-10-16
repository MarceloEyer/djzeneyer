const fs = require('fs');
const routes = [
  { loc: '/', priority: 1.0, changefreq: 'daily' },
  { loc: '/faq', priority: 0.8, changefreq: 'weekly' },
  { loc: '/shop', priority: 0.9, changefreq: 'daily' },
  { loc: '/events', priority: 0.9, changefreq: 'daily' },
  { loc: '/contact', priority: 0.7, changefreq: 'monthly' },
  { loc: '/about', priority: 0.7, changefreq: 'monthly' },
  { loc: '/zen-tribe', priority: 0.8, changefreq: 'weekly' },
];

const today = new Date().toISOString().split('T')[0];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(r => `  <url>
    <loc>https://djzeneyer.com${r.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync('dist/sitemap.xml', xml);
console.log('✅ Sitemap gerado: dist/sitemap.xml');
