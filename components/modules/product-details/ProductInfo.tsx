"use client";

import { Heart, ShoppingCart } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { useCart } from "@/components/providers/cart-provider";
import { formatCurrency } from "@/components/modules/product-catalog/catalog-utils";
import type { ProductDetailView } from "./product-detail-types";

type ProductInfoProps = {
  product: ProductDetailView;
};

export default function ProductInfo({ product }: ProductInfoProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, startAddToCartTransition] = useTransition();
  const [selectedOptionsByGroup, setSelectedOptionsByGroup] = useState<
    Record<string, string>
  >(() =>
    Object.fromEntries(
      product.variantGroups.map((group) => [
        group.id,
        group.options.find((option) => option.isActive)?.id || group.options[0]?.id || "",
      ]),
    ),
  );

  const selectedOptions = useMemo(
    () =>
      product.variantGroups
        .map((group) => {
          const selectedOptionId = selectedOptionsByGroup[group.id];

          return (
            group.options.find((option) => option.id === selectedOptionId) ||
            group.options[0] ||
            null
          );
        })
        .filter(
          (option): option is NonNullable<(typeof product.variantGroups)[number]["options"][number]> =>
            Boolean(option),
        ),
    [product, selectedOptionsByGroup],
  );

  const displayedPrice =
    product.basePrice +
    selectedOptions.reduce((sum, option) => sum + option.price, 0);
  const displayedCompareAtPrice =
    product.compareAtPrice !== null ||
    selectedOptions.some((option) => option.compareAtPrice !== null)
      ? (product.compareAtPrice ?? product.basePrice) +
        selectedOptions.reduce(
          (sum, option) => sum + (option.compareAtPrice ?? option.price),
          0,
        )
      : null;
  const discountPercentage =
    displayedCompareAtPrice && displayedCompareAtPrice > displayedPrice
      ? Math.round(
          ((displayedCompareAtPrice - displayedPrice) / displayedCompareAtPrice) * 100,
        )
      : null;
  const displayedStock = selectedOptions.length
    ? selectedOptions.reduce<number | null>((lowestStock, option) => {
        if (typeof option.stock !== "number") {
          return lowestStock;
        }

        if (lowestStock === null) {
          return option.stock;
        }

        return Math.min(lowestStock, option.stock);
      }, null) ?? product.stock
    : product.stock;
  const displayedSku =
    selectedOptions
      .map((option) => option.sku)
      .filter((value): value is string => Boolean(value))
      .join(" / ") || product.sku;
  const displayedBarcode =
    selectedOptions
      .map((option) => option.barcode)
      .filter((value): value is string => Boolean(value))
      .join(" / ") || product.barcode;
  const isAvailable =
    typeof displayedStock === "number" ? displayedStock > 0 : product.inStock;
  const isLowStock =
    typeof displayedStock === "number" &&
    displayedStock > 0 &&
    typeof product.lowStockThreshold === "number" &&
    displayedStock <= product.lowStockThreshold;

  const changeQuantity = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleVariantChange = (groupId: string, optionId: string) => {
    setSelectedOptionsByGroup((currentState) => ({
      ...currentState,
      [groupId]: optionId,
    }));
  };

  const handleAddToCart = () => {
    startAddToCartTransition(() => {
      void addItem({
        productId: product.id,
        variantOptionIds: selectedOptions.map((option) => option.id),
        quantity,
      });
    });
  };

  return (
    <section className="w-full min-w-0 space-y-5 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:space-y-6 sm:p-6 xl:p-8">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isAvailable
                ? "bg-emerald-100 text-emerald-800"
                : "bg-rose-100 text-rose-800"
            }`}
          >
            {isAvailable ? "In Stock" : "Out of Stock"}
          </span>

          {product.isFeatured ? (
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
              Featured
            </span>
          ) : null}

          {product.isDigital ? (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              Digital
            </span>
          ) : null}
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold leading-tight text-slate-900 sm:text-3xl xl:text-[2.5rem]">
            {product.title}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            {product.shortDesc ||
              "Short description is not available for this product yet."}
          </p>
        </div>
      </div>

      <div className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-3">
        <div className="rounded-xl bg-white px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Brand
          </p>
          <p className="mt-1 text-sm font-medium text-slate-800">
            {product.brand || "No brand"}
          </p>
        </div>
        <div className="rounded-xl bg-white px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Category
          </p>
          <p className="mt-1 text-sm font-medium text-slate-800">{product.categoryLabel}</p>
        </div>
        <div className="rounded-xl bg-white px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Availability
          </p>
          <p className="mt-1 text-sm font-medium text-slate-800">{product.stockLabel}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-slate-500">Price</p>
          {discountPercentage ? (
            <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">
              Save {discountPercentage}%
            </span>
          ) : null}
        </div>
        <div className="mt-2 flex flex-wrap items-end gap-x-2 gap-y-1">
          <span className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            {formatCurrency(displayedPrice)}
          </span>
          {displayedCompareAtPrice ? (
            <span className="pb-1 text-sm text-slate-500 line-through sm:text-base">
              {formatCurrency(displayedCompareAtPrice)}
            </span>
          ) : null}
        </div>
        {isLowStock ? (
          <p className="mt-3 text-sm font-medium text-amber-700">
            Low stock. Only {displayedStock} left.
          </p>
        ) : null}
      </div>

      {product.variantGroups.length > 0 ? (
        <div className="space-y-4">
          {product.variantGroups.map((group) => {
            const selectedOptionId =
              selectedOptionsByGroup[group.id] || group.options[0]?.id || "";

            return (
              <div key={group.id} className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">
                  {group.title}
                </label>

                <select
                  value={selectedOptionId}
                  onChange={(event) =>
                    handleVariantChange(group.id, event.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  {group.options.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label} - {formatCurrency(option.price)}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}

          <div className="flex flex-col gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-slate-700">
              Selected SKU: {displayedSku || "Not set"}
            </span>
            <span className="text-xl font-semibold text-amber-600">
              {formatCurrency(displayedPrice)}
            </span>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-700">Quantity</p>
          <p className="mt-1 text-xs text-slate-500">
            Adjust the order quantity
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center overflow-hidden rounded-xl border border-slate-300 bg-white">
            <button
              type="button"
              onClick={() => changeQuantity(-1)}
              aria-label="Decrease quantity"
              className="h-11 w-11 bg-slate-100 text-lg text-slate-700 transition hover:bg-slate-200"
            >
              -
            </button>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(event) =>
                setQuantity(Math.max(1, Number(event.target.value) || 1))
              }
              className="h-11 w-16 border-0 text-center text-sm font-medium text-slate-900 outline-none"
            />
            <button
              type="button"
              onClick={() => changeQuantity(1)}
              aria-label="Increase quantity"
              className="h-11 w-11 bg-slate-100 text-lg text-slate-700 transition hover:bg-slate-200"
            >
              +
            </button>
          </div>

          <span className="text-sm text-slate-600">
            {displayedBarcode ? `Barcode: ${displayedBarcode}` : "Ready to order"}
          </span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
        <button
          type="button"
          disabled={!isAvailable}
          onClick={handleAddToCart}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <ShoppingCart className="h-4 w-4" />
          {isAvailable
            ? isAddingToCart
              ? "Adding..."
              : "Add to Cart"
            : "Out of Stock"}
        </button>

        <button className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
          Request Quote
        </button>

        <button
          type="button"
          aria-label="Add to wishlist"
          className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-slate-700 transition hover:bg-slate-50"
        >
          <Heart className="h-5 w-5" />
        </button>
      </div>

      <div className="rounded-2xl border-l-4 border-yellow-500 bg-yellow-50 p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-yellow-800">
          Product Information
        </h3>
        <ul className="mt-2 space-y-1 pl-5 text-sm text-yellow-800">
          <li className="list-disc">Product ID: {product.id}</li>
          <li className="list-disc">SKU: {displayedSku || "Not set"}</li>
          <li className="list-disc">Stock: {displayedStock ?? 0}</li>
        </ul>
      </div>
    </section>
  );
}
