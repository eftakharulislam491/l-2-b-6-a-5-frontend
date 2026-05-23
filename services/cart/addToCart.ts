"use server";

import { getCookie } from "../auth/tokenHandlers";
import type { AddToCartPayload } from "./cart-types";

const FALLBACK_BASE_URL = "https://e-commerce-backend-491.vercel.app/";
const MAX_ADD_TO_CART_ATTEMPTS = 2;
const RETRYABLE_CART_ERROR_PATTERN =
  /expired transaction|transaction api error|interactive transaction timeout|timed out/i;

type CartMutationApiResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
};

export type AddToCartResult = {
  success: boolean;
  message: string;
  requiresAuth?: boolean;
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

function normalizeCartErrorMessage(message: string | null | undefined) {
  if (!message) {
    return "Unable to add this item to your cart.";
  }

  if (isRetryableCartError(message)) {
    return "Cart service took too long to respond. Please try adding this item again.";
  }

  return message;
}

function getRequestAuthHeaders(
  accessToken: string,
  refreshToken: string | null,
  contentType?: string,
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
    ...(contentType ? { "Content-Type": contentType } : {}),
  };
}

export async function addToCart(
  payload: AddToCartPayload,
): Promise<AddToCartResult> {
  const accessToken = await getCookie("accessToken");
  const refreshToken = await getCookie("refreshToken");

  if (!accessToken) {
    return {
      success: false,
      message: "Please log in to add items to your cart.",
      requiresAuth: true,
    };
  }

  const normalizedVariantOptionIds =
    payload.variantOptionIds?.map((id) => id.trim()).filter(Boolean) ?? [];

  const requestPayload = {
    productId: payload.productId.trim(),
    variantOptionIds: normalizedVariantOptionIds,
    quantity: Math.max(1, Math.trunc(payload.quantity || 1)),
  };

  const baseUrl = process.env.BASE_URL || FALLBACK_BASE_URL;
  const url = new URL("api/cart/items", baseUrl);
  const headers = getRequestAuthHeaders(
    accessToken,
    refreshToken,
    "application/json",
  );

  for (let attempt = 1; attempt <= MAX_ADD_TO_CART_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(url.toString(), {
        method: "POST",
        headers,
        body: JSON.stringify(requestPayload),
        cache: "no-store",
      });

      const result = (await response.json().catch(() => null)) as
        | CartMutationApiResponse
        | null;
      const rawMessage = result?.message || null;

      if (response.status === 401 || response.status === 403) {
        return {
          success: false,
          message: rawMessage || "Please log in to add items to your cart.",
          requiresAuth: true,
        };
      }

      if (!response.ok || result?.success === false) {
        const shouldRetry =
          attempt < MAX_ADD_TO_CART_ATTEMPTS && isRetryableCartError(rawMessage);

        if (shouldRetry) {
          await wait(300 * attempt);
          continue;
        }

        return {
          success: false,
          message: normalizeCartErrorMessage(rawMessage),
        };
      }

      return {
        success: true,
        message: result?.message || "Item added to cart.",
      };
    } catch (error) {
      const rawMessage =
        error instanceof Error ? error.message : "Unable to add this item to your cart.";
      const shouldRetry =
        attempt < MAX_ADD_TO_CART_ATTEMPTS && isRetryableCartError(rawMessage);

      if (shouldRetry) {
        await wait(300 * attempt);
        continue;
      }

      return {
        success: false,
        message: normalizeCartErrorMessage(rawMessage),
      };
    }
  }

  return {
    success: false,
    message: "Unable to add this item to your cart.",
  };
}
