// Shared test fixtures — realistic payloads that match production schema shapes.

import type { WPPost, WCProduct } from '../../hooks/usePublicQueries';
import type { UserProfile, AuthSessionResponse, WCOrder } from '../../hooks/useAuthenticatedQueries';


export const mockRawEvent = {
  event_id: '12345678',
  title: 'DJ Zen Eyer at Club X',
  starts_at: '2025-12-20T22:00:00.000Z',
  timezone: 'Europe/Lisbon',
  location: { venue: 'Club X', city: 'Lisbon', region: 'Lisbon', country: 'Portugal' },
  canonical_path: '/zouk-events/2025-12-20-dj-zen-eyer-at-club-x-12345678',
  canonical_url: 'https://djzeneyer.com/zouk-events/2025-12-20-dj-zen-eyer-at-club-x-12345678',
};

export const mockEventsEnvelope = {
  success: true,
  count: 1,
  mode: 'upcoming',
  events: [mockRawEvent],
};

export const mockPosts: WPPost[] = [
  {
    id: 1,
    date: '2025-01-01T00:00:00',
    slug: 'test-post',
    title: { rendered: 'Test Post' },
    excerpt: { rendered: '<p>Test excerpt</p>' },
    featured_image_src: null,
  },
];

export const mockProduct: WCProduct = {
  id: 10,
  name: 'Zouk DJ Set Vol.1',
  slug: 'zouk-dj-set-vol-1',
  price: '9.99',
  regular_price: '9.99',
  type: 'simple',
  status: 'publish',
  short_description: 'A zouk DJ set',
  images: [],
  categories: [],
  stock_status: 'instock',
  purchasable: true,
  permalink: 'https://djzeneyer.com/shop/zouk-dj-set-vol-1',
};

export const mockUserProfile: UserProfile = {
  id: 42,
  email: 'user@example.com',
  display_name: 'Test User',
  first_name: 'Test',
  last_name: 'User',
  avatar: 'https://example.com/avatar.jpg',
};

export const mockAuthSession: AuthSessionResponse = {
  authenticated: true,
  user: mockUserProfile,
  roles: ['subscriber'],
  exp: Math.floor(Date.now() / 1000) + 3600,
};

export const mockOrders: WCOrder[] = [
  {
    id: 100,
    status: 'completed',
    date_created: '2025-01-01T00:00:00',
    total: '29.99',
    line_items: [{ name: 'Zouk DJ Set Vol.1', quantity: 1, total: '29.99' }],
  },
];

// Matches ZenGameLeaderboardSchema = z.record(z.string(), z.array(...))
export const mockLeaderboard = {
  zen_points: [
    { user_id: 1, display_name: 'Top Dancer', points: 1000, avatar: '' },
    { user_id: 2, display_name: 'Second Place', points: 750, avatar: '' },
  ],
};

export const mockCart = {
  items: [],
  items_count: 0,
  totals: { total_price: '0' },
};

export const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.test';
export const REST_BASE = 'https://djzeneyer.com/wp-json';
