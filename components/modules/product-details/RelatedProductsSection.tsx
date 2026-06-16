import ProductCard from "@/components/modules/product/ProductCard";
import type { ProductListItem } from "@/services/products/getAllProducts";

const FALLBACK_BASE_URL =
  process.env.BASE_URL || "https://e-commerce-backend-491.vercel.app/";
const PRODUCT_IMAGE_PLACEHOLDER = "/product/product-placeholder.svg";

type RelatedProductsSectionProps = {
  products: ProductListItem[];
};

function parsePrice(value: string | null | undefined) {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function resolveImageUrl(product: ProductListItem) {
  const imageUrl = product.images[0]?.src || product.images[0]?.url;

  if (!imageUrl?.trim()) {
    return PRODUCT_IMAGE_PLACEHOLDER;
  }

  if (/^(https?:)?\/\//i.test(imageUrl) || imageUrl.startsWith("data:")) {
    return imageUrl;
  }

  try {
    return new URL(imageUrl, FALLBACK_BASE_URL).toString();
  } catch {
    return PRODUCT_IMAGE_PLACEHOLDER;
  }
}

export default function RelatedProductsSection({
  products,
}: RelatedProductsSectionProps) {
  if (!products.length) {
    return null;
  }

  return (
    <section className="border-t border-border pt-8">
      <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Related Items
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-foreground">
            You may also need
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          More items from the same category.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, 4).map((product) => {
          const price = parsePrice(product.price);
          const originalPrice = parsePrice(product.compareAtPrice);

          return (
            <ProductCard
              key={product.id}
              id={product.id}
              slug={product.slug}
              title={product.title}
              image={resolveImageUrl(product)}
              price={price}
              originalPrice={originalPrice > price ? originalPrice : undefined}
              badge={product.isFeatured ? "Featured" : undefined}
              inStock={(product.stock ?? 0) > 0}
              detailPath={`/products/${product.slug || product.id}`}
            />
          );
        })}
      </div>
    </section>
  );
}
