import Image from "next/image";
import Link from "next/link";
import React from "react";

// Fallback images cycled when a category has no image
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556228852-80282d6336c2?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1200&auto=format&fit=crop",
];

export type ExclusiveCategoryItem = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
};

type Props = {
  categories?: ExclusiveCategoryItem[];
};

export default function ExclusiveProduct({ categories = [] }: Props) {
  // Show at most 4 categories; if none from backend use empty (no hardcoded fallback)
  const displayItems = categories.slice(0, 8);

  return (
    <section className="container mx-auto bg-background py-12 text-foreground sm:py-16">
      <div>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">
            Exclusive Beauty Essentials
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            Explore our curated range of premium makeup raw materials for beauty
            brands, skincare makers, and wholesale buyers who want reliable
            quality with a refined finish.
          </p>
        </div>

        {displayItems.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            No categories available right now.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {displayItems.map((item, index) => {
              const imgSrc =
                item.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

              return (
                <Link
                  key={item.id}
                  href={`/products?category=${item.slug}`}
                  className="group text-center"
                >
                  <div className="relative overflow-hidden rounded-3xl">
                    <Image
                      src={imgSrc}
                      alt={item.name}
                      width={1200}
                      height={1600}
                      className="h-[320px] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/50 to-transparent pb-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="rounded-full bg-card px-4 py-1.5 text-xs font-semibold text-card-foreground shadow">
                        Shop Now
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 text-sm font-medium text-foreground sm:text-base">
                    {item.name}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
