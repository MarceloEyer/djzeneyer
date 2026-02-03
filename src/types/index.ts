// src/types/index.ts
// Central type definitions for the DJ Zen Eyer application

export interface Festival {
  name: string;
  country: string;
  flag: string;
  url: string;
  upcoming?: boolean;
  date?: string;
}

export interface SocialLink {
  handle?: string;
  id?: string;
  url: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  image: string;
  price: string;
  link: string;
  isExternal: boolean;
  status: string;
  description: string;
}

interface Track {
  id: number;
  title: string;
  artist?: string;
  url: string;
  duration?: number;
  artwork?: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price?: string;
  sale_price?: string;
  images: Array<{
    id: number;
    src: string;
    name: string;
    alt: string;
  }>;
  description?: string;
  short_description?: string;
  categories?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  stock_status?: string;
  manage_stock?: boolean;
  stock_quantity?: number | null;
}

interface CartItem {
  productId: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
}

export interface Testimonial {
  name: string;
  role: string;
  event: string;
  country: string;
  quote: string;
  avatar?: string;
}

export interface FlyerData {
  id: number;
  title: { rendered: string };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
      media_details?: {
        sizes?: {
          medium_large?: { source_url: string };
          full?: { source_url: string };
        };
      };
    }>;
  };
}

interface UserProfile {
  id: number;
  email: string;
  name: string;
  username: string;
  avatar_url?: string;
  points?: number;
  rank?: string;
  level?: number;
}

interface GamiPressAchievement {
  id: number;
  title: string;
  points: number;
  unlocked: boolean;
  icon?: string;
  date_earned?: string;
}

interface Ranking {
  position: number;
  user_id: number;
  display_name: string;
  avatar: string;
  points: number;
}
