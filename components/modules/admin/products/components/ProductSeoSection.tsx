import { Input } from "@/components/ui/input";
import type { ProductPayload, UpdateProductField } from "../product-editor-types";
import {
  Field,
  ProductTextarea,
  SectionCard,
} from "./ProductEditorPrimitives";

type ProductSeoSectionProps = {
  product: ProductPayload;
  updateProductField: UpdateProductField;
};

export function ProductSeoSection({
  product,
  updateProductField,
}: ProductSeoSectionProps) {
  return (
    <SectionCard
      title="SEO"
      description="A dedicated block on the main column, just like the reference layout."
    >
      <div className="space-y-5">
        <Field label="Meta Title">
          <Input
            value={product.metaTitle}
            onChange={(event) => updateProductField("metaTitle", event.target.value)}
            className="h-11 rounded-xl border-slate-200 bg-slate-50"
          />
        </Field>
        <Field label="Meta Description">
          <ProductTextarea
            value={product.metaDescription}
            onChange={(event) =>
              updateProductField("metaDescription", event.target.value)
            }
            rows={5}
          />
        </Field>
        <Field label="Meta Keywords">
          <Input
            value={product.metaKeywords}
            onChange={(event) =>
              updateProductField("metaKeywords", event.target.value)
            }
            className="h-11 rounded-xl border-slate-200 bg-slate-50"
          />
        </Field>
      </div>
    </SectionCard>
  );
}
