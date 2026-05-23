export type ProductOption = {
  title: string;
  sku: string;
  barcode: string;
  price: number;
  compareAtPrice: number | null;
  costPrice: number | null;
  stock: number;
  isActive: boolean;
  imageIds: string[];
};

export type ProductVariant = {
  title: string;
  isActive: boolean;
  imageIds: string[];
  options: ProductOption[];
};

export type ProductPayload = {
  title: string;
  slug: string;
  description: string;
  shortDesc: string;
  brand: string;
  categoryId: string;
  hasVariants: boolean;
  price: number;
  compareAtPrice: number | null;
  costPrice: number | null;
  sku: string;
  barcode: string;
  stock: number | null;
  lowStockThreshold: number;
  isActive: boolean;
  isFeatured: boolean;
  isDigital: boolean;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  imageIds: string[];
  variants: ProductVariant[];
};

export type ProductCategory = {
  id: string;
  label: string;
};

export type ProductAttributeGroup = {
  name: string;
  values: string[];
};

export type ProductEditorMetrics = {
  totalOptions: number;
  totalStock: number;
  activeVariants: number;
  attributeGroups: ProductAttributeGroup[];
  categoryLabel: string;
};

export type UpdateProductField = <Key extends keyof ProductPayload>(
  key: Key,
  value: ProductPayload[Key],
) => void;

export type UpdateVariantField = <Key extends keyof ProductVariant>(
  variantIndex: number,
  key: Key,
  value: ProductVariant[Key],
) => void;

export type UpdateOptionField = <Key extends keyof ProductOption>(
  variantIndex: number,
  optionIndex: number,
  key: Key,
  value: ProductOption[Key],
) => void;
