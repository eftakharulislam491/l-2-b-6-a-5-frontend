import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import type {
  ProductReview,
  ProductReviewSummary,
} from "@/services/review/review-types";
import ProductReviewForm from "./ProductReviewForm";

type ProductReviewsSectionProps = {
  productId: string;
  reviews: ProductReview[];
  summary: ProductReviewSummary;
  error?: string | null;
};

function formatDate(value: string) {
  if (!value) {
    return "Unknown date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-BD", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function renderStars(rating: number) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index < rating;

        return (
          <Star
            key={index}
            className={`h-4 w-4 ${
              filled ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
            }`}
          />
        );
      })}
    </div>
  );
}

export default function ProductReviewsSection({
  productId,
  reviews,
  summary,
  error = null,
}: ProductReviewsSectionProps) {
  return (
    <section className="rounded-[28px] border border-border bg-card p-6 text-card-foreground shadow-sm sm:p-8">
      <div className="flex flex-col gap-6 border-b border-border pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Customer Reviews
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-card-foreground">
            {summary.averageRating.toFixed(1)} / 5
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Based on {summary.totalReviews} verified and community reviews.
          </p>
          <div className="mt-3">{renderStars(Math.round(summary.averageRating))}</div>
        </div>

        <div className="w-full max-w-sm space-y-3">
          {summary.ratingBreakdown.map((item) => {
            const percentage =
              summary.totalReviews > 0
                ? Math.round((item.count / summary.totalReviews) * 100)
                : 0;

            return (
              <div
                key={item.rating}
                className="grid grid-cols-[44px_1fr_44px] items-center gap-3 text-sm"
              >
                <span className="font-medium text-card-foreground">{item.rating} star</span>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-amber-400"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-right text-muted-foreground">{item.count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      ) : null}

      <ProductReviewForm productId={productId} />

      <div className="mt-6 space-y-4">
        {reviews.length ? (
          reviews.map((review) => (
            <Card
              key={review.id}
              className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-none"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-card-foreground">
                    {review.user.name || "Anonymous user"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {renderStars(review.rating)}
                  {review.isVerifiedPurchase ? (
                    <Badge
                      variant="outline"
                      className="rounded-full border-emerald-300 bg-emerald-50 text-emerald-700"
                    >
                      Verified purchase
                    </Badge>
                  ) : null}
                </div>
              </div>

              {review.title ? (
                <p className="mt-4 text-sm font-semibold text-card-foreground">{review.title}</p>
              ) : null}

              {review.comment ? (
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{review.comment}</p>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  This user only gave a rating.
                </p>
              )}

              {review.adminReply ? (
                <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
                    Admin reply
                  </p>
                  <p className="mt-2 text-sm leading-6 text-blue-900">
                    {review.adminReply}
                  </p>
                </div>
              ) : null}
            </Card>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-muted px-5 py-8 text-center text-sm text-muted-foreground">
            No reviews yet for this product.
          </div>
        )}
      </div>
    </section>
  );
}
