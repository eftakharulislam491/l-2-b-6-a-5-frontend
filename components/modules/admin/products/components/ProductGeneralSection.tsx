import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  ProductCategory,
  ProductPayload,
  UpdateProductField,
} from "../product-editor-types";
import {
  Field,
  ProductTextarea,
  SectionCard,
} from "./ProductEditorPrimitives";

type ProductGeneralSectionProps = {
  product: ProductPayload;
  categories: ProductCategory[];
  updateProductField: UpdateProductField;
};

export function ProductGeneralSection({
  product,
  categories,
  updateProductField,
}: ProductGeneralSectionProps) {
  return (
    <SectionCard
      title="General"
      description="Keep the main catalog data clean and close to the first reference block."
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Name" required>
          <Input
            value={product.title}
            onChange={(event) => updateProductField("title", event.target.value)}
            className="h-11 rounded-xl border-slate-200 bg-slate-50"
          />
        </Field>
        <Field label="Slug" required>
          <Input
            value={product.slug}
            onChange={(event) => updateProductField("slug", event.target.value)}
            className="h-11 rounded-xl border-slate-200 bg-slate-50"
          />
        </Field>
      </div>

      <Field label="Description" required>
        <ProductTextarea
          value={product.description}
          onChange={(event) => updateProductField("description", event.target.value)}
          rows={6}
        />
      </Field>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Brand">
          <Input
            value={product.brand}
            onChange={(event) => updateProductField("brand", event.target.value)}
            className="h-11 rounded-xl border-slate-200 bg-slate-50"
          />
        </Field>
        <Field label="Categories">
          <Select
            value={product.categoryId || "none"}
            onValueChange={(value) =>
              updateProductField("categoryId", value === "none" ? "" : value)
            }
          >
            <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 bg-slate-50">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Unassigned</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field label="Short Description">
        <ProductTextarea
          value={product.shortDesc}
          onChange={(event) => updateProductField("shortDesc", event.target.value)}
          rows={4}
        />
      </Field>
    </SectionCard>
  );
}
