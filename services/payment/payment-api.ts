import {
  FALLBACK_BASE_URL,
  getRequestAuthHeaders,
  parseOrderApiResponse,
} from "@/services/order/order-api";

export type PaymentApiResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
};

export function getPaymentApiUrl(path = "api/payment") {
  return new URL(path, process.env.BASE_URL || FALLBACK_BASE_URL).toString();
}

export { getRequestAuthHeaders, parseOrderApiResponse };
