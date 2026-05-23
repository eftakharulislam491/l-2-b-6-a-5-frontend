import type {
  ProductImage,
  ProductListItem,
  ProductVariantOption,
} from "@/services/products/getAllProducts";
import type {
  ProductDetailGalleryImage,
  ProductDetailOption,
  ProductDetailVariantGroup,
  ProductDetailView,
} from "./product-detail-types";

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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function collectGalleryImages(product: ProductListItem) {
  const images: ProductDetailGalleryImage[] = [];
  const seen = new Set<string>();

  const pushImage = (image: ProductImage | undefined, fallbackLabel: string) => {
    const resolvedUrl = resolveImageUrl(image?.src ?? image?.url);

    if (seen.has(resolvedUrl)) {
      return;
    }

    seen.add(resolvedUrl);
    images.push({
      src: resolvedUrl,
      alt: image?.altText?.trim() || fallbackLabel,
    });
  };

  product.images.forEach((image, index) =>
    pushImage(image, `${product.title} image ${index + 1}`),
  );

  product.variants.forEach((variant) => {
    variant.images.forEach((image, index) =>
      pushImage(image, `${variant.title} image ${index + 1}`),
    );

    variant.options.forEach((option) => {
      option.images.forEach((image, index) =>
        pushImage(
          image,
          `${variant.title} option ${option.sku || option.id} image ${index + 1}`,
        ),
      );
    });
  });

  if (!images.length) {
    images.push({
      src: PRODUCT_IMAGE_PLACEHOLDER,
      alt: product.title.trim() || "Product image",
    });
  }

  return images;
}

function mapVariantOption(
  variantTitle: string,
  option: ProductVariantOption,
): ProductDetailOption {
  const price = parsePrice(option.price) ?? 0;
  const compareAtPrice = parsePrice(option.compareAtPrice);
  const normalizedSku = option.sku?.trim() || null;
  const normalizedTitle =
    typeof option.title === "string" ? option.title.trim() || null : null;
  const normalizedBarcode = option.barcode?.trim() || null;

  return {
    id: option.id,
    label:
      normalizedTitle ||
      (normalizedSku ? `${variantTitle} - ${normalizedSku}` : variantTitle),
    price,
    compareAtPrice:
      compareAtPrice !== null && compareAtPrice > price ? compareAtPrice : null,
    stock: typeof option.stock === "number" ? option.stock : null,
    sku: normalizedSku,
    barcode: normalizedBarcode,
    isActive: option.isActive,
  };
}

function buildVariantGroups(product: ProductListItem): ProductDetailVariantGroup[] {
  return product.variants.map((variant) => ({
    id: variant.id,
    title: variant.title.trim() || "Variant",
    isActive: variant.isActive,
    options: variant.options.map((option) =>
      mapVariantOption(variant.title.trim() || "Variant", option),
    ),
  }));
}

function buildAdditionalInfo(product: ProductListItem, stock: number) {
  const entries: Array<[string, string | null | undefined]> = [
    ["Product ID", product.id],
    ["Slug", product.slug.trim()],
    ["Brand", product.brand?.trim()],
    ["Category", product.category?.name?.trim() || "Uncategorized"],
    ["Status", product.isActive ? "Active" : "Inactive"],
    ["Featured", product.isFeatured ? "Yes" : "No"],
    ["Digital Product", product.isDigital ? "Yes" : "No"],
    ["Has Variants", product.hasVariants ? "Yes" : "No"],
    ["Available Stock", String(stock)],
    [
      "Low Stock Threshold",
      typeof product.lowStockThreshold === "number"
        ? String(product.lowStockThreshold)
        : null,
    ],
    ["Created At", formatDate(product.createdAt)],
    ["Updated At", formatDate(product.updatedAt)],
  ];

  return Object.fromEntries(
    entries.filter((entry): entry is [string, string] => Boolean(entry[1])),
  );
}

export function mapProductToDetailView(product: ProductListItem): ProductDetailView {
  const stock = getProductStock(product);
  const variantGroups = buildVariantGroups(product);
  const optionChoices = variantGroups.flatMap((group) => group.options);

  return {
    id: product.id,
    title: product.title.trim() || "Untitled product",
    brand: product.brand?.trim() || null,
    shortDesc: product.shortDesc?.trim() || null,
    categoryLabel: product.category?.name?.trim() || "Uncategorized",
    galleryImages: collectGalleryImages(product),
    isFeatured: Boolean(product.isFeatured),
    isDigital: Boolean(product.isDigital),
    inStock: stock > 0,
    stock,
    stockLabel: stock > 0 ? `${stock} available` : "Currently unavailable",
    lowStockThreshold: product.lowStockThreshold,
    basePrice: parsePrice(product.price) ?? 0,
    compareAtPrice: parsePrice(product.compareAtPrice),
    sku: product.sku?.trim() || null,
    barcode: product.barcode?.trim() || null,
    optionChoices,
    description: product.description?.trim() || null,
    additionalInfo: buildAdditionalInfo(product, stock),
    variantGroups,
  };
}
