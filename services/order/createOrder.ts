"use server";

import { getCookie } from "../auth/tokenHandlers";
import {
  extractOrderItem,
  getOrderApiUrl,
  getRequestAuthHeaders,
  mapOrder,
  parseOrderApiResponse,
} from "./order-api";
import type { CreateOrderPayload, CreateOrderResult } from "./order-types";

const MAX_CREATE_ORDER_ATTEMPTS = 2;
const RETRYABLE_ORDER_ERROR_PATTERN =
  /expired transaction|transaction api error|interactive transaction timeout|timed out/i;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableOrderError(message: string | null | undefined) {
  if (!message) {
    return false;
  }

  return RETRYABLE_ORDER_ERROR_PATTERN.test(message);
}

function normalizeOrderErrorMessage(message: string | null | undefined) {
  if (!message) {
    return "Unable to create order right now.";
  }

  if (isRetryableOrderError(message)) {
    return "Order service took too long to respond. Please try again.";
  }

  return message;
}

function buildCreateOrderPayload(payload: CreateOrderPayload) {
  return {
    shippingAddressId: payload.shippingAddressId.trim(),
    paymentMethod: payload.paymentMethod,
    shippingCost: Math.max(0, payload.shippingCost),
    tax: Math.max(0, payload.tax),
  };
}

export async function createOrder(
  payload: CreateOrderPayload,
): Promise<CreateOrderResult> {
  const accessToken = await getCookie("accessToken");
  const refreshToken = await getCookie("refreshToken");

  if (!accessToken) {
    return {
      success: false,
      message: "Please log in to create an order.",
      order: null,
      orderId: null,
    };
  }

  if (!payload.shippingAddressId.trim()) {
    return {
      success: false,
      message: "Please select or create a delivery address.",
      order: null,
      orderId: null,
    };
  }

  const requestPayload = buildCreateOrderPayload(payload);

  for (let attempt = 1; attempt <= MAX_CREATE_ORDER_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(getOrderApiUrl(), {
        method: "POST",
        headers: getRequestAuthHeaders(
          accessToken,
          refreshToken,
          "application/json",
        ),
        body: JSON.stringify(requestPayload),
        cache: "no-store",
      });

      const result = await parseOrderApiResponse(response);
      const rawMessage = result?.message || null;

      if (!response.ok || result?.success === false) {
        const shouldRetry =
          attempt < MAX_CREATE_ORDER_ATTEMPTS && isRetryableOrderError(rawMessage);

        if (shouldRetry) {
          await wait(300 * attempt);
          continue;
        }

        return {
          success: false,
          message: normalizeOrderErrorMessage(rawMessage || "Order creation failed."),
          order: null,
          orderId: null,
        };
      }

      const order = mapOrder(extractOrderItem(result?.data));

      return {
        success: true,
        message: result?.message || "Order created successfully.",
        order,
        orderId: order?.id ?? null,
      };
    } catch (error) {
      const rawMessage =
        error instanceof Error ? error.message : "Unable to create order right now.";
      const shouldRetry =
        attempt < MAX_CREATE_ORDER_ATTEMPTS && isRetryableOrderError(rawMessage);

      if (shouldRetry) {
        await wait(300 * attempt);
        continue;
      }

      return {
        success: false,
        message: normalizeOrderErrorMessage(rawMessage),
        order: null,
        orderId: null,
      };
    }
  }

  return {
    success: false,
    message: "Unable to create order right now.",
    order: null,
    orderId: null,
  };
}
