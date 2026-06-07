import { z } from 'zod';
import { EventsApiResponseSchema } from '../src/schemas/events.js';

const SITE_URL = process.env.SITE_URL || 'https://djzeneyer.com';
const CI_BYPASS_SECRET = process.env.CI_BYPASS_SECRET;

const headers: HeadersInit = { 'User-Agent': 'djzeneyer-contract-test/1.0' };
if (CI_BYPASS_SECRET) headers['X-CI-Secret'] = CI_BYPASS_SECRET;

const ProductImageSchema = z.object({
  src: z.string(),
  alt: z.string().optional().catch(''),
  sizes: z.record(z.string(), z.string()).optional(),
}).catchall(z.unknown());

const ProductCategorySchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  slug: z.string().optional(),
}).catchall(z.unknown());

const CommerceProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  price: z.string(),
  regular_price: z.string(),
  sale_price: z.string().optional().or(z.literal('')),
  on_sale: z.boolean().optional(),
  stock_status: z.string(),
  images: z.array(ProductImageSchema),
  short_description: z.string(),
  description: z.string().optional(),
  permalink: z.string(),
  categories: z.array(ProductCategorySchema),
}).catchall(z.unknown());

const ShopPageViewModelSchema = z.object({
  featured: CommerceProductSchema.nullable(),
  new_releases: z.array(CommerceProductSchema),
  best_sellers: z.array(CommerceProductSchema),
  curated: z.array(CommerceProductSchema),
}).catchall(z.unknown());

async function fetchJson(path: string): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch(`${SITE_URL}${path}`, { headers, signal: controller.signal });
    if (!response.ok) throw new Error(`${path} HTTP ${response.status}`);
    return response.json();
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error(`Timeout after 10s — ${path}`);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

async function testEventsEndpoint() {
  console.log(`Fetching events from ${SITE_URL}/wp-json/zen-bit/v2/events?mode=upcoming...`);
  const data = await fetchJson('/wp-json/zen-bit/v2/events?mode=upcoming');
  EventsApiResponseSchema.parse(data);
  console.log('✅ Events API contract is intact!');
}

async function testProductsEndpoint() {
  console.log(`Fetching products from ${SITE_URL}/wp-json/djzeneyer/v1/products?limit=3...`);
  const data = await fetchJson('/wp-json/djzeneyer/v1/products?limit=3');
  z.array(CommerceProductSchema).parse(data);
  console.log('✅ Products API contract is intact!');
}

async function testShopPageEndpoint() {
  console.log(`Fetching shop view-model from ${SITE_URL}/wp-json/djzeneyer/v1/shop/page...`);
  const data = await fetchJson('/wp-json/djzeneyer/v1/shop/page?lang=en');
  ShopPageViewModelSchema.parse(data);
  console.log('✅ Shop page API contract is intact!');
}

async function main() {
  try {
    await testEventsEndpoint();
    await testProductsEndpoint();
    await testShopPageEndpoint();
  } catch (error) {
    console.error('❌ Contract broken! Frontend may fail if deployed.');
    console.error(error);
    process.exit(1);
  }
}

main();
