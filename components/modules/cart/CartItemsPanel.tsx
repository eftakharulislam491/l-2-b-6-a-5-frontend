"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, ShoppingBag } from "lucide-react";
import type { CartItemSummary } from "@/services/cart/cart-types";
import { formatCartMoney } from "./cart-utils";

type CartItemsPanelProps = {
  items: CartItemSummary[];
  itemCount: number;
  isLoading: boolean;
  onProceedToCheckout: () => void;
};
const PRODUCT_IMAGE_PLACEHOLDER = "/product/product-placeholder.svg";

export function CartItemsPanel({
  items,
  itemCount,
  isLoading,
  onProceedToCheckout,
}: CartItemsPanelProps) {
  const [failedImageByItemId, setFailedImageByItemId] = useState<
    Record<string, boolean>
  >({});

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-slate-700" />
          <h2 className="text-base font-semibold text-slate-900">My Cart</h2>
          {itemCount > 0 ? (
            <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-bold text-white">
              {itemCount}
            </span>
          ) : null}
        </div>

        <span className="text-xs font-medium text-slate-500">
          Live cart items
        </span>
      </div>

      <div className="border-t border-slate-100">
        {isLoading && items.length === 0 ? (
          <div className="grid min-h-48 place-items-center p-8 text-center">
            <div className="space-y-3">
              <Loader2 className="mx-auto h-7 w-7 animate-spin text-slate-700" />
              <p className="text-sm font-medium text-slate-700">
                Loading cart...
              </p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm font-medium text-slate-900">Your cart is empty</p>
            <p className="mt-1 text-sm text-slate-500">
              Add products from the catalog to see them here.
            </p>
            <Link
              href="/products"
              className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 p-5">
                <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <img
                    src={ process.env.BASE_URL as string +
                      !item.image
                        ? PRODUCT_IMAGE_PLACEHOLDER
                        : item.image
                    }
                    alt={item.title + "dsf"}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onError={() => {
                      if (failedImageByItemId[item.id]) {
                        return;
                      }

                      setFailedImageByItemId((currentState) => ({
                        ...currentState,
                        [item.id]: true,
                      }));
                    }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm font-semibold text-slate-900">
                        {item.title}
                      </p>
                      {item.variant ? (
                        <p className="mt-1 text-xs text-slate-500">{item.variant}</p>
                      ) : null}
                    </div>

                    <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      Qty {item.quantity}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-xs text-slate-400">
                      {formatCartMoney(item.price)} each
                    </p>
                    <p className="text-sm font-semibold text-blue-600">
                      {formatCartMoney(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 p-5">
        <button
          type="button"
          disabled={isLoading || items.length === 0}
          onClick={onProceedToCheckout}
          className={`h-11 w-full rounded-md text-sm font-semibold text-white transition ${
            isLoading || items.length === 0
              ? "cursor-not-allowed bg-slate-300"
              : "bg-slate-900 hover:bg-slate-800 active:scale-[0.99]"
          }`}
        >
          Proceed to order
        </button>
      </div>
    </div>
  );
}
