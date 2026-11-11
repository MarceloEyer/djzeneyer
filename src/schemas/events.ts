import { z } from 'zod';

export const EventLocationSchema = z.object({
  venue: z.string(),
  city: z.string(),
  region: z.string(),
  country: z.string(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
}).catchall(z.unknown());

export const ZenBitEventListItemSchema = z.object({
  event_id: z.string(),
  title: z.string(),
  starts_at: z.string(),
  timezone: z.string().optional(),
  location: EventLocationSchema,
  canonical_path: z.string(),
  canonical_url: z.string(),
  source_url: z.string().optional(),
}).catchall(z.unknown());

export const EventOfferSchema = z.object({
  url: z.string(),
  type: z.string(),
  status: z.string().optional(),
}).catchall(z.unknown());

export const EventArtistSchema = z.object({
  name: z.string(),
  // PHP thumbnail functions podem retornar false — catch('') evita erro de parse
  image: z.string().catch('').optional(),
  source_url: z.string().optional(),
}).catchall(z.unknown());

export const ZenBitEventDetailSchema = ZenBitEventListItemSchema.extend({
  ends_at: z.string().optional(),
  description: z.string().optional(),
  image: z.string().catch('').optional(),
  artists: z.array(EventArtistSchema).optional(),
  offers: z.array(EventOfferSchema).optional(),
  tickets: z.array(z.string()).optional(),
  raw: z.unknown().optional(),
}).catchall(z.unknown());

export const EventsApiResponseSchema = z.object({
  success: z.boolean(),
  count: z.number(),
  mode: z.string(),
  events: z.array(ZenBitEventListItemSchema),
}).catchall(z.unknown());

export const EventDetailApiResponseSchema = z.object({
  success: z.boolean(),
  event: ZenBitEventDetailSchema,
}).catchall(z.unknown());
