"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import type { OrderSummary } from "@/services/order/order-types";
import { formatCartMoney } from "./cart-utils";

type CartCompletePanelProps = {
  order: OrderSummary | null;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  onBackToCart: () => void;
};

export function CartCompletePanel({
  order,
  subtotal,
  shipping,
  tax,
  total,
  onBackToCart,
}: CartCompletePanelProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-green-200 bg-green-50 text-green-700">
          <Check className="h-6 w-6" />
        </div>

        <h2 className="mt-4 text-xl font-semibold text-slate-900">
          Order complete
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Thanks! Your order has been placed. You can continue shopping or return to
          the cart.
        </p>

        {order ? (
          <div className="mt-4 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            Order #{order.orderNumber}
          </div>
        ) : null}

        <div className="mt-6 rounded-xl border border-slate-200 p-4 text-left">
          <p className="text-sm font-semibold text-slate-900">Order summary</p>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Items</span>
              <span className="font-medium text-slate-900">
                {formatCartMoney(subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Shipping</span>
              <span className="font-medium text-slate-900">
                {formatCartMoney(shipping)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Tax</span>
              <span className="font-medium text-slate-900">
                {formatCartMoney(tax)}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-sm">
              <span className="font-semibold text-slate-900">Total</span>
              <span className="font-semibold text-blue-600">
                {formatCartMoney(total)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onBackToCart}
            className="h-11 flex-1 rounded-md border border-slate-200 bg-white text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            Back to cart
          </button>

          <Link
            href="/products"
            className="inline-flex h-11 flex-1 items-center justify-center rounded-md bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
