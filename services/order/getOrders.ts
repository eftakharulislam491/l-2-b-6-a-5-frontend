"use server";

import { getCookie } from "../auth/tokenHandlers";
import {
  extractOrderItem,
  extractOrderItems,
  getOrderApiUrl,
  getRequestAuthHeaders,
  mapOrder,
  mapOrderMeta,
  parseOrderApiResponse,
} from "./order-api";
import type {
  GetOrdersResult,
  GetSingleOrderResult,
  OrderSummary,
} from "./order-types";

type OrderQuery = {
  page?: number;
  limit?: number;
  sort?: string;
  searchTerm?: string;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  fromDate?: string;
  toDate?: string;
  userId?: string;
};

function buildOrderUrl(path: string, query?: OrderQuery) {
  const url = new URL(getOrderApiUrl(path));

  if (!query) {
    return url.toString();
  }

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    url.searchParams.set(key, String(value));
  }

  return url.toString();
}

async function requestOrders(
  path: string,
  accessToken: string,
  refreshToken: string | null,
  query?: OrderQuery,
) {
  const requestUrl = buildOrderUrl(path, query);

  try {
    const response = await fetch(requestUrl, {
      method: "GET",
      headers: getRequestAuthHeaders(accessToken, refreshToken),
      cache: "no-store",
    });

    const result = await parseOrderApiResponse(response);
    const meta = mapOrderMeta(result?.meta);

    if (!response.ok || result?.success === false) {
      return {
        orders: [] as OrderSummary[],
        meta,
        error: result?.message || "Unable to load orders right now.",
      };
    }

    return {
      orders: extractOrderItems(result?.data)
        .map(mapOrder)
        .filter((order): order is OrderSummary => Boolean(order)),
      meta,
      error: null,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load orders right now.";
    const isConnectionError = /Unable to connect|fetch failed|ECONNREFUSED|ENOTFOUND/i.test(
      message,
    );

    return {
      orders: [] as OrderSummary[],
      meta: null,
      error: isConnectionError
        ? `Orders API is unreachable at ${requestUrl}. Please ensure backend is running.`
        : message,
    };
  }
}

async function getAllPagedOrders(
  path: string,
  accessToken: string,
  refreshToken: string | null,
  query?: OrderQuery,
) {
  const initialResult = await requestOrders(path, accessToken, refreshToken, query);

  if (initialResult.error || !initialResult.meta || initialResult.meta.totalPage <= 1) {
    return initialResult;
  }

  const currentPage = query?.page ?? initialResult.meta.page;
  const remainingPages = Array.from(
    { length: Math.max(0, initialResult.meta.totalPage - currentPage) },
    (_, index) => currentPage + index + 1,
  );

  if (!remainingPages.length) {
    return initialResult;
  }

  const remainingResults = await Promise.all(
    remainingPages.map((page) =>
      requestOrders(path, accessToken, refreshToken, {
        ...query,
        page,
      }),
    ),
  );

  return {
    orders: [
      ...initialResult.orders,
      ...remainingResults.flatMap((result) => result.orders),
    ],
    meta: initialResult.meta,
    error:
      initialResult.error ||
      remainingResults.find((result) => result.error)?.error ||
      null,
  };
}

export async function getOrders(query?: OrderQuery): Promise<GetOrdersResult> {
  try {
    const accessToken = await getCookie("accessToken");
    const refreshToken = await getCookie("refreshToken");

    if (!accessToken) {
      return {
        orders: [],
        meta: null,
        error: "Please log in to load your orders.",
      };
    }

    return getAllPagedOrders("api/order/my-orders", accessToken, refreshToken, query);
  } catch (error) {
    return {
      orders: [],
      meta: null,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load your orders right now.",
    };
  }
}

export async function getAdminOrders(query?: OrderQuery): Promise<GetOrdersResult> {
  try {
    const accessToken = await getCookie("accessToken");
    const refreshToken = await getCookie("refreshToken");

    if (!accessToken) {
      return {
        orders: [],
        meta: null,
        error: "Please log in to load admin orders.",
      };
    }

    return getAllPagedOrders("api/order", accessToken, refreshToken, query);
  } catch (error) {
    return {
      orders: [],
      meta: null,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load admin orders right now.",
    };
  }
}

export async function getSingleOrder(
  orderId: string,
): Promise<GetSingleOrderResult> {
  try {
    const accessToken = await getCookie("accessToken");
    const refreshToken = await getCookie("refreshToken");
    const normalizedOrderId = orderId.trim();

    if (!accessToken) {
      return {
        order: null,
        error: "Please log in to load this order.",
      };
    }

    if (!normalizedOrderId) {
      return {
        order: null,
        error: "Order id is required.",
      };
    }

    const response = await fetch(
      getOrderApiUrl(`api/order/my-orders/${normalizedOrderId}`),
      {
        method: "GET",
        headers: getRequestAuthHeaders(accessToken, refreshToken),
        cache: "no-store",
      },
    );

    const result = await parseOrderApiResponse(response);

    if (!response.ok || result?.success === false) {
      return {
        order: null,
        error: result?.message || "Unable to load this order right now.",
      };
    }

    return {
      order: mapOrder(extractOrderItem(result?.data)),
      error: null,
    };
  } catch (error) {
    return {
      order: null,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load this order right now.",
    };
  }
}
