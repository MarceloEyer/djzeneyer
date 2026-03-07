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

