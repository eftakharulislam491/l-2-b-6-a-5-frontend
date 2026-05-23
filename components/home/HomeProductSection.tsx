import Link from "next/link";
import ProductGrid from "../modules/product/ProductGrid";
import type { Product } from "@/types/product";

type Props = {
  products: Product[];
};

const HomeProductSection = ({ products }: Props) => {
  const featuredProducts = products.slice(0, 8);

  return (
    <section className="py-16 bg-white">
      <div className=" mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Featured Ingredients
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hand-picked cosmetic raw materials trusted by professionals
          </p>
        </div>

        {/* Product Grid */}
        <ProductGrid products={featuredProducts} />

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/products">
            <button className="inline-flex items-center justify-center px-8 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all cursor-pointer">
              View All Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeProductSection;
