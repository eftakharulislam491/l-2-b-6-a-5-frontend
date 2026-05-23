export type CatalogProduct = {
  id: string;
  slug: string;
  title: string;
  brand: string | null;
  categoryLabel: string;
  image: string;
  imageAlt: string;
  price: number;
  originalPrice: number | null;
  stock: number;
  inStock: boolean;
  isFeatured: boolean;
  createdAt: string;
  defaultVariantOptionIds: string[];
};

export type CatalogSortKey =
  | "featured"
  | "newest"
  | "price_asc"
  | "price_desc"
  | "title_asc";

export type CatalogStockFilter = "all" | "in_stock" | "out_of_stock";
