export interface ProductImage {
  src: string;
  alt: string;
  sizes?: {
    thumbnail?: string;
    medium?: string;
    medium_large?: string;
    large?: string;
  };
}

export interface ProductCategory {
  id?: number;
  name: string;
  slug?: string;
}
