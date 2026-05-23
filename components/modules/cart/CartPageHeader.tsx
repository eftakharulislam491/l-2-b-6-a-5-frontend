"use client";

import { Check, ChevronLeft } from "lucide-react";
import { cartSteps, classNames } from "./cart-utils";
import type { CartStep } from "./types";

type CartPageHeaderProps = {
  step: CartStep;
  onBack: () => void;
};

export function CartPageHeader({ step, onBack }: CartPageHeaderProps) {
  const currentIndex = cartSteps.findIndex((item) => item.key === step);

  return (
    <div className="border-b border-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Checkout</h1>
            <p className="mt-1 text-sm text-slate-500">
              Review your live cart items and complete your order.
            </p>
          </div>

          {step !== "cart" ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
          ) : null}
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-3">
            {cartSteps.map((item, index) => {
              const isDone = index < currentIndex;
              const isActive = index === currentIndex;

              return (
                <div key={item.key} className="flex flex-1 items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={classNames(
                        "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold",
                        isDone
                          ? "border-slate-900 bg-slate-900 text-white"
                          : isActive
                            ? "border-slate-900 bg-white text-slate-900"
                            : "border-slate-200 bg-white text-slate-400",
                      )}
                    >
                      {isDone ? <Check className="h-4 w-4" /> : index + 1}
                    </div>

                    <div
                      className={classNames(
                        "text-sm font-medium",
                        isActive || isDone ? "text-slate-900" : "text-slate-400",
                      )}
                    >
                      {item.label}
                    </div>
                  </div>

                  {index !== cartSteps.length - 1 ? (
                    <div
                      className={classNames(
                        "h-px flex-1",
                        index < currentIndex ? "bg-slate-900" : "bg-slate-200",
                      )}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
