import type { UserAddress } from "@/services/address/address-types";

export type OrderPaymentMethod = "CASH_ON_DELIVERY" | "STRIPE";

export const ORDER_STATUS_VALUES = [
  "PENDING",
  "PROCESSING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
  "REFUNDED",
] as const;

export type OrderStatus = (typeof ORDER_STATUS_VALUES)[number];

export type OrderListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type CreateOrderPayload = {
  shippingAddressId: string;
  paymentMethod: OrderPaymentMethod;
  shippingCost: number;
  tax: number;
};

export type OrderLineItem = {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  productImage: string;
  variantLabel: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  total: number;
};

export type OrderSummary = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: string;
  notes: string;
  adminNotes: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  discountTotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  tracking: string;
  itemCount: number;
  items: OrderLineItem[];
  placedAt: string;
  createdAt: string;
  address: UserAddress | null;
};

export type CreateOrderResult = {
  success: boolean;
  message: string;
  order: OrderSummary | null;
  orderId: string | null;
};

export type GetOrdersResult = {
  orders: OrderSummary[];
  meta: OrderListMeta | null;
  error: string | null;
};

export type GetSingleOrderResult = {
  order: OrderSummary | null;
  error: string | null;
};

export type UpdateOrderStatusPayload = {
  status: OrderStatus;
  note?: string;
};

export type UpdateOrderStatusResult = {
  success: boolean;
  message: string;
  order: OrderSummary | null;
};
