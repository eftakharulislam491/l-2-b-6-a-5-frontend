export type ProductDetailGalleryImage = {
  src: string;
  alt: string;
};

export type ProductDetailOption = {
  id: string;
  label: string;
  price: number;
  compareAtPrice: number | null;
  stock: number | null;
  sku: string | null;
  barcode: string | null;
  isActive: boolean;
};

export type ProductDetailVariantGroup = {
  id: string;
  title: string;
  isActive: boolean;
  options: ProductDetailOption[];
};

export type ProductDetailView = {
  id: string;
  title: string;
  brand: string | null;
  shortDesc: string | null;
  categoryLabel: string;
  galleryImages: ProductDetailGalleryImage[];
  isFeatured: boolean;
  isDigital: boolean;
  inStock: boolean;
  stock: number;
  stockLabel: string;
  lowStockThreshold: number | null;
  basePrice: number;
  compareAtPrice: number | null;
  sku: string | null;
  barcode: string | null;
  optionChoices: ProductDetailOption[];
  description: string | null;
  additionalInfo: Record<string, string>;
  variantGroups: ProductDetailVariantGroup[];
};
