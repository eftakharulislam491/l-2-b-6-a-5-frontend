import type {
  ProductAttributeGroup,
  ProductCategory,
  ProductEditorMetrics,
  ProductPayload,
  ProductVariant,
} from "./product-editor-types";

export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function buildAttributeGroups(
  variants: ProductVariant[],
): ProductAttributeGroup[] {
  const groups = new Map<string, Set<string>>();

  variants.forEach((variant) => {
    const [attributeName, ...rest] = variant.title.split(":");
    const name = attributeName?.trim() || "Variant";
    const value = rest.join(":").trim() || variant.title.trim() || "Untitled";

    if (!groups.has(name)) {
      groups.set(name, new Set<string>());
    }

    groups.get(name)?.add(value);
  });

  return Array.from(groups.entries()).map(([name, values]) => ({
    name,
    values: Array.from(values),
  }));
}

export function getCategoryLabel(
  categoryId: string,
  categories: ProductCategory[],
): string {
  return (
    categories.find((category) => category.id === categoryId)?.label ?? "Unassigned"
  );
}

export function getVariantStock(variant: ProductVariant): number {
  return variant.options.reduce((sum, option) => sum + option.stock, 0);
}

export function getVariantStartingPrice(
  basePrice: number,
  variant: ProductVariant,
): number {
  if (!variant.options.length) {
    return basePrice;
  }

  return basePrice + Math.min(...variant.options.map((option) => option.price || 0));
}

export function getProductMetrics(
  product: ProductPayload,
  categories: ProductCategory[],
): ProductEditorMetrics {
  const totalOptions = product.variants.reduce(
    (count, variant) => count + variant.options.length,
    0,
  );
  const totalStock = product.variants.reduce(
    (count, variant) => count + getVariantStock(variant),
    0,
  );
  const activeVariants = product.variants.filter((variant) => variant.isActive).length;

  return {
    totalOptions,
    totalStock,
    activeVariants,
    attributeGroups: buildAttributeGroups(product.variants),
    categoryLabel: getCategoryLabel(product.categoryId, categories),
  };
}

export function shortId(value: string): string {
  if (value.length <= 16) {
    return value;
  }

  return `${value.slice(0, 8)}...${value.slice(-4)}`;
}

export function toRequiredNumber(value: string): number {
  if (!value.trim()) {
    return 0;
  }

  return Number(value);
}

export function toOptionalNumber(value: string): number | null {
  if (!value.trim()) {
    return null;
  }

  return Number(value);
}

export function toRequiredInteger(value: string): number {
  if (!value.trim()) {
    return 0;
  }

  return Math.max(0, Math.trunc(Number(value)));
}

export function toOptionalInteger(value: string): number | null {
  if (!value.trim()) {
    return null;
  }

  return Math.max(0, Math.trunc(Number(value)));
}
