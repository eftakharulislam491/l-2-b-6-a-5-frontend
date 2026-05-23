import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Boxes,
  ChevronRight,
  CircleDollarSign,
  ImageIcon,
  Layers3,
  Save,
} from "lucide-react";
import type {
  ProductEditorMetrics,
  ProductPayload,
} from "../product-editor-types";
import { currencyFormatter } from "../product-editor-utils";
import { MetricCard } from "./ProductEditorPrimitives";

type ProductEditorHeaderProps = {
  product: ProductPayload;
  metrics: ProductEditorMetrics;
  submitIntent: "draft" | "publish" | null;
  onSaveDraft: () => void;
  onPublish: () => void;
};

export function ProductEditorHeader({
  product,
  metrics,
  submitIntent,
  onSaveDraft,
  onPublish,
}: ProductEditorHeaderProps) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            <span>Catalog</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span>Products</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-slate-900">Add Product</span>
          </div>

          <div className="space-y-3">
            <Badge
              variant="outline"
              className="rounded-full border-slate-300 bg-slate-50 px-3 py-1 text-slate-700"
            >
              Variant-first editor
            </Badge>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                Product setup
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                Clean admin layout inspired by your reference screens, but shaped
                around your real product payload with nested variants, option rows,
                pricing, media IDs, inventory, and SEO details.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            className="h-10 rounded-full border-slate-300 bg-white px-5 text-slate-700"
            type="button"
            disabled={submitIntent !== null}
            onClick={onSaveDraft}
          >
            <Save className="h-4 w-4" />
            {submitIntent === "draft" ? "Saving draft..." : "Save draft"}
          </Button>
          <Button
            className="h-10 rounded-full bg-slate-900 px-5 text-white hover:bg-slate-800"
            type="button"
            disabled={submitIntent !== null}
            onClick={onPublish}
          >
            {submitIntent === "publish" ? "Publishing..." : "Publish product"}
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={<CircleDollarSign className="h-4 w-4" />}
          label="Base price"
          value={currencyFormatter.format(product.price)}
          helper="Primary catalog price"
        />
        <MetricCard
          icon={<Layers3 className="h-4 w-4" />}
          label="Variant groups"
          value={String(product.variants.length)}
          helper={`${metrics.activeVariants} active groups`}
        />
        <MetricCard
          icon={<Boxes className="h-4 w-4" />}
          label="Option rows"
          value={String(metrics.totalOptions)}
          helper={`${metrics.totalStock} units in stock`}
        />
        <MetricCard
          icon={<ImageIcon className="h-4 w-4" />}
          label="Media IDs"
          value={String(product.imageIds.length)}
          helper="Reusable product media references"
        />
      </div>
    </section>
  );
}
