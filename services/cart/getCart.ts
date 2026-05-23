"use server";

import { getCookie } from "../auth/tokenHandlers";
import type { CartItemSummary } from "./cart-types";

const FALLBACK_BASE_URL = "https://e-commerce-backend-491.vercel.app/";
const PRODUCT_IMAGE_PLACEHOLDER = "/product/product-placeholder.svg";
const MAX_GET_CART_ATTEMPTS = 2;
const RETRYABLE_CART_ERROR_PATTERN =
  /expired transaction|transaction api error|interactive transaction timeout|timed out|Unique constraint failed on the fields:\s*\(`"userId"`\)/i;

type CartApiResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
};

export type GetCartResult = {
  items: CartItemSummary[];
  error: string | null;
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableCartError(message: string | null | undefined) {
  if (!message) {
    return false;
  }

  return RETRYABLE_CART_ERROR_PATTERN.test(message);
}

function getRequestAuthHeaders(
  accessToken: string,
  refreshToken: string | null,
) {
  const cookieHeader = [
    `accessToken=${accessToken}`,
    refreshToken ? `refreshToken=${refreshToken}` : null,
  ]
    .filter(Boolean)
    .join("; ");

  return {
    Accept: "application/json",
    Authorization: `Bearer ${accessToken}`,
    Cookie: cookieHeader,
  };
}

function toRecord(value: unknown) {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function toArray(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function getStringValue(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

function getNumberValue(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string" && value.trim()) {
      const parsedValue = Number(value);

      if (Number.isFinite(parsedValue)) {
        return parsedValue;
      }
    }
  }

  return null;
}

function getImageUrlFromImages(images: unknown[]) {
  for (const image of images) {
    if (typeof image === "string" && image.trim()) {
      return image.trim();
    }

    const imageRecord = toRecord(image);
    const url = getStringValue(
      imageRecord?.src,
      imageRecord?.url,
      imageRecord?.image,
      imageRecord?.imageUrl,
      imageRecord?.secure_url,
    );

    if (url) {
      return url;
    }
  }

  return null;
}

function resolveImageUrl(url: string | null) {
  if (!url) {
    return PRODUCT_IMAGE_PLACEHOLDER;
  }

  if (/^(https?:)?\/\//i.test(url) || url.startsWith("data:")) {
    return url;
  }

  try {
    return new URL(url, process.env.BASE_URL || FALLBACK_BASE_URL).toString();
  } catch {
    return PRODUCT_IMAGE_PLACEHOLDER;
  }
}

function extractCartItems(data: unknown): unknown[] {
  if (Array.isArray(data)) {
    return data;
  }

  const dataRecord = toRecord(data);

  if (!dataRecord) {
    return [];
  }

  const candidates = [
    dataRecord.items,
    dataRecord.cartItems,
    dataRecord.products,
    dataRecord.rows,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
}

function mapCartItem(item: unknown): CartItemSummary | null {
  const itemRecord = toRecord(item);

  if (!itemRecord) {
    return null;
  }

  const productRecord = toRecord(itemRecord.product);
  const variantOptions = toArray(itemRecord.variantOptions);
  const quantity =
    Math.max(
      1,
      Math.trunc(
        getNumberValue(itemRecord.quantity, itemRecord.qty, itemRecord.count) ?? 1,
      ),
    ) || 1;

  const variantOptionIdsFromItem = toArray(itemRecord.variantOptionIds).filter(
    (value): value is string => typeof value === "string" && value.trim().length > 0,
  );
  const variantOptionIdsFromOptions = variantOptions
    .map((option) => getStringValue(toRecord(option)?.id))
    .filter((value): value is string => Boolean(value));
  const variantOptionIds =
    variantOptionIdsFromItem.length > 0
      ? variantOptionIdsFromItem
      : variantOptionIdsFromOptions;

  const variantLabel =
    getStringValue(itemRecord.variant, itemRecord.variantLabel) ||
    variantOptions
      .map((option) =>
        getStringValue(
          toRecord(option)?.title,
          toRecord(option)?.name,
          toRecord(option)?.sku,
        ),
      )
      .filter((value): value is string => Boolean(value))
      .join(" / ") ||
    undefined;

  const unitPrice =
    getNumberValue(itemRecord.unitPrice, itemRecord.price, itemRecord.salePrice) ??
    (() => {
      const lineTotal = getNumberValue(
        itemRecord.totalPrice,
        itemRecord.subtotal,
        itemRecord.lineTotal,
      );

      if (lineTotal !== null) {
        return lineTotal / quantity;
      }

      const basePrice = getNumberValue(productRecord?.price) ?? 0;
      const optionPrices = variantOptions.reduce((sum, option) => {
        return sum + (getNumberValue(toRecord(option)?.price) ?? 0);
      }, 0);

      return basePrice + optionPrices;
    })();

  const imageUrl = resolveImageUrl(
    getStringValue(
      itemRecord.image,
      itemRecord.imageUrl,
      itemRecord.thumbnail,
      productRecord?.image,
      productRecord?.imageUrl,
      productRecord?.thumbnail,
      getImageUrlFromImages(toArray(itemRecord.images)),
      getImageUrlFromImages(toArray(productRecord?.images)),
      ...variantOptions.map((option) =>
        getStringValue(
          toRecord(option)?.image,
          toRecord(option)?.imageUrl,
          toRecord(option)?.thumbnail,
          getImageUrlFromImages(toArray(toRecord(option)?.images)),
        ),
      ),
    ),
  );

  const productId =
    getStringValue(itemRecord.productId, productRecord?.id) || "unknown-product";
  const itemId =
    getStringValue(itemRecord.id, itemRecord.cartItemId) ||
    `${productId}-${variantOptionIds.join("-") || "base"}`;
  const title =
    getStringValue(itemRecord.title, productRecord?.title) || "Cart item";

  return {
    id: itemId,
    productId,
    title,
    variant: variantLabel,
    image: imageUrl,
    price: unitPrice,
    quantity,
    variantOptionIds,
  };
}

export async function getCart(): Promise<GetCartResult> {
  try {
    const accessToken = await getCookie("accessToken");
    const refreshToken = await getCookie("refreshToken");

    if (!accessToken) {
      return {
        items: [],
        error: null,
      };
    }

    const baseUrl = process.env.BASE_URL || FALLBACK_BASE_URL;
    const url = new URL("api/cart", baseUrl);

    for (let attempt = 1; attempt <= MAX_GET_CART_ATTEMPTS; attempt += 1) {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: getRequestAuthHeaders(accessToken, refreshToken),
        cache: "no-store",
      });

      const result = (await response.json().catch(() => null)) as
        | CartApiResponse
        | null;
      const rawMessage = result?.message || null;

      if (!response.ok || result?.success === false) {
        const shouldRetry =
          attempt < MAX_GET_CART_ATTEMPTS && isRetryableCartError(rawMessage);

        if (shouldRetry) {
          await wait(250 * attempt);
          continue;
        }

        return {
          items: [],
          error: rawMessage || "Unable to load your cart right now.",
        };
      }

      return {
        items: extractCartItems(result?.data)
          .map(mapCartItem)
          .filter((item): item is CartItemSummary => Boolean(item)),
        error: null,
      };
    }

    return {
      items: [],
      error: "Unable to load your cart right now.",
    };
  } catch (error) {
    const rawMessage =
      error instanceof Error ? error.message : "Unable to load your cart right now.";

    return {
      items: [],
      error: rawMessage,
    };
  }
}
