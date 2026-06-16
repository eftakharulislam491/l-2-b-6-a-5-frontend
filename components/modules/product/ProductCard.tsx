/* eslint-disable @next/next/no-img-element */

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Star } from "lucide-react";
import type { Product } from "@/types/product";

const PRODUCT_IMAGE_PLACEHOLDER = "/product/product-placeholder.svg";

type ProductCardProps = Product & {
  onViewDetails?: () => void;
  detailPath?: string;
  onAddToCart?: () => void | Promise<void>;
  isAddingToCart?: boolean;
};

export default function ProductCard({
  id,
  image,
  title,
  slug,
  price,
  originalPrice,
  badge,
  rating = 4.8,
  reviewCount = 25,
  onViewDetails,
  detailPath,
}: ProductCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const currentPrice = Number.isFinite(Number(price)) ? Number(price) : 0;
  const oldPrice =
    originalPrice !== undefined && Number.isFinite(Number(originalPrice))
      ? Number(originalPrice)
      : null;

  const navigateToProduct = () => {
    if (onViewDetails) {
      onViewDetails();
      return;
    }

    const normalizedId = String(id).trim();
    const normalizedSlug = slug.trim();
    const resolvedDetailPath =
      detailPath?.trim() ||
      (normalizedId ? `/products/${normalizedId}` : "") ||
      (normalizedSlug ? `/products/${normalizedSlug}` : "");

    if (resolvedDetailPath) {
      router.push(resolvedDetailPath);
    }
  };

  const toggleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
  };

  const handleCardKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigateToProduct();
    }
  };

  return (
    <div className="w-full">
      <div
        className="group relative mb-3 overflow-hidden rounded-lg border border-border bg-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={navigateToProduct}
        onKeyDown={handleCardKeyDown}
        role="link"
        tabIndex={0}
      >
        <div className="relative aspect-square cursor-pointer">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(event) => {
              event.currentTarget.src = PRODUCT_IMAGE_PLACEHOLDER;
            }}
          />

          {badge ? (
            <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
              {badge}
            </span>
          ) : null}

          <button
            type="button"
            onClick={toggleWishlist}
            className={`absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-card-foreground shadow-lg transition-all duration-300 ${
              isHovered ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
            } hover:bg-secondary active:scale-95`}
            aria-label="Add to wishlist"
          >
            <Heart
              size={20}
              className={`transition-all duration-200 ${
                isWishlisted
                  ? "fill-red-500 stroke-red-500"
                  : "stroke-current hover:stroke-red-500"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={navigateToProduct}
          className="w-full text-left"
        >
          <h3 className="min-h-[2.5rem] line-clamp-2 text-sm font-medium leading-tight text-foreground">
            {title}
          </h3>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-foreground">
            BDT {currentPrice.toFixed(2)}
          </span>
          {oldPrice !== null ? (
            <span className="text-sm text-muted-foreground line-through">
              BDT {oldPrice.toFixed(2)}
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-foreground">{rating}</span>
          </div>
          <span className="text-muted-foreground">({reviewCount} Reviews)</span>
        </div>
      </div>
    </div>
  );
}
