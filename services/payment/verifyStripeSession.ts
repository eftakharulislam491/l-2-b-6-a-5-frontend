"use server";

import { getCookie } from "@/services/auth/tokenHandlers";
import {
  getPaymentApiUrl,
  getRequestAuthHeaders,
  parseOrderApiResponse,
} from "./payment-api";

type VerifyStripeSessionResult = {
  success: boolean;
  message: string;
};

function toRecord(value: unknown) {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

export async function verifyStripeSession(
  sessionId: string,
): Promise<VerifyStripeSessionResult> {
  const normalizedSessionId = sessionId.trim();
  const accessToken = await getCookie("accessToken");
  const refreshToken = await getCookie("refreshToken");

  if (!accessToken) {
    return {
      success: false,
      message: "Please log in to verify payment.",
    };
  }

  if (!normalizedSessionId) {
    return {
      success: false,
      message: "Stripe session id is missing.",
    };
  }

  try {
    const response = await fetch(getPaymentApiUrl("api/payment/stripe/verify"), {
      method: "POST",
      headers: getRequestAuthHeaders(accessToken, refreshToken, "application/json"),
      body: JSON.stringify({ sessionId: normalizedSessionId }),
      cache: "no-store",
    });
    const result = (await parseOrderApiResponse(response)) as
      | { success?: boolean; message?: string; data?: unknown }
      | null;
    const resultData = toRecord(result?.data);
    const verificationSuccess =
      typeof resultData?.success === "boolean"
        ? resultData.success
        : Boolean(result?.success);

    if (!response.ok || result?.success === false) {
      return {
        success: false,
        message: result?.message || "Unable to verify Stripe payment.",
      };
    }

    if (!verificationSuccess) {
      return {
        success: false,
        message: result?.message || "Stripe payment is not completed.",
      };
    }

    return {
      success: true,
      message: result?.message || "Stripe payment verified successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unable to verify Stripe payment.",
    };
  }
}
