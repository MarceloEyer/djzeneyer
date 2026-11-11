import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const ProductImageSchema = z.object({
  id: z.number().optional(),
  src: z.string().url(),
  alt: z.string().catch(''),
  sizes: z.object({
    thumbnail: z.string().optional(),
    medium: z.string().optional(),
    medium_large: z.string().optional(),
    large: z.string().optional(),
  }).partial().optional(),
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
  permalink: z.string().url(),
  categories: z.array(ProductCategorySchema),
}).catchall(z.unknown());

const ShopPageViewModelSchema = z.object({
  featured: CommerceProductSchema.nullable(),
  new_releases: z.array(CommerceProductSchema),
  best_sellers: z.array(CommerceProductSchema),
  curated: z.array(CommerceProductSchema),
}).catchall(z.unknown());

const product = {
  id: 10,
  name: 'Zouk DJ Set Vol.1',
  slug: 'zouk-dj-set-vol-1',
  price: '9.99',
  regular_price: '9.99',
  sale_price: '',
  on_sale: false,
  stock_status: 'instock',
  images: [
    {
      id: 99,
      src: 'https://djzeneyer.com/wp-content/uploads/product.jpg',
      alt: 'Zouk DJ Set cover',
      sizes: {
        medium: 'https://djzeneyer.com/wp-content/uploads/product-300x169.jpg',
        medium_large: 'https://djzeneyer.com/wp-content/uploads/product-768x432.jpg',
      },
    },
  ],
  short_description: '<p>A zouk DJ set</p>',
  description: '',
  permalink: 'https://djzeneyer.com/shop/zouk-dj-set-vol-1',
  categories: [{ id: 1, name: 'Music', slug: 'music' }],
};

const shopPage = {
  featured: product,
  new_releases: [product],
  best_sellers: [product],
  curated: [product],
};

describe('Zen Commerce API contract', () => {
  it('product list items match the headless product contract', () => {
    const result = z.array(CommerceProductSchema).safeParse([product]);
    expect(result.success, result.success ? '' : JSON.stringify(result.error.format())).toBe(true);
  });

  it('product detail can include a full description', () => {
    const detail = { ...product, description: '<p>Full product description</p>' };
    const result = CommerceProductSchema.safeParse(detail);
    expect(result.success, result.success ? '' : JSON.stringify(result.error.format())).toBe(true);
  });

  it('/shop/page view-model preserves the frontend row contract', () => {
    const result = ShopPageViewModelSchema.safeParse(shopPage);
    expect(result.success, result.success ? '' : JSON.stringify(result.error.format())).toBe(true);
  });

  it('rejects product without the fields the frontend needs for cards and schema', () => {
    const { permalink: _permalink, images: _images, ...broken } = product;
    const result = CommerceProductSchema.safeParse(broken);
    expect(result.success).toBe(false);
  });
});
