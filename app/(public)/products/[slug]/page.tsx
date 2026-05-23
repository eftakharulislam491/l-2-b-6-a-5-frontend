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
      <div className="mx-auto my-8 w-full max-w-3xl px-4 sm:px-6 lg:my-12 lg:px-8">
        <Card className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
          <h1 className="text-2xl font-semibold text-slate-900">
            We could not load this product
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-700">
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
  const [productReviews, myProductReview] = await Promise.all([
    getProductReviews(product.id, {
      limit: 10,
      sort: "-createdAt",
    }),
    getMyProductReview(product.id),
  ]);

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
    <div className="relative mx-auto my-6 w-full max-w-[1480px] px-4 sm:my-8 sm:px-6 lg:my-12 lg:px-8">
      <div className="pointer-events-none absolute inset-x-12 top-0 -z-10 h-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(14,116,144,0.12),transparent_68%)] blur-2xl" />

      <div className="mb-5 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 sm:text-sm">
        <Link href="/" className="transition hover:text-slate-800">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="transition hover:text-slate-800">
          Products
        </Link>
        <span>/</span>
        <span className="max-w-[240px] truncate text-slate-700 sm:max-w-[420px]">
          {productView.title}
        </span>
      </div>

      <section className="rounded-[32px] border border-slate-200/80 bg-white/80 p-3 shadow-[0_18px_55px_-30px_rgba(15,23,42,0.35)] backdrop-blur sm:p-4 lg:p-6">
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

      <div className="mt-10 sm:mt-12 lg:mt-16">
        <ProductDetailsTabs
          description={productView.description || ""}
          shortDescription={productView.shortDesc || ""}
          additionalInfo={productView.additionalInfo}
          variantGroups={productView.variantGroups}
        />
      </div>

      <div className="mt-10 sm:mt-12 lg:mt-16">
        <ProductReviewsSection
          productId={product.id}
          reviews={mergedProductReviews}
          summary={mergedReviewSummary}
          error={productReviews.error}
        />
      </div>

      <div className="mt-10 sm:mt-12 lg:mt-16">
        <RelatedProductsSection />
      </div>
    </div>
  );
}
