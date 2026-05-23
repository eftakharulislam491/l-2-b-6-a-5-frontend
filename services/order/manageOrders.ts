"use server";

import { getCookie } from "../auth/tokenHandlers";
import {
  extractOrderItem,
  getOrderApiUrl,
  getRequestAuthHeaders,
  mapOrder,
  parseOrderApiResponse,
} from "./order-api";
import type {
  UpdateOrderStatusPayload,
  UpdateOrderStatusResult,
} from "./order-types";

function buildStatusUpdatePayload(payload: UpdateOrderStatusPayload) {
  const status = payload.status.trim().toUpperCase();
  const note = payload.note?.trim();

  return {
    status,
    ...(note ? { note } : {}),
  };
}

export async function updateAdminOrderStatus(
  orderId: string,
  payload: UpdateOrderStatusPayload,
): Promise<UpdateOrderStatusResult> {
  try {
    const accessToken = await getCookie("accessToken");
    const refreshToken = await getCookie("refreshToken");
    const normalizedOrderId = orderId.trim();

    if (!accessToken) {
      return {
        success: false,
        message: "Please log in as admin to update order status.",
        order: null,
      };
    }

    if (!normalizedOrderId) {
      return {
        success: false,
        message: "Order id is required.",
        order: null,
      };
    }

    const response = await fetch(
      getOrderApiUrl(`api/order/${encodeURIComponent(normalizedOrderId)}/status`),
      {
        method: "PATCH",
        headers: getRequestAuthHeaders(
          accessToken,
          refreshToken,
          "application/json",
        ),
        body: JSON.stringify(buildStatusUpdatePayload(payload)),
        cache: "no-store",
      },
    );

    const result = await parseOrderApiResponse(response);

    if (!response.ok || result?.success === false) {
      return {
        success: false,
        message: result?.message || "Unable to update order status right now.",
        order: null,
      };
    }

    return {
      success: true,
      message: result?.message || "Order status updated successfully.",
      order: mapOrder(extractOrderItem(result?.data)),
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update order status right now.",
      order: null,
    };
  }
}
