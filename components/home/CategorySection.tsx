/* eslint-disable @next/next/no-img-element */

"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { Product } from "@/types/product";

export type CategoryType = {
  label: string;
  value: string;
  image: string;
};

type Props = {
  products: Product[];
  categories?: CategoryType[];
};

const CATEGORY_ICON_FALLBACK = "/icons/all-ingredients.svg";
const PRODUCT_IMAGE_FALLBACK = "/product/product-placeholder.svg";

export default function CategorySection({ products, categories = [] }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  // ── Drag to scroll ──
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    scrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
    if (scrollRef.current) scrollRef.current.style.cursor = "grabbing";
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  const stopDrag = useCallback(() => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  }, []);

  // ── Arrow scroll ──
  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="mb-1 text-2xl font-semibold text-slate-900 sm:text-4xl">
              Shop by Category
            </h2>
            <p className="text-sm text-slate-500">
              Browse our wide range of raw materials & ingredients
            </p>
          </div>

          {/* Prev / Next */}
          <div className="hidden items-center gap-2 sm:flex">
            <button
              onClick={() => scroll("left")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-amber-600 hover:text-amber-700"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-amber-600 hover:text-amber-700"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-8 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setActiveCategory(category.value)}
                className={[
                  "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-all",
                  activeCategory === category.value
                    ? "border-amber-700 bg-amber-700 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-amber-600 hover:text-amber-700",
                ].join(" ")}
              >
                <span className="relative h-5 w-5 overflow-hidden rounded-full">
                  <img
                    src={category.image}
                    alt={category.label}
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.src = CATEGORY_ICON_FALLBACK;
                    }}
                  />
                </span>
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Row */}
        {filteredProducts.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400">
            No products in this category yet.
          </p>
        ) : (
          <div
            ref={scrollRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
            className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ cursor: "grab" }}
          >
            {filteredProducts.map((product) => (
              // Use id-first routing because backend single-product endpoint resolves by id.
              <Link
                key={product.id}
                href={`/products/${String(product.id).trim() || product.slug}`}
                draggable={false}
                className="w-[160px] shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg sm:w-[200px] lg:w-[220px]"
              >
                {/* Image */}
                <div className="relative aspect-square">
                  <img
                    src={product.image}
                    alt={product.title}
                    draggable={false}
                    className="h-full w-full select-none object-cover"
                    onError={(event) => {
                      event.currentTarget.src = PRODUCT_IMAGE_FALLBACK;
                    }}
                  />
                  {product.badge ? (
                    <span className="absolute top-2 left-2 rounded bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                      {product.badge}
                    </span>
                  ) : null}
                  {!product.inStock ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                      <span className="rounded-full border bg-white px-3 py-1 text-xs font-medium text-slate-500">
                        Out of Stock
                      </span>
                    </div>
) : null}
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <h3 className="mb-3 line-clamp-2 text-sm leading-snug font-medium text-slate-800">
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-sm font-semibold text-slate-900 sm:text-base">
                            BDT {product.price.toFixed(2)}
                          </span>
                          {product.originalPrice ? (
                            <span className="ml-1 text-[10px] text-slate-400 line-through sm:text-xs">
                              BDT {product.originalPrice.toFixed(2)}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
