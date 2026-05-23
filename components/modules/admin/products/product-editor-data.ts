import type { ProductOption, ProductPayload, ProductVariant } from "./product-editor-types";

export function createEmptyOption(): ProductOption {
  return {
    title: "",
    sku: "",
    barcode: "",
    price: 0,
    compareAtPrice: null,
    costPrice: null,
    stock: 0,
    isActive: true,
    imageIds: [],
  };
}

export function createEmptyVariant(): ProductVariant {
  return {
    title: "",
    isActive: true,
    imageIds: [],
    options: [createEmptyOption()],
  };
}

export function createInitialProduct(): ProductPayload {
  return {
    title: "",
    slug: "",
    description: "",
    shortDesc: "",
    brand: "",
    categoryId: "",
    hasVariants: false,
    price: 0,
    compareAtPrice: null,
    costPrice: null,
    sku: "",
    barcode: "",
    stock: null,
    lowStockThreshold: 5,
    isActive: true,
    isFeatured: false,
    isDigital: false,
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    imageIds: [],
    variants: [],
  };
}
