"use server";

import { getCookie } from "@/services/auth/tokenHandlers";
import {
  extractReviewItems,
  getRequestAuthHeaders,
  getReviewApiUrl,
  mapProductReview,
  parseReviewApiResponse,
} from "./review-api";
import type { ProductReview } from "./review-types";

type GetMyProductReviewResult = {
  review: ProductReview | null;
  error: string | null;
};

export async function getMyProductReview(
  productId: string,
): Promise<GetMyProductReviewResult> {
  const normalizedProductId = productId.trim();

  if (!normalizedProductId) {
    return {
      review: null,
      error: "Product id is required.",
    };
  }

  try {
    const accessToken = await getCookie("accessToken");
    const refreshToken = await getCookie("refreshToken");

    if (!accessToken) {
      return {
        review: null,
        error: null,
      };
    }

    const url = new URL(getReviewApiUrl("api/review/my-reviews"));
    url.searchParams.set("productId", normalizedProductId);
    url.searchParams.set("page", "1");
    url.searchParams.set("limit", "1");
    url.searchParams.set("sort", "-createdAt");

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: getRequestAuthHeaders(accessToken, refreshToken),
      cache: "no-store",
    });

    const result = await parseReviewApiResponse(response);

    if (!response.ok || result?.success === false) {
      return {
        review: null,
        error: result?.message || "Unable to load your review right now.",
      };
    }

    const review =
      extractReviewItems(result?.data)
        .map(mapProductReview)
        .find((item): item is ProductReview => Boolean(item)) ?? null;

    return {
      review,
      error: null,
    };
  } catch (error) {
    return {
      review: null,
      error:
        error instanceof Error ? error.message : "Unable to load your review right now.",
    };
  }
}
