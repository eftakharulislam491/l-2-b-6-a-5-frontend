import Link from "next/link";
import { notFound } from "next/navigation";
import ProductDetailsTabs from "@/components/modules/product-details/ProductDetailsTabs";
import ProductGallery from "@/components/modules/product-details/ProductGallery";
import ProductInfo from "@/components/modules/product-details/ProductInfo";
import ProductReviewsSection from "@/components/modules/product-details/ProductReviewsSection";
import RelatedProductsSection from "@/components/modules/product-details/RelatedProductsSection";
import { mapProductToDetailView } from "@/components/modules/product-details/product-detail-mappers";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAllProducts } from "@/services/products/getAllProducts";
import { getSingleProduct } from "@/services/products/getSingleProduct";
import { getMyProductReview } from "@/services/review/getMyProductReview";
import { getProductReviews } from "@/services/review/getProductReviews";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const { product, error, notFound: missingProduct } = await getSingleProduct(slug);

  if (missingProduct) {
    notFound();
  }

  if (!product) {
    return (
      <div className="mx-auto my-8 w-full max-w-3xl bg-background px-4 text-foreground sm:px-6 lg:my-12 lg:px-8">
        <Card className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
          <h1 className="text-2xl font-semibold text-amber-950">
            We could not load this product
          </h1>
          <p className="mt-3 text-sm leading-6 text-amber-800">
            {error || "Something went wrong while loading the product details."}
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/products">Back to products</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const productView = mapProductToDetailView(product);
  const [productReviews, myProductReview, allProductsResult] = await Promise.all([
    getProductReviews(product.id, {
      limit: 10,
      sort: "-createdAt",
    }),
    getMyProductReview(product.id),
    getAllProducts(),
  ]);
  const relatedProducts = allProductsResult.products
    .filter((item) => item.id !== product.id)
    .filter((item) =>
      product.categoryId ? item.categoryId === product.categoryId : true,
    )
    .slice(0, 8);

  const hasInjectedMyReview =
    Boolean(myProductReview.review) &&
    !productReviews.reviews.some((review) => review.id === myProductReview.review?.id);

  const mergedProductReviews =
    hasInjectedMyReview && myProductReview.review
      ? [myProductReview.review, ...productReviews.reviews]
      : productReviews.reviews;

  const mergedReviewSummary =
    hasInjectedMyReview && myProductReview.review
      ? {
          ...productReviews.summary,
          totalReviews: productReviews.summary.totalReviews + 1,
          averageRating: Number(
            (
              (productReviews.summary.averageRating * productReviews.summary.totalReviews +
                myProductReview.review.rating) /
              (productReviews.summary.totalReviews + 1)
            ).toFixed(2),
          ),
          ratingBreakdown: productReviews.summary.ratingBreakdown.map((item) =>
            item.rating === myProductReview.review?.rating
              ? { ...item, count: item.count + 1 }
              : item,
          ),
        }
      : productReviews.summary;

  return (
    <div className="mx-auto my-6 w-full max-w-[1480px] bg-background px-4 text-foreground sm:my-8 sm:px-6 lg:my-12 lg:px-8">
      <div className="mb-5 flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground sm:text-sm">
        <Link href="/" className="transition hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="transition hover:text-foreground">
          Products
        </Link>
        <span>/</span>
        <span className="max-w-[240px] truncate text-foreground sm:max-w-[420px]">
          {productView.title}
        </span>
      </div>

      <section className="border-y border-border bg-card/70 py-4 text-card-foreground sm:py-5 lg:py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-8 xl:gap-10">
          <ProductGallery
            title={productView.title}
            images={productView.galleryImages}
          />
          <div className="min-w-0">
            <ProductInfo key={productView.id} product={productView} />
          </div>
        </div>
      </section>

      <div className="mt-8 sm:mt-10 lg:mt-12">
        <ProductDetailsTabs
          description={productView.description || ""}
          shortDescription={productView.shortDesc || ""}
          additionalInfo={productView.additionalInfo}
          variantGroups={productView.variantGroups}
        />
      </div>

      <div className="mt-8 sm:mt-10 lg:mt-12">
        <ProductReviewsSection
          productId={product.id}
          reviews={mergedProductReviews}
          summary={mergedReviewSummary}
          error={productReviews.error}
        />
      </div>

      <div className="mt-8 sm:mt-10 lg:mt-12">
        <RelatedProductsSection products={relatedProducts} />
      </div>
    </div>
  );
}
