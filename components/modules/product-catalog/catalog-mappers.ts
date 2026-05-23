import type {
  ProductImage,
  ProductListItem,
} from "@/services/products/getAllProducts";
import type { CatalogProduct } from "./types";

const FALLBACK_BASE_URL =
  process.env.BASE_URL || "https://e-commerce-backend-491.vercel.app/";
const PRODUCT_IMAGE_PLACEHOLDER = "/product/product-placeholder.svg";

function parsePrice(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function getFirstImage(images: ProductImage[]) {
  return (
    images.find((image) => {
      const source = image.src ?? image.url;
      return typeof source === "string" && source.trim().length > 0;
    }) ?? null
  );
}

function getProductImage(product: ProductListItem) {
  const directImage = getFirstImage(product.images);

  if (directImage) {
    return directImage;
  }

  for (const variant of product.variants) {
    const variantImage = getFirstImage(variant.images);

    if (variantImage) {
      return variantImage;
    }

    for (const option of variant.options) {
      const optionImage = getFirstImage(option.images);

      if (optionImage) {
        return optionImage;
      }
    }
  }

  return null;
}

function resolveImageUrl(url: string | null | undefined) {
  if (!url?.trim()) {
    return PRODUCT_IMAGE_PLACEHOLDER;
  }

  if (/^(https?:)?\/\//i.test(url) || url.startsWith("data:")) {
    return url;
  }

  try {
    return new URL(url, FALLBACK_BASE_URL).toString();
  } catch {
    return PRODUCT_IMAGE_PLACEHOLDER;
  }
}

function getProductPrice(product: ProductListItem) {
  const directPrice = parsePrice(product.price);

  if (directPrice !== null) {
    return directPrice;
  }

  for (const variant of product.variants) {
    for (const option of variant.options) {
      const optionPrice = parsePrice(option.price);

      if (optionPrice !== null) {
        return optionPrice;
      }
    }
  }

  return 0;
}

function getProductOriginalPrice(product: ProductListItem) {
  const directCompareAtPrice = parsePrice(product.compareAtPrice);

  if (directCompareAtPrice !== null) {
    return directCompareAtPrice;
  }

  for (const variant of product.variants) {
    for (const option of variant.options) {
      const optionCompareAtPrice = parsePrice(option.compareAtPrice);

      if (optionCompareAtPrice !== null) {
        return optionCompareAtPrice;
      }
    }
  }

  return null;
}

function getProductStock(product: ProductListItem) {
  if (typeof product.stock === "number") {
    return product.stock;
  }

  let totalStock = 0;
  let hasVariantStock = false;

  for (const variant of product.variants) {
    for (const option of variant.options) {
      if (typeof option.stock === "number") {
        totalStock += option.stock;
        hasVariantStock = true;
      }
    }
  }

  return hasVariantStock ? totalStock : 0;
}

function getDefaultVariantOptionIds(product: ProductListItem) {
  return product.variants
    .map(
      (variant) =>
        variant.options.find((option) => option.isActive)?.id ?? variant.options[0]?.id,
    )
    .filter((id): id is string => typeof id === "string" && id.trim().length > 0);
}

export function mapProductToCatalogProduct(
  product: ProductListItem,
): CatalogProduct {
  const image = getProductImage(product);
  const imageSrc = image?.src ?? image?.url;
  const price = getProductPrice(product);
  const originalPrice = getProductOriginalPrice(product);
  const stock = getProductStock(product);

  return {
    id: product.id,
    slug: product.slug.trim() || product.id,
    title: product.title.trim() || "Untitled product",
    brand: product.brand?.trim() || null,
    categoryLabel: product.category?.name?.trim() || "Uncategorized",
    image: resolveImageUrl(imageSrc),
    imageAlt: image?.altText?.trim() || product.title.trim() || "Product image",
    price,
    originalPrice:
      originalPrice !== null && originalPrice > price ? originalPrice : null,
    stock,
    inStock: stock > 0,
    isFeatured: Boolean(product.isFeatured),
    createdAt: product.createdAt,
    defaultVariantOptionIds: getDefaultVariantOptionIds(product),
  };
}

export function mapProductsToCatalogProducts(products: ProductListItem[]) {
  return products.map(mapProductToCatalogProduct);
}
