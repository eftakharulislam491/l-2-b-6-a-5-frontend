export type Product = {
  id: string | number;
  slug: string;
  image: string;
  title: string;
  category?: string;

  sizes?: string[];
  defaultSize?: string;

  price: number;
  originalPrice?: number;

  badge?: string;
  inStock?: boolean;

  rating?: number;
  reviewCount?: number;
};
