"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { formatCartMoney } from "./cart-utils";
import type { CartStep } from "./types";

type CartSummaryCardProps = {
  step: CartStep;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  isLoading: boolean;
  isSubmittingOrder?: boolean;
  hasItems: boolean;
  onProceedToCheckout: () => void;
  onPayNow: () => void;
  onContinueShopping: () => void;
};

export function CartSummaryCard({
  step,
  subtotal,
  shipping,
  tax,
  total,
  isLoading,
  isSubmittingOrder = false,
  hasItems,
  onProceedToCheckout,
  onPayNow,
  onContinueShopping,
}: CartSummaryCardProps) {
  return (
    <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-slate-900">Order Summary</h3>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Subtotal</span>
          {isLoading && !hasItems ? (
            <Skeleton className="h-4 w-20 rounded-full" />
          ) : (
            <span className="font-medium text-slate-900">
              {formatCartMoney(subtotal)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Shipping</span>
          {isLoading && !hasItems ? (
            <Skeleton className="h-4 w-20 rounded-full" />
          ) : (
            <span className="font-medium text-slate-900">
              {formatCartMoney(shipping)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Tax</span>
          {isLoading && !hasItems ? (
            <Skeleton className="h-4 w-20 rounded-full" />
          ) : (
            <span className="font-medium text-slate-900">
              {formatCartMoney(tax)}
            </span>
          )}
        </div>

        <div className="my-3 h-px bg-slate-200" />

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-900">Total</span>
          {isLoading && !hasItems ? (
            <Skeleton className="h-5 w-24 rounded-full" />
          ) : (
            <span className="text-sm font-semibold text-blue-600">
              {formatCartMoney(total)}
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {step === "cart" ? (
          <button
            type="button"
            disabled={isLoading || !hasItems}
            onClick={onProceedToCheckout}
            className={`h-11 w-full rounded-md text-sm font-semibold text-white transition ${
              isLoading || !hasItems
                ? "cursor-not-allowed bg-slate-300"
                : "bg-slate-900 hover:bg-slate-800 active:scale-[0.99]"
            }`}
          >
            Proceed to order
          </button>
        ) : null}

        {step === "checkout" ? (
          <button
            type="button"
            disabled={isSubmittingOrder}
            onClick={onPayNow}
            className={`h-11 w-full rounded-md text-sm font-semibold text-white transition active:scale-[0.99] ${
              isSubmittingOrder
                ? "cursor-not-allowed bg-blue-300"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmittingOrder ? "Placing order..." : "Pay now"}
          </button>
        ) : null}

        {step === "complete" ? (
          <button
            type="button"
            onClick={onContinueShopping}
            className="h-11 w-full rounded-md bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Continue shopping
          </button>
        ) : null}

        <p className="text-xs text-slate-500">Shipping and tax are estimated.</p>
      </div>
    </div>
  );
}
