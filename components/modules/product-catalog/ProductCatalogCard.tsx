"use client";

import { useState } from "react";
import ProductCard from "@/components/modules/product/ProductCard";
import type { CatalogProduct } from "./types";

type ProductCatalogCardProps = {
  product: CatalogProduct;
  onAddToCart: (product: CatalogProduct) => void | Promise<void>;
};

export default function ProductCatalogCard({
  product,
  onAddToCart,
}: ProductCatalogCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (isAddingToCart) {
      return;
    }

    setIsAddingToCart(true);

    try {
      await onAddToCart(product);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <ProductCard
      id={product.id}
      slug={product.slug}
      detailPath={`/products/${product.id}`}
      image={product.image}
      title={product.title}
      category={product.categoryLabel}
      price={product.price}
      originalPrice={product.originalPrice ?? undefined}
      badge={product.isFeatured ? "Featured" : undefined}
      inStock={product.inStock}
      onAddToCart={handleAddToCart}
      isAddingToCart={isAddingToCart}
    />
  );
}
