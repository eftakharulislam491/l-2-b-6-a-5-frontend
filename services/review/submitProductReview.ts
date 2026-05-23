"use server";

import { getCookie } from "@/services/auth/tokenHandlers";
import {
  getRequestAuthHeaders,
  getReviewApiUrl,
  parseReviewApiResponse,
} from "./review-api";

export type SubmitProductReviewState = {
  success: boolean;
  message: string;
};

function normalizeOptionalField(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();
  return trimmedValue ? trimmedValue : undefined;
}

export async function submitProductReview(
  _prevState: SubmitProductReviewState | null,
  formData: FormData,
): Promise<SubmitProductReviewState> {
  try {
    const productId = formData.get("productId")?.toString().trim() ?? "";
    const ratingValue = formData.get("rating")?.toString().trim() ?? "";
    const title = normalizeOptionalField(formData.get("title"));
    const comment = normalizeOptionalField(formData.get("comment"));

    if (!productId) {
      return {
        success: false,
        message: "Product id is missing. Please reload the page and try again.",
      };
    }

    const rating = Number.parseInt(ratingValue, 10);

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return {
        success: false,
        message: "Please select a rating between 1 and 5.",
      };
    }

    if (title && title.length > 255) {
      return {
        success: false,
        message: "Review title cannot exceed 255 characters.",
      };
    }

    if (comment && comment.length > 2000) {
      return {
        success: false,
        message: "Review comment cannot exceed 2000 characters.",
      };
    }

    const accessToken = await getCookie("accessToken");
    const refreshToken = await getCookie("refreshToken");

    if (!accessToken) {
      return {
        success: false,
        message: "Please log in as a user to submit a review.",
      };
    }

    const response = await fetch(getReviewApiUrl("api/review"), {
      method: "POST",
      headers: getRequestAuthHeaders(
        accessToken,
        refreshToken,
        "application/json",
      ),
      body: JSON.stringify({
        productId,
        rating,
        ...(title ? { title } : {}),
        ...(comment ? { comment } : {}),
      }),
      cache: "no-store",
    });

    const result = await parseReviewApiResponse(response);

    if (!response.ok || result?.success === false) {
      return {
        success: false,
        message: result?.message || "Unable to submit your review right now.",
      };
    }

    const successMessage = result?.message?.trim() || "Review submitted successfully.";

    return {
      success: true,
      message: successMessage,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to submit your review right now.",
    };
  }
}
