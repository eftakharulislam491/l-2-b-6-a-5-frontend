"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

import type { Product } from "@/types/product";
import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import ProductCard from "../modules/product/ProductCard";

type Props = {
  products: Product[];
};

export default function BestSellingProducts({ products }: Props) {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [active, setActive] = React.useState(0);
  const dotsCount = 3;
  const { addItem, isUpdating } = useCart();

  const handleAddToCart = async (product: Product) => {
    await addItem({
      productId: String(product.id),
      variantOptionIds: [],
      quantity: 1,
    });
  };

  React.useEffect(() => {
    if (!api) return;

    const update = () => {
      setActive(api.selectedScrollSnap());
    };

    update();
    api.on("select", update);

    return () => {
      api.off("select", update);
    };
  }, [api]);

  const handlePrev = () => api?.scrollPrev();
  const handleNext = () => api?.scrollNext();
  return (
    <section className="w-full bg-muted/45 text-foreground">
      <div className="container mx-auto py-10">
        {/* Top */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
            Best-Selling Beauty Ingredients
          </h2>

          <Link
            href="/products"
            className="group inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
          >
            View All Products
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Carousel */}
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-6">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-6 basis-full sm:basis-1/2 lg:basis-1/4"
              >
                <ProductCard
                  {...product}
                  onAddToCart={() => handleAddToCart(product)}
                  isAddingToCart={isUpdating}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Bottom controls */}
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            className="h-10 w-10 rounded-full border-border bg-card text-card-foreground shadow-sm hover:bg-secondary"
            aria-label="Previous products"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Dots (center lines) */}
          <div className="flex items-center gap-2">
            {Array.from({ length: dotsCount }).map((_, i) => {
              const isActive = active % dotsCount === i;
              return (
                <span
                  key={i}
                  className={[
                    "h-1.5 rounded-full transition-all",
                    isActive ? "w-10 bg-primary" : "w-6 bg-border",
                  ].join(" ")}
                />
              );
            })}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="h-10 w-10 rounded-full border-border bg-card text-card-foreground shadow-sm hover:bg-secondary"
            aria-label="Next products"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
