import {
  extractProductReviewsPayload,
  getReviewApiUrl,
  mapReviewMeta,
  parseReviewApiResponse,
} from "./review-api";
import type { GetProductReviewsResult } from "./review-types";

type ProductReviewsQuery = {
  page?: number;
  limit?: number;
  sort?: string;
};

export async function getProductReviews(
  productId: string,
  query: ProductReviewsQuery = {},
): Promise<GetProductReviewsResult> {
  const normalizedProductId = productId.trim();

  if (!normalizedProductId) {
    return {
      reviews: [],
      summary: {
        totalReviews: 0,
        averageRating: 0,
        ratingBreakdown: [5, 4, 3, 2, 1].map((rating) => ({ rating, count: 0 })),
      },
      meta: null,
      error: "Product id is required to load reviews.",
    };
  }

  try {
    const url = new URL(
      getReviewApiUrl(`api/review/product/${encodeURIComponent(normalizedProductId)}`),
    );

    if (query.page !== undefined) {
      url.searchParams.set("page", String(query.page));
    }

    if (query.limit !== undefined) {
      url.searchParams.set("limit", String(query.limit));
    }

    if (query.sort?.trim()) {
      url.searchParams.set("sort", query.sort.trim());
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const result = await parseReviewApiResponse(response);

    if (!response.ok || result?.success === false) {
      return {
        reviews: [],
        summary: {
          totalReviews: 0,
          averageRating: 0,
          ratingBreakdown: [5, 4, 3, 2, 1].map((rating) => ({ rating, count: 0 })),
        },
        meta: null,
        error: result?.message || "Unable to load product reviews right now.",
      };
    }

    const payload = extractProductReviewsPayload(result?.data);

    return {
      reviews: payload.reviews,
      summary: payload.summary,
      meta: mapReviewMeta(result?.meta),
      error: null,
    };
  } catch (error) {
    return {
      reviews: [],
      summary: {
        totalReviews: 0,
        averageRating: 0,
        ratingBreakdown: [5, 4, 3, 2, 1].map((rating) => ({ rating, count: 0 })),
      },
      meta: null,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load product reviews right now.",
    };
  }
}
