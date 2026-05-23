"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../product/ProductCard";

const relatedProducts = [
  {
    id: 101,
    title: "Sample Product 1",
    slug: "sample-product-1",
    price: 120,
    originalPrice: 150,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    sizes: ["S", "M", "L", "XL"],
    defaultSize: "M",
    badge: "New",
    inStock: true,
  },
  {
    id: 102,
    title: "Sample Product 2",
    slug: "sample-product-2",
    price: 150,
    originalPrice: 180,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    sizes: ["M", "L", "XL"],
    defaultSize: "L",
    badge: "Sale",
    inStock: true,
  },
  {
    id: 103,
    title: "Sample Product 3",
    slug: "sample-product-3",
    price: 180,
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
    sizes: ["S", "M", "L"],
    defaultSize: "M",
    inStock: true,
  },
  {
    id: 104,
    title: "Sample Product 4",
    slug: "sample-product-4",
    price: 210,
    originalPrice: 250,
    image:
      "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500&h=500&fit=crop",
    sizes: ["M", "L", "XL", "XXL"],
    defaultSize: "L",
    badge: "Hot",
    inStock: true,
  },
  {
    id: 105,
    title: "Sample Product 5",
    slug: "sample-product-5",
    price: 240,
    image:
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&h=500&fit=crop",
    sizes: ["S", "M", "L"],
    defaultSize: "M",
    inStock: false,
  },
  {
    id: 106,
    title: "Sample Product 6",
    slug: "sample-product-6",
    price: 270,
    originalPrice: 300,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    sizes: ["M", "L", "XL"],
    defaultSize: "L",
    badge: "Trending",
    inStock: true,
  },
];

export default function RelatedProductsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.offsetWidth / 4 + 24;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -cardWidth : cardWidth,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <></>
    // <section className="mt-16">
    //   <div className="flex items-center justify-between mb-6">
    //     <h2 className="text-2xl font-semibold">Related Products</h2>
    //     <div className="flex gap-2">
    //       <button
    //         onClick={() => scroll("left")}
    //         disabled={!canScrollLeft}
    //         className={`w-10 h-10 rounded-full border flex items-center justify-center transition ${
    //           canScrollLeft
    //             ? "border-gray-300 hover:bg-gray-100 text-gray-700"
    //             : "border-gray-200 text-gray-300 cursor-not-allowed"
    //         }`}
    //       >
    //         <ChevronLeft className="w-5 h-5" />
    //       </button>
    //       <button
    //         onClick={() => scroll("right")}
    //         disabled={!canScrollRight}
    //         className={`w-10 h-10 rounded-full border flex items-center justify-center transition ${
    //           canScrollRight
    //             ? "border-gray-300 hover:bg-gray-100 text-gray-700"
    //             : "border-gray-200 text-gray-300 cursor-not-allowed"
    //         }`}
    //       >
    //         <ChevronRight className="w-5 h-5" />
    //       </button>
    //     </div>
    //   </div>

    //   <div className="overflow-hidden">
    //     <div
    //       ref={scrollRef}
    //       onScroll={checkScroll}
    //       className="flex gap-6 overflow-x-scroll scroll-smooth pb-4"
    //       style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    //     >
    //       {relatedProducts.map((product) => (
    //         <div key={product.id} className="flex-shrink-0 w-[calc(25%-18px)]">
    //           <ProductCard {...product} />
    //         </div>
    //       ))}
    //     </div>
    //   </div>

    //   <style jsx>{`
    //     div::-webkit-scrollbar {
    //       display: none;
    //     }
    //   `}</style>
    // </section>
  );
}
