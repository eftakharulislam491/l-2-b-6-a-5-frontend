"use server";

import { getCookie } from "@/services/auth/tokenHandlers";
import {
  extractReviewItems,
  getRequestAuthHeaders,
  getReviewApiUrl,
  mapAdminReview,
  mapReviewMeta,
  parseReviewApiResponse,
} from "./review-api";
import type {
  GetAdminReviewsResult,
  ReviewMeta,
  ReviewMutationResult,
} from "./review-types";

type AdminReviewsQuery = {
  page?: number;
  limit?: number;
  sort?: string;
  searchTerm?: string;
  productId?: string;
  userId?: string;
  isApproved?: boolean;
  isVerifiedPurchase?: boolean;
  rating?: number;
  minRating?: number;
  maxRating?: number;
};

type MutationBody = Record<string, unknown> | null;

function buildAdminReviewsUrl(query: AdminReviewsQuery = {}) {
  const url = new URL(getReviewApiUrl("api/review"));

  const appendParam = (key: string, value: string | number | boolean | undefined) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    url.searchParams.set(key, String(value));
  };

  appendParam("page", query.page);
  appendParam("limit", query.limit);
  appendParam("sort", query.sort?.trim());
  appendParam("searchTerm", query.searchTerm?.trim());
  appendParam("productId", query.productId?.trim());
  appendParam("userId", query.userId?.trim());
  appendParam("isApproved", query.isApproved);
  appendParam("isVerifiedPurchase", query.isVerifiedPurchase);
  appendParam("rating", query.rating);
  appendParam("minRating", query.minRating);
  appendParam("maxRating", query.maxRating);

  return url;
}

async function getAdminAuthContext() {
  const accessToken = await getCookie("accessToken");
  const refreshToken = await getCookie("refreshToken");

  return { accessToken, refreshToken };
}

function getDefaultMeta(): ReviewMeta {
  return {
    page: 1,
    limit: 20,
    total: 0,
    totalPage: 1,
  };
}

export async function getAdminReviews(
  query: AdminReviewsQuery = {
    page: 1,
    limit: 100,
    sort: "-createdAt",
  },
): Promise<GetAdminReviewsResult> {
  try {
    const { accessToken, refreshToken } = await getAdminAuthContext();

    if (!accessToken) {
      return {
        reviews: [],
        meta: getDefaultMeta(),
        error: "Please log in as admin to load reviews.",
      };
    }

    const response = await fetch(buildAdminReviewsUrl(query).toString(), {
      method: "GET",
      headers: getRequestAuthHeaders(accessToken, refreshToken),
      cache: "no-store",
    });

    const result = await parseReviewApiResponse(response);

    if (!response.ok || result?.success === false) {
      return {
        reviews: [],
        meta: getDefaultMeta(),
        error: result?.message || "Unable to load admin reviews right now.",
      };
    }

    const reviews = extractReviewItems(result?.data)
      .map(mapAdminReview)
      .filter((review): review is NonNullable<typeof review> => Boolean(review));

    return {
      reviews,
      meta: mapReviewMeta(result?.meta) ?? getDefaultMeta(),
      error: null,
    };
  } catch (error) {
    return {
      reviews: [],
      meta: getDefaultMeta(),
      error:
        error instanceof Error
          ? error.message
          : "Unable to load admin reviews right now.",
    };
  }
}

async function requestAdminReviewMutation(
  path: string,
  method: "PATCH" | "DELETE",
  body: MutationBody = null,
): Promise<ReviewMutationResult> {
  try {
    const { accessToken, refreshToken } = await getAdminAuthContext();

    if (!accessToken) {
      return {
        success: false,
        message: "Please log in as admin to manage reviews.",
        review: null,
      };
    }

    const response = await fetch(getReviewApiUrl(path), {
      method,
      headers: getRequestAuthHeaders(
        accessToken,
        refreshToken,
        body ? "application/json" : undefined,
      ),
      ...(body ? { body: JSON.stringify(body) } : {}),
      cache: "no-store",
    });

    const result = await parseReviewApiResponse(response);

    if (!response.ok || result?.success === false) {
      return {
        success: false,
        message: result?.message || "Review operation failed.",
        review: null,
      };
    }

    return {
      success: true,
      message: result?.message || "Review updated successfully.",
      review: mapAdminReview(result?.data),
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Review operation failed.",
      review: null,
    };
  }
}

export async function moderateAdminReview(
  reviewId: string,
  payload: {
    isApproved?: boolean;
    isVerifiedPurchase?: boolean;
  },
): Promise<ReviewMutationResult> {
  const normalizedReviewId = reviewId.trim();

  if (!normalizedReviewId) {
    return {
      success: false,
      message: "Review id is required.",
      review: null,
    };
  }

  return requestAdminReviewMutation(
    `api/review/${encodeURIComponent(normalizedReviewId)}/moderate`,
    "PATCH",
    payload,
  );
}

export async function replyAdminReview(
  reviewId: string,
  adminReply: string | null,
): Promise<ReviewMutationResult> {
  const normalizedReviewId = reviewId.trim();

  if (!normalizedReviewId) {
    return {
      success: false,
      message: "Review id is required.",
      review: null,
    };
  }

  const normalizedReply = adminReply?.trim();

  return requestAdminReviewMutation(
    `api/review/${encodeURIComponent(normalizedReviewId)}/reply`,
    "PATCH",
    {
      adminReply: normalizedReply ? normalizedReply : null,
    },
  );
}

export async function deleteAdminReview(
  reviewId: string,
): Promise<Omit<ReviewMutationResult, "review">> {
  const normalizedReviewId = reviewId.trim();

  if (!normalizedReviewId) {
    return {
      success: false,
      message: "Review id is required.",
    };
  }

  const result = await requestAdminReviewMutation(
    `api/review/${encodeURIComponent(normalizedReviewId)}/admin`,
    "DELETE",
  );

  return {
    success: result.success,
    message: result.message,
  };
}
