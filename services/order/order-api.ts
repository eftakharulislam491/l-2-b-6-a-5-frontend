import { mapAddress } from "@/services/address/address-api";
import type { OrderLineItem, OrderSummary } from "./order-types";

export const FALLBACK_BASE_URL = "https://e-commerce-backend-491.vercel.app/";

type OrderApiResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
  meta?: unknown;
};

export function getOrderApiUrl(path = "api/order") {
  return new URL(path, process.env.BASE_URL || FALLBACK_BASE_URL).toString();
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

export async function parseOrderApiResponse(
  response: Response,
): Promise<OrderApiResponse | null> {
  return (await response.json().catch(() => null)) as OrderApiResponse | null;
}

function toRecord(value: unknown) {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function getStringValue(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }

  return "";
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

function toArray(value: unknown) {
  return Array.isArray(value) ? value : [];
}

export function mapOrderMeta(value: unknown) {
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

export function extractOrderItems(data: unknown): unknown[] {
  if (Array.isArray(data)) {
    return data;
  }

  const dataRecord = toRecord(data);

  if (!dataRecord) {
    return [];
  }

  const candidates = [
    dataRecord.orders,
    dataRecord.items,
    dataRecord.rows,
    dataRecord.results,
    dataRecord.data,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
}

export function extractOrderItem(data: unknown): unknown {
  const dataRecord = toRecord(data);

  if (!dataRecord) {
    return data;
  }

  return (
    dataRecord.order ||
    dataRecord.result ||
    dataRecord.item ||
    dataRecord.data ||
    data
  );
}

function getOrderItemCount(value: unknown) {
  const items = toArray(value);

  return items.reduce((sum, item) => {
    const itemRecord = toRecord(item);
    const quantity = getNumberValue(itemRecord?.quantity);

    return sum + Math.max(1, Math.trunc(quantity || 1));
  }, 0);
}

function getVariantLabel(itemRecord: Record<string, unknown>) {
  const variantSnapshot = toRecord(itemRecord.variantSnapshot);
  const selectedOptions = toArray(variantSnapshot?.selectedOptions);
  const labels = selectedOptions
    .map((option) => {
      const optionRecord = toRecord(option);

      return getStringValue(optionRecord?.variantTitle, optionRecord?.optionSku);
    })
    .filter(Boolean);

  if (labels.length) {
    return labels.join(" / ");
  }

  const optionRecord = toRecord(itemRecord.option);
  const variantRecord = toRecord(optionRecord?.variant);

  return getStringValue(variantRecord?.title, optionRecord?.sku);
}

function mapOrderLineItem(item: unknown): OrderLineItem | null {
  const itemRecord = toRecord(item);

  if (!itemRecord) {
    return null;
  }

  const id = getStringValue(itemRecord.id);

  if (!id) {
    return null;
  }

  return {
    id,
    productId: getStringValue(itemRecord.productId),
    productName: getStringValue(itemRecord.productName) || "Order item",
    productSku: getStringValue(itemRecord.productSku),
    productImage: getStringValue(itemRecord.productImage),
    variantLabel: getVariantLabel(itemRecord),
    quantity: Math.max(1, Math.trunc(getNumberValue(itemRecord.quantity) || 1)),
    unitPrice: getNumberValue(itemRecord.unitPrice),
    discountAmount: getNumberValue(itemRecord.discountAmount),
    total: getNumberValue(itemRecord.total),
  };
}

export function mapOrder(item: unknown): OrderSummary | null {
  const itemRecord = toRecord(item);

  if (!itemRecord) {
    return null;
  }

  const id = getStringValue(itemRecord.id, itemRecord._id, itemRecord.orderId);

  if (!id) {
    return null;
  }

  const addressRecord =
    toRecord(itemRecord.address) ||
    toRecord(itemRecord.shippingAddress) ||
    toRecord(itemRecord.deliveryAddress);
  const userRecord = toRecord(itemRecord.user);
  const paymentRecord = toRecord(itemRecord.payment);
  const placedAt = getStringValue(itemRecord.placedAt, itemRecord.createdAt);
  const orderItems = toArray(itemRecord.items)
    .map(mapOrderLineItem)
    .filter((orderItem): orderItem is OrderLineItem => Boolean(orderItem));

  return {
    id,
    orderNumber:
      getStringValue(itemRecord.orderNumber, itemRecord.orderNo, itemRecord.code) ||
      id,
    customerName: getStringValue(userRecord?.name, itemRecord.customerName),
    customerEmail: getStringValue(userRecord?.email, itemRecord.customerEmail),
    customerPhone: getStringValue(userRecord?.phone, itemRecord.customerPhone),
    status: getStringValue(itemRecord.status) || "Pending",
    notes: getStringValue(itemRecord.notes),
    adminNotes: getStringValue(itemRecord.adminNotes),
    paymentStatus:
      getStringValue(
        itemRecord.paymentStatus,
        itemRecord.payment_status,
        paymentRecord?.status,
      ) ||
      "Pending",
    paymentMethod: getStringValue(paymentRecord?.method, itemRecord.paymentMethod),
    subtotal: getNumberValue(itemRecord.subtotal),
    discountTotal: getNumberValue(itemRecord.discountTotal),
    shippingCost: getNumberValue(itemRecord.shippingCost),
    tax: getNumberValue(itemRecord.tax),
    total: getNumberValue(
      itemRecord.total,
      itemRecord.totalAmount,
      itemRecord.grandTotal,
    ),
    tracking: getStringValue(itemRecord.tracking, itemRecord.trackingNumber),
    itemCount:
      orderItems.reduce((sum, orderItem) => sum + orderItem.quantity, 0) ||
      getOrderItemCount(itemRecord.items),
    items: orderItems,
    placedAt,
    createdAt: getStringValue(itemRecord.createdAt, itemRecord.date, placedAt),
    address: addressRecord ? mapAddress(addressRecord) : null,
  };
}
