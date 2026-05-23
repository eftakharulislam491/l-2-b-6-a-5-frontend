"use server";

import { getCookie } from "@/services/auth/tokenHandlers";
import {
  getPaymentApiUrl,
  getRequestAuthHeaders,
  parseOrderApiResponse,
} from "./payment-api";

type InitiatePaymentResult = {
  success: boolean;
  message: string;
  requiresRedirect: boolean;
  gatewayPageUrl: string | null;
};

function toRecord(value: unknown) {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function getGatewayPayload(value: unknown) {
  const record = toRecord(value);
  if (!record) {
    return {
      requiresRedirect: false,
      gatewayPageUrl: null,
    };
  }

  return {
    requiresRedirect: Boolean(record.requiresRedirect),
    gatewayPageUrl:
      typeof record.gatewayPageUrl === "string" && record.gatewayPageUrl.trim()
        ? record.gatewayPageUrl
        : null,
  };
}

export async function initiatePayment(
  orderId: string,
): Promise<InitiatePaymentResult> {
  const normalizedOrderId = orderId.trim();
  const accessToken = await getCookie("accessToken");
  const refreshToken = await getCookie("refreshToken");

  if (!accessToken) {
    return {
      success: false,
      message: "Please log in to continue payment.",
      requiresRedirect: false,
      gatewayPageUrl: null,
    };
  }

  if (!normalizedOrderId) {
    return {
      success: false,
      message: "Order id is required to initiate payment.",
      requiresRedirect: false,
      gatewayPageUrl: null,
    };
  }

  try {
    const response = await fetch(
      getPaymentApiUrl(`api/payment/${encodeURIComponent(normalizedOrderId)}/initiate`),
      {
        method: "POST",
        headers: getRequestAuthHeaders(accessToken, refreshToken, "application/json"),
        body: JSON.stringify({}),
        cache: "no-store",
      },
    );
    const result = (await parseOrderApiResponse(response)) as
      | { success?: boolean; message?: string; data?: unknown }
      | null;

    if (!response.ok || result?.success === false) {
      return {
        success: false,
        message: result?.message || "Unable to initiate payment right now.",
        requiresRedirect: false,
        gatewayPageUrl: null,
      };
    }

    const gatewayPayload = getGatewayPayload(result?.data);

    return {
      success: true,
      message: result?.message || "Payment initiated successfully.",
      ...gatewayPayload,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to initiate payment right now.",
      requiresRedirect: false,
      gatewayPageUrl: null,
    };
  }
}
