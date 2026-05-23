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
      className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6"
    >
      <input type="hidden" name="productId" value={productId} />

      <div className="space-y-1">
        <h4 className="text-lg font-semibold text-slate-900">Write a review</h4>
        <p className="text-sm text-slate-600">
          Submit your rating and feedback for this product.
        </p>
      </div>

      <fieldset className="mt-5 space-y-2">
        <legend className="text-sm font-medium text-slate-700">Your rating *</legend>
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
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-700">
                {rating}
                <Star className="h-4 w-4 fill-current" />
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-4 grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="review-title" className="text-sm font-medium text-slate-700">
            Title (optional)
          </label>
          <input
            id="review-title"
            name="title"
            type="text"
            maxLength={255}
            placeholder="Summarize your experience"
            className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="review-comment" className="text-sm font-medium text-slate-700">
            Comment (optional)
          </label>
          <textarea
            id="review-comment"
            name="comment"
            rows={4}
            maxLength={2000}
            placeholder="Tell others what you liked or disliked"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
        <p className="text-xs text-slate-500">
          One review per user for this product.
        </p>
      </div>
    </form>
  );
}
