import { http, HttpResponse } from 'msw';
import {
  mockRawEvent,
  mockEventsEnvelope,
  mockPosts,
  mockProduct,
  mockUserProfile,
  mockAuthSession,
  mockOrders,
  mockLeaderboard,
  mockCart,
  REST_BASE,
} from './fixtures';

export const handlers = [
  // ── Public ──────────────────────────────────────────────────────────────────
  http.get(`${REST_BASE}/zen-bit/v2/events`, () => HttpResponse.json(mockEventsEnvelope)),

  http.get(`${REST_BASE}/zen-bit/v2/events/:id`, ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      success: true,
      event: { ...mockRawEvent, event_id: String(id) },
    });
  }),

  http.get(`${REST_BASE}/wp/v2/posts`, () => HttpResponse.json(mockPosts)),

  http.get(`${REST_BASE}/wp/v2/categories`, () =>
    HttpResponse.json([{ id: 1, name: 'Zouk', slug: 'zouk', count: 5, taxonomy: 'category' }])
  ),

  http.get(`${REST_BASE}/wp/v2/tags`, () => HttpResponse.json([])),

  http.get(`${REST_BASE}/djzeneyer/v1/products`, () => HttpResponse.json([mockProduct])),

  http.get(`${REST_BASE}/djzeneyer/v1/shop/page`, () =>
    HttpResponse.json({ products: [mockProduct], featured: [mockProduct] })
  ),

  http.get(`${REST_BASE}/djzeneyer/v1/products/collections`, () => HttpResponse.json([])),

  http.get(`${REST_BASE}/zengame/v1/leaderboard`, () => HttpResponse.json(mockLeaderboard)),

  http.get(`${REST_BASE}/zen-seo/v1/settings`, () =>
    HttpResponse.json({ success: true, data: { real_name: 'Marcelo Eyer' } })
  ),

  http.get(`${REST_BASE}/zen-seo/v1/profile`, () =>
    HttpResponse.json({ data: { identity: { stageName: 'DJ Zen Eyer' } } })
  ),

  http.get(`${REST_BASE}/wp/v2/remixes`, () => HttpResponse.json([{
    id: 1, title: { rendered: 'Test Remix' }, slug: 'test-remix',
    category_name: 'Zouk', tag_names: [], links: { download: '', soundcloud: '', youtube: '' },
  }])),

  // ── Authenticated ───────────────────────────────────────────────────────────
  http.get(`${REST_BASE}/zeneyer-auth/v1/session`, () =>
    HttpResponse.json(mockAuthSession)
  ),

  http.get(`${REST_BASE}/zeneyer-auth/v1/profile`, () =>
    HttpResponse.json({ success: true, data: mockUserProfile })
  ),

  http.get(`${REST_BASE}/zeneyer-auth/v1/orders`, () =>
    HttpResponse.json({ success: true, data: mockOrders })
  ),

  http.get(`${REST_BASE}/zeneyer-auth/v1/newsletter`, () =>
    HttpResponse.json({ success: true, subscribed: true })
  ),

  http.get(`${REST_BASE}/wc/store/v1/cart`, () => HttpResponse.json(mockCart)),

  http.get(`${REST_BASE}/zengame/v1/me`, () =>
    HttpResponse.json({
      user_id: 42,
      points: { zen_points: { name: 'Zen Points', amount: 100, image: '' } },
      rank: { current: { id: 1, title: 'Beginner', image: '' }, progress: 50, requirements: [], next: null },
      achievements_earned: [],
      achievements_locked: [],
      recent_achievements: [],
      logs: [],
      stats: { totalTracks: 0, eventsAttended: 0, streak: 0, streakFire: false },
      main_points_slug: 'zen_points',
      lastUpdate: '',
      version: '1.0',
    })
  ),

  // ── Mutations ───────────────────────────────────────────────────────────────
  http.post(`${REST_BASE}/wc/store/v1/cart/add-item`, () =>
    HttpResponse.json({ ...mockCart, items_count: 1 })
  ),

  http.post(`${REST_BASE}/zeneyer-auth/v1/profile`, () =>
    HttpResponse.json({ success: true, message: 'Profile updated' })
  ),

  http.post(`${REST_BASE}/zeneyer-auth/v1/newsletter`, () =>
    HttpResponse.json({ success: true })
  ),

  http.post(`${REST_BASE}/djzeneyer/v1/subscribe`, () =>
    HttpResponse.json({ success: true, message: 'Subscribed' })
  ),

  http.post(`${REST_BASE}/zengame/v1/track`, () =>
    HttpResponse.json({ success: true })
  ),
];
