import type {
  AdminReview,
  ProductReview,
  ProductReviewSummary,
  ReviewAdmin,
  ReviewMeta,
  ReviewProduct,
  ReviewUser,
} from "./review-types";

export const REVIEW_FALLBACK_BASE_URL =
  "https://e-commerce-backend-491.vercel.app/";

type ReviewApiResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
  meta?: unknown;
};

const EMPTY_BREAKDOWN = [5, 4, 3, 2, 1].map((rating) => ({
  rating,
  count: 0,
}));

export function getReviewApiUrl(path = "api/review") {
  return new URL(path, process.env.BASE_URL || REVIEW_FALLBACK_BASE_URL).toString();
}

export function getRequestAuthHeaders(
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

export async function parseReviewApiResponse(
  response: Response,
): Promise<ReviewApiResponse | null> {
  return (await response.json().catch(() => null)) as ReviewApiResponse | null;
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

  return "";
}

function getNullableStringValue(...values: unknown[]) {
  const value = getStringValue(...values);
  return value || null;
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

  return 0;
}

function getBooleanValue(value: unknown, fallback = false) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    if (value === "true") {
      return true;
    }

    if (value === "false") {
      return false;
    }
  }

  return fallback;
}

function mapReviewUser(value: unknown): ReviewUser {
  const record = toRecord(value);

  return {
    id: getStringValue(record?.id) || "unknown-user",
    name: getStringValue(record?.name) || "Anonymous user",
    email: getNullableStringValue(record?.email),
    image: getNullableStringValue(record?.image),
  };
}

function mapReviewProduct(value: unknown): ReviewProduct {
  const record = toRecord(value);

  return {
    id: getStringValue(record?.id) || "unknown-product",
    title: getStringValue(record?.title) || "Untitled product",
    slug: getStringValue(record?.slug) || "",
  };
}

function mapReviewAdmin(value: unknown): ReviewAdmin | null {
  const record = toRecord(value);

  if (!record) {
    return null;
  }

  return {
    id: getStringValue(record.id),
    name: getStringValue(record.name) || "Admin",
    email: getNullableStringValue(record.email),
  };
}

export function mapReviewMeta(value: unknown): ReviewMeta | null {
  const record = toRecord(value);

  if (!record) {
    return null;
  }

  return {
    page: Math.max(1, Math.trunc(getNumberValue(record.page) || 1)),
    limit: Math.max(1, Math.trunc(getNumberValue(record.limit) || 20)),
    total: Math.max(0, Math.trunc(getNumberValue(record.total) || 0)),
    totalPage: Math.max(1, Math.trunc(getNumberValue(record.totalPage) || 1)),
  };
}

function mapReviewSummary(value: unknown): ProductReviewSummary {
  const record = toRecord(value);
  const rawBreakdown = toArray(record?.ratingBreakdown);

  const normalizedBreakdown = rawBreakdown
    .map((item) => {
      const itemRecord = toRecord(item);

      if (!itemRecord) {
        return null;
      }

      const rating = Math.trunc(getNumberValue(itemRecord.rating));

      if (rating < 1 || rating > 5) {
        return null;
      }

      return {
        rating,
        count: Math.max(0, Math.trunc(getNumberValue(itemRecord.count))),
      };
    })
    .filter(
      (
        item,
      ): item is {
        rating: number;
        count: number;
      } => Boolean(item),
    );

  const breakdownByRating = new Map<number, number>();
  normalizedBreakdown.forEach((item) => {
    breakdownByRating.set(item.rating, item.count);
  });

  return {
    totalReviews: Math.max(0, Math.trunc(getNumberValue(record?.totalReviews))),
    averageRating: Number(getNumberValue(record?.averageRating).toFixed(2)),
    ratingBreakdown: EMPTY_BREAKDOWN.map((item) => ({
      rating: item.rating,
      count: breakdownByRating.get(item.rating) ?? 0,
    })),
  };
}

export function extractProductReviewsPayload(data: unknown): {
  reviews: ProductReview[];
  summary: ProductReviewSummary;
} {
  const record = toRecord(data);
  const reviews = toArray(record?.reviews)
    .map(mapProductReview)
    .filter((review): review is ProductReview => Boolean(review));

  return {
    reviews,
    summary: mapReviewSummary(record?.summary),
  };
}

export function extractReviewItems(data: unknown): unknown[] {
  if (Array.isArray(data)) {
    return data;
  }

  const record = toRecord(data);

  if (!record) {
    return [];
  }

  const candidates = [record.reviews, record.items, record.rows, record.data];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
}

export function mapProductReview(value: unknown): ProductReview | null {
  const record = toRecord(value);

  if (!record) {
    return null;
  }

  const id = getStringValue(record.id);
  const productId = getStringValue(record.productId);

  if (!id || !productId) {
    return null;
  }

  return {
    id,
    productId,
    rating: Math.min(5, Math.max(1, Math.trunc(getNumberValue(record.rating) || 1))),
    title: getNullableStringValue(record.title),
    comment: getNullableStringValue(record.comment),
    isVerifiedPurchase: getBooleanValue(record.isVerifiedPurchase),
    helpfulVotes: Math.max(0, Math.trunc(getNumberValue(record.helpfulVotes))),
    notHelpfulVotes: Math.max(0, Math.trunc(getNumberValue(record.notHelpfulVotes))),
    adminReply: getNullableStringValue(record.adminReply),
    adminRepliedAt: getNullableStringValue(record.adminRepliedAt),
    createdAt: getStringValue(record.createdAt),
    updatedAt: getStringValue(record.updatedAt),
    user: mapReviewUser(record.user),
  };
}

export function mapAdminReview(value: unknown): AdminReview | null {
  const record = toRecord(value);
  const baseReview = mapProductReview(value);

  if (!record || !baseReview) {
    return null;
  }

  return {
    ...baseReview,
    userId: getStringValue(record.userId) || baseReview.user.id,
    isApproved: getBooleanValue(record.isApproved),
    adminRepliedBy: getNullableStringValue(record.adminRepliedBy),
    product: mapReviewProduct(record.product),
    admin: mapReviewAdmin(record.admin),
  };
}
