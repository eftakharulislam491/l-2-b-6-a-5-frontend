import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type {
  ProductEditorMetrics,
  ProductPayload,
  UpdateProductField,
} from "../product-editor-types";
import {
  shortId,
  toOptionalInteger,
  toOptionalNumber,
  toRequiredInteger,
  toRequiredNumber,
} from "../product-editor-utils";
import {
  Field,
  IdChipInput,
  InfoRow,
  SectionCard,
  SidebarMetric,
  ToggleRow,
} from "./ProductEditorPrimitives";
import { MediaUploadControl } from "../../shared/MediaUploadControl";

type ProductEditorSidebarProps = {
  product: ProductPayload;
  metrics: ProductEditorMetrics;
  updateProductField: UpdateProductField;
  toggleHasVariants: (checked: boolean) => void;
};

export function ProductEditorSidebar({
  product,
  metrics,
  updateProductField,
  toggleHasVariants,
}: ProductEditorSidebarProps) {
  return (
    <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
      <SectionCard
        title="Media"
        description="Upload new media or select existing media, then attach the image IDs to this product."
      >
        <div className="space-y-4">
          <MediaUploadControl
            onUploaded={(items) =>
              updateProductField("imageIds", [
                ...new Set([...product.imageIds, ...items.map((item) => item.id)]),
              ])
            }
          />

          <Field label="Image IDs">
            <IdChipInput
              ids={product.imageIds}
              onChange={(ids) => updateProductField("imageIds", ids)}
              placeholder="Add product image id"
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        title="Pricing"
        description="Main product pricing fields stay grouped on the right just like the screenshots."
      >
        <div className="space-y-5">
          <Field label="Price" required>
            <Input
              type="number"
              value={product.price}
              onChange={(event) =>
                updateProductField("price", toRequiredNumber(event.target.value))
              }
              className="h-11 rounded-xl border-slate-200 bg-slate-50"
            />
          </Field>

          <Field label="Compare At Price">
            <Input
              type="number"
              value={product.compareAtPrice ?? ""}
              onChange={(event) =>
                updateProductField(
                  "compareAtPrice",
                  toOptionalNumber(event.target.value),
                )
              }
              className="h-11 rounded-xl border-slate-200 bg-slate-50"
            />
          </Field>

          <Field label="Cost Price">
            <Input
              type="number"
              value={product.costPrice ?? ""}
              onChange={(event) =>
                updateProductField("costPrice", toOptionalNumber(event.target.value))
              }
              className="h-11 rounded-xl border-slate-200 bg-slate-50"
            />
          </Field>

          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-900">
              {product.hasVariants ? "Variant pricing enabled" : "Simple product pricing"}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {product.hasVariants
                ? "Use the base product price for the shared amount, then add any option-specific surcharge inside each variant row."
                : "Use the product-level price fields when the item does not need nested variants and option rows."}
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Inventory"
        description="Product inventory can stay simple or hand off to option-level stock when variants are enabled."
      >
        <div className="space-y-5">
          <Field label="SKU">
            <Input
              value={product.sku}
              onChange={(event) => updateProductField("sku", event.target.value)}
              disabled={product.hasVariants}
              className="h-11 rounded-xl border-slate-200 bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </Field>

          <Field label="Barcode">
            <Input
              value={product.barcode}
              onChange={(event) => updateProductField("barcode", event.target.value)}
              disabled={product.hasVariants}
              className="h-11 rounded-xl border-slate-200 bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </Field>

          <Field label="Stock">
            <Input
              type="number"
              value={product.stock ?? ""}
              onChange={(event) =>
                updateProductField("stock", toOptionalInteger(event.target.value))
              }
              disabled={product.hasVariants}
              className="h-11 rounded-xl border-slate-200 bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </Field>

          <Field label="Low Stock Threshold">
            <Input
              type="number"
              value={product.lowStockThreshold}
              onChange={(event) =>
                updateProductField(
                  "lowStockThreshold",
                  toRequiredInteger(event.target.value),
                )
              }
              className="h-11 rounded-xl border-slate-200 bg-slate-50"
            />
          </Field>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <InfoRow
              label="Inventory mode"
              value={product.hasVariants ? "Per option" : "Product level"}
            />
            <div className="mt-3" />
            <InfoRow
              label="Available units"
              value={`${product.hasVariants ? metrics.totalStock : product.stock ?? 0}`}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Publishing"
        description="Quick switches for storefront behavior and admin visibility."
      >
        <div className="space-y-4">
          <ToggleRow
            label="Enable the product"
            description="Ready for admin visibility and storefront publishing."
            checked={product.isActive}
            onCheckedChange={(checked) => updateProductField("isActive", checked)}
          />
          <Separator />
          <ToggleRow
            label="Featured product"
            description="Use for highlighted collections or homepage blocks."
            checked={product.isFeatured}
            onCheckedChange={(checked) => updateProductField("isFeatured", checked)}
          />
          <Separator />
          <ToggleRow
            label="Has variants"
            description="Turns on the nested variant and option editor below."
            checked={product.hasVariants}
            onCheckedChange={toggleHasVariants}
          />
          <Separator />
          <ToggleRow
            label="Digital product"
            description="Leave off for physical products that ship to customers."
            checked={product.isDigital}
            onCheckedChange={(checked) => updateProductField("isDigital", checked)}
          />
        </div>
      </SectionCard>

      <Card className="overflow-hidden rounded-3xl border-slate-200 bg-slate-950 text-white">
        <CardHeader className="border-b border-white/10 pb-6">
          <CardTitle className="text-xl text-white">Product summary</CardTitle>
          <CardDescription className="text-slate-300">
            Quick merchant snapshot before saving.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <SidebarMetric
            label="Brand"
            value={product.brand || "Not set"}
            caption="Vendor label"
          />
          <SidebarMetric
            label="Category"
            value={metrics.categoryLabel}
            caption={product.categoryId ? shortId(product.categoryId) : "No category"}
          />
          <SidebarMetric
            label="Variants"
            value={`${product.variants.length} groups`}
            caption={`${metrics.totalOptions} options`}
          />
          <SidebarMetric
            label="Stock"
            value={`${product.hasVariants ? metrics.totalStock : product.stock ?? 0} units`}
            caption={
              product.hasVariants ? "Summed from option rows" : "Stored on product"
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
