import Link from "next/link";
import ProductGrid from "../modules/product/ProductGrid";
import type { Product } from "@/types/product";

type Props = {
  products: Product[];
};

const HomeProductSection = ({ products }: Props) => {
  const featuredProducts = products.slice(0, 8);

  return (
    <section className="bg-background py-16 text-foreground">
      <div className=" mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">
            Featured Ingredients
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Hand-picked cosmetic raw materials trusted by professionals
          </p>
        </div>

        {/* Product Grid */}
        <ProductGrid products={featuredProducts} />

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/products">
            <button className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-primary px-8 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90">
              View All Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeProductSection;
