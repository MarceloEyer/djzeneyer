// src/routes/sitemap[.]xml.tsx
import type { LoaderFunction } from '@remix-run/node';

// Função para buscar posts do WordPress
async function fetchPosts() {
  const res = await fetch('https://djzeneyer.com/wp-json/wp/v2/posts?per_page=100&_fields=slug,modified');
  if (!res.ok) return [];
  return res.json();
}

// Função para buscar páginas do WordPress
async function fetchPages() {
  const res = await fetch('https://djzeneyer.com/wp-json/wp/v2/pages?per_page=100&_fields=slug,modified');
  if (!res.ok) return [];
  return res.json();
}

// Função para buscar produtos (WooCommerce)
async function fetchProducts() {
  const res = await fetch('https://djzeneyer.com/wp-json/wc/v3/products?per_page=100&consumer_key=YOUR_KEY&consumer_secret=YOUR_SECRET');
  if (!res.ok) return [];
  return res.json();
}

// Função para buscar eventos customizados
async function fetchEvents() {
  const res = await fetch('https://djzeneyer.com/wp-json/wp/v2/insigna?per_page=100&_fields=slug,modified');
  if (!res.ok) return [];
  return res.json();
}

export const loader: LoaderFunction = async () => {
  const baseUrl = 'https://djzeneyer.com';
  
  try {
    // Busca dados em paralelo
    const [posts, pages, products, events] = await Promise.all([
      fetchPosts(),
      fetchPages(),
      fetchProducts(),
      fetchEvents(),
    ]);
    
    // Gera URLs do sitemap
    const postUrls = posts.map((post: any) => `
      <url>
        <loc>${baseUrl}/${post.slug}</loc>
        <lastmod>${new Date(post.modified).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>
    `).join('');
    
    const pageUrls = pages.map((page: any) => `
      <url>
        <loc>${baseUrl}/${page.slug}</loc>
        <lastmod>${new Date(page.modified).toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
      </url>
    `).join('');
    
    const productUrls = products.map((product: any) => `
      <url>
        <loc>${baseUrl}/product/${product.slug}</loc>
        <lastmod>${new Date(product.modified).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `).join('');
    
    const eventUrls = events.map((event: any) => `
      <url>
        <loc>${baseUrl}/events/${event.slug}</loc>
        <lastmod>${new Date(event.modified).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>
    `).join('');
    
    // Gera XML completo
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${postUrls}
  ${pageUrls}
  ${productUrls}
  ${eventUrls}
</urlset>`;
    
    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache por 1 hora
      },
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
};
