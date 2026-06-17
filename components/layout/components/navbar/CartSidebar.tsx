"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { Loader2, Minus, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type CartItem = {
  id: string;
  title: string;
  image: string;
  variant?: string;
  price: number; // per item price
  quantity: number;
};

type CartSidebarProps = {
  children: ReactNode; // trigger button
  items?: CartItem[];
  isLoading?: boolean;
  onClear?: () => void;
  onCheckout?: () => void;
  onInc?: (id: string) => void;
  onDec?: (id: string) => void;
  onRemove?: (id: string) => void;
};

const PRODUCT_IMAGE_PLACEHOLDER = "/product/product-placeholder.svg";

function money(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export default function CartSidebar({
  children,
  items = [],
  isLoading = false,
  onClear,
  onCheckout,
  onInc,
  onDec,
  onRemove,
}: CartSidebarProps) {
  const [failedImageByItemId, setFailedImageByItemId] = useState<
    Record<string, boolean>
  >({});
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent
        side="right"
        className="w-full max-w-[420px] p-0 [&>button]:hidden"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <SheetHeader className="px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SheetTitle className="text-lg font-semibold">
                  My Cart
                </SheetTitle>
                {count > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-bold text-white">
                    {count}
                  </span>
                )}
              </div>

              <SheetClose asChild>
                <button
                  type="button"
                  aria-label="Close cart"
                  className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </SheetClose>
            </div>
          </SheetHeader>

          <Separator />

          {/* Items area */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading && items.length === 0 ? (
              <div className="flex h-full min-h-64 flex-col items-center justify-center gap-3 text-center">
                <Loader2 className="h-7 w-7 animate-spin text-slate-700" />
                <p className="text-sm font-medium text-slate-700">
                  Loading cart...
                </p>
              </div>
            ) : items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <p className="text-sm font-medium text-slate-900">
                  Your cart is empty
                </p>
                <p className="text-xs text-slate-500">
                  Add items to see them here.
                </p>
                <SheetClose asChild>
                  <Link
                    href="/products"
                    className="mt-2 inline-flex h-9 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800 transition"
                  >
                    Browse products
                  </Link>
                </SheetClose>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white">
                {items.map((item, idx) => (
                  <div key={item.id}>
                    <div className="flex gap-3 p-3">
                      {/*
                        Keep image rendering resilient:
                        if remote loading fails, swap to local placeholder.
                      */}
                      {/* image */}
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                        <img
                          src={
                            failedImageByItemId[item.id]
                              ? PRODUCT_IMAGE_PLACEHOLDER
                              : item.image || PRODUCT_IMAGE_PLACEHOLDER
                          }
                          alt={item.title}
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

                      {/* title + controls */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="line-clamp-2 text-sm font-medium text-slate-900">
                            {item.title}
                          </p>
                          {onRemove ? (
                            <button
                              type="button"
                              aria-label="Remove item"
                              onClick={() => onRemove(item.id)}
                              className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          ) : null}
                        </div>

                        {item.variant ? (
                          <p className="mt-1 text-xs text-slate-500">
                            {item.variant}
                          </p>
                        ) : null}

                        <div className="mt-2 flex items-center justify-between">
                          {/* qty */}
                          <div className="inline-flex items-center rounded-md border border-slate-200 bg-white">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() => onDec?.(item.id)}
                              disabled={!onDec}
                              className="h-8 w-8 grid place-items-center text-slate-600 hover:bg-slate-50 transition"
                            >
                              <Minus className="h-4 w-4" />
                            </button>

                            <div className="w-10 text-center text-sm font-medium text-slate-900">
                              {item.quantity}
                            </div>

                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() => onInc?.(item.id)}
                              disabled={!onInc}
                              className="h-8 w-8 grid place-items-center text-slate-600 hover:bg-slate-50 transition"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          {/* price */}
                          <p className="text-sm font-semibold text-blue-600">
                            {money(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {idx !== items.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Footer */}
          <div className="p-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-semibold text-slate-900">
                Subtotal
              </span>
              {isLoading && items.length === 0 ? (
                <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Loading
                </span>
              ) : (
                <span className="text-sm font-semibold text-blue-600">
                  {money(subtotal)}
                </span>
              )}
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={onClear}
                disabled={!onClear || items.length === 0 || (isLoading && items.length === 0)}
              >
                Clear Cart
              </Button>
              <SheetClose asChild>
                <Button
                  asChild
                  className="w-full bg-gray-200 text-black hover:bg-gray-300"
                >
                  <Link href="/cart" onClick={onCheckout}>
                    View Cart
                  </Link>
                </Button>
              </SheetClose>
              {isLoading && items.length === 0 ? (
                <Button
                  type="button"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled
                >
                  Checkout
                </Button>
              ) : (
                <SheetClose asChild>
                  <Button
                    asChild
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Link href="/cart" onClick={onCheckout}>
                      Checkout
                    </Link>
                  </Button>
                </SheetClose>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
