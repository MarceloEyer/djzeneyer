// Static navigation menu — edit here to change menu items, no deploy needed beyond this file.
// routeKey must match a key in routes-slugs.json.
// navKey must match a key in src/locales/*/translation.json under "nav".
// iconKey must match a key in PRECOMPUTED_VISUALS in Navbar.tsx.

import routeSlugs from './routes-slugs.json';

// Derived from routes-slugs.json at compile time — typo in routeKey fails the build.
export type RouteKey = typeof routeSlugs.routes[number]['key'];

export type NavKey =
  | 'nav.events'
  | 'nav.music'
  | 'nav.about'
  | 'nav.media'
  | 'nav.shop'
  | 'nav.booking'
  | 'nav.sign_in'
  | 'nav.join_the_tribe';

export interface StaticNavItem {
  id: number;
  routeKey: RouteKey;
  navKey: NavKey;
  iconKey: 'event' | 'shop' | 'tribe' | 'music' | 'work' | 'media' | 'about' | 'default';
}

export const STATIC_MENU: StaticNavItem[] = [
  { id: 1, routeKey: 'events',  navKey: 'nav.events',  iconKey: 'event'  },
  { id: 2, routeKey: 'music',   navKey: 'nav.music',   iconKey: 'music'  },
  { id: 3, routeKey: 'about',   navKey: 'nav.about',   iconKey: 'about'  },
  { id: 4, routeKey: 'media',   navKey: 'nav.media',   iconKey: 'media'  },
  { id: 5, routeKey: 'shop',    navKey: 'nav.shop',    iconKey: 'shop'   },
  { id: 6, routeKey: 'booking', navKey: 'nav.booking', iconKey: 'work'   },
];
