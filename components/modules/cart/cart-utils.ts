import type { CartItemSummary } from "@/services/cart/cart-types";
import type { CartStep } from "./types";

export const cartSteps: Array<{ key: CartStep; label: string }> = [
  { key: "cart", label: "My Cart" },
  { key: "checkout", label: "Checkout" },
  { key: "complete", label: "Order Complete" },
];

const CHECKOUT_SHIPPING_COST = 100;

export function formatCartMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function getCartSummary(items: CartItemSummary[]) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = items.length > 0 ? CHECKOUT_SHIPPING_COST : 0;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;

  return {
    subtotal,
    shipping,
    tax,
    total: subtotal + shipping + tax,
  };
}

export function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}
