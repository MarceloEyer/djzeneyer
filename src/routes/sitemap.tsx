// src/routes/sitemap.tsx
export async function loader() {
  const events = await fetchEvents(); // sua API
  const urls = events.map(e => `/events/${e.slug}`);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.map(url => `<url><loc>https://djzeneyer.com${url}</loc></url>`).join('')}
  </urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}