import type { OrderSummary } from "@/services/order/order-types";

export function formatOrderMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatOrderDate(value: string) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatOrderDateTime(value: string) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatOrderStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

export function getOrderStatusBadgeClass(status: string) {
  switch (status.toUpperCase()) {
    case "DELIVERED":
    case "COMPLETED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "PROCESSING":
    case "CONFIRMED":
    case "SHIPPED":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "CANCELLED":
    case "RETURNED":
    case "REFUNDED":
      return "border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
}

export function formatOrderAddress(order: OrderSummary) {
  if (!order.address) {
    return "-";
  }

  return [
    order.address.recipient,
    order.address.phone,
    order.address.street,
    [order.address.city, order.address.state, order.address.zipCode]
      .filter(Boolean)
      .join(", "),
    order.address.country,
  ]
    .filter(Boolean)
    .join(" | ");
}
