"use client";

import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  submitProductReview,
  type SubmitProductReviewState,
} from "@/services/review/submitProductReview";

type ProductReviewFormProps = {
  productId: string;
};

const RATING_OPTIONS = [5, 4, 3, 2, 1];

export default function ProductReviewForm({ productId }: ProductReviewFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState<
    SubmitProductReviewState | null,
    FormData
  >(submitProductReview, null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [router, state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="mt-6 rounded-2xl border border-border bg-muted p-5 sm:p-6"
    >
      <input type="hidden" name="productId" value={productId} />

      <div className="space-y-1">
        <h4 className="text-lg font-semibold text-foreground">Write a review</h4>
        <p className="text-sm text-muted-foreground">
          Submit your rating and feedback for this product.
        </p>
      </div>

      <fieldset className="mt-5 space-y-2">
        <legend className="text-sm font-medium text-foreground">Your rating *</legend>
        <div className="flex flex-wrap gap-2">
          {RATING_OPTIONS.map((rating) => (
            <label key={rating} className="cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={rating}
                required
                className="peer sr-only"
              />
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-card-foreground transition hover:border-ring peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground">
                {rating}
                <Star className="h-4 w-4 fill-current" />
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-4 grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="review-title" className="text-sm font-medium text-foreground">
            Title (optional)
          </label>
          <input
            id="review-title"
            name="title"
            type="text"
            maxLength={255}
            placeholder="Summarize your experience"
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="review-comment" className="text-sm font-medium text-foreground">
            Comment (optional)
          </label>
          <textarea
            id="review-comment"
            name="comment"
            rows={4}
            maxLength={2000}
            placeholder="Tell others what you liked or disliked"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
        </div>
      </div>

      {state ? (
        <p
          className={`mt-4 text-sm ${
            state.success ? "text-emerald-700" : "text-rose-600"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isPending} className="rounded-xl">
          {isPending ? "Submitting..." : "Submit review"}
        </Button>
        <p className="text-xs text-muted-foreground">
          One review per user for this product.
        </p>
      </div>
    </form>
  );
}
