import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import type {
  ProductVariant,
  UpdateOptionField,
  UpdateVariantField,
} from "../product-editor-types";
import {
  currencyFormatter,
  getVariantStartingPrice,
  getVariantStock,
  toOptionalNumber,
  toRequiredInteger,
  toRequiredNumber,
} from "../product-editor-utils";
import {
  Field,
  IdChipInput,
  InfoRow,
  SectionCard,
} from "./ProductEditorPrimitives";
import { MediaUploadControl } from "../../shared/MediaUploadControl";

type ProductVariantsSectionProps = {
  hasVariants: boolean;
  basePrice: number;
  variants: ProductVariant[];
  updateVariantField: UpdateVariantField;
  updateOptionField: UpdateOptionField;
  addVariant: () => void;
  removeVariant: (variantIndex: number) => void;
  addOption: (variantIndex: number) => void;
  removeOption: (variantIndex: number, optionIndex: number) => void;
};

export function ProductVariantsSection({
  hasVariants,
  basePrice,
  variants,
  updateVariantField,
  updateOptionField,
  addVariant,
  removeVariant,
  addOption,
  removeOption,
}: ProductVariantsSectionProps) {
  return (
    <SectionCard
      title="Variants"
      description="Each card acts like a variation block, and every option row carries title, SKU, additional price, compare-at price, cost, stock, and images."
    >
      <div className="space-y-5">
        {hasVariants ? (
          variants.map((variant, variantIndex) => (
            <ProductVariantCard
              key={`variant-${variantIndex}`}
              variant={variant}
              variantIndex={variantIndex}
              basePrice={basePrice}
              updateVariantField={updateVariantField}
              updateOptionField={updateOptionField}
              addOption={addOption}
              removeVariant={removeVariant}
              removeOption={removeOption}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-6 text-slate-600">
            Variants are currently turned off. Enable them from the publishing
            panel or add a new group below.
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          className="rounded-full border-slate-300 bg-white text-slate-700"
          onClick={addVariant}
        >
          <Plus className="h-4 w-4" />
          Add variant group
        </Button>
      </div>
    </SectionCard>
  );
}

type ProductVariantCardProps = {
  variant: ProductVariant;
  variantIndex: number;
  basePrice: number;
  updateVariantField: UpdateVariantField;
  updateOptionField: UpdateOptionField;
  addOption: (variantIndex: number) => void;
  removeVariant: (variantIndex: number) => void;
  removeOption: (variantIndex: number, optionIndex: number) => void;
};

function ProductVariantCard({
  variant,
  variantIndex,
  basePrice,
  updateVariantField,
  updateOptionField,
  addOption,
  removeVariant,
  removeOption,
}: ProductVariantCardProps) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-5">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-lg font-semibold text-slate-900">
              Variant Group {variantIndex + 1}
            </p>
            <Badge
              className={cn(
                "rounded-full px-3 py-1",
                variant.isActive
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                  : "bg-slate-200 text-slate-600 hover:bg-slate-200",
              )}
            >
              {variant.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-sm leading-6 text-slate-600">
            Group title, shared media, and sellable options all stay nested
            together to match your API payload.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="rounded-full border-slate-300 bg-white text-slate-700"
          onClick={() => removeVariant(variantIndex)}
        >
          <Trash2 className="h-4 w-4" />
          Remove group
        </Button>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <Field label="Variant title" required>
            <Input
              value={variant.title}
              onChange={(event) =>
                updateVariantField(variantIndex, "title", event.target.value)
              }
              className="h-11 rounded-xl border-slate-200 bg-white"
              placeholder="Color: Black"
            />
          </Field>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Options</p>
                <p className="mt-1 text-sm text-slate-500">
                  Each row is one sellable option inside this variant.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-slate-300 bg-white text-slate-700"
                onClick={() => addOption(variantIndex)}
              >
                <Plus className="h-4 w-4" />
                Add option
              </Button>
            </div>

            <div className="mt-4 space-y-4">
              {variant.options.map((option, optionIndex) => (
                <div
                  key={`variant-${variantIndex}-option-${optionIndex}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Option {optionIndex + 1}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        SKU-level inventory plus any price added on top of the base product price
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
                        <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                          Active
                        </span>
                        <Switch
                          checked={option.isActive}
                          onCheckedChange={(checked) =>
                            updateOptionField(
                              variantIndex,
                              optionIndex,
                              "isActive",
                              checked,
                            )
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-10 rounded-full px-3 text-slate-600 hover:bg-slate-200"
                        disabled={variant.options.length === 1}
                        onClick={() => removeOption(variantIndex, optionIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove option</span>
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Field label="Option title" required>
                      <Input
                        value={option.title}
                        onChange={(event) =>
                          updateOptionField(
                            variantIndex,
                            optionIndex,
                            "title",
                            event.target.value,
                          )
                        }
                        className="h-11 rounded-xl border-slate-200 bg-white"
                        placeholder="Large jar"
                      />
                    </Field>

                    <Field label="SKU" required>
                      <Input
                        value={option.sku}
                        onChange={(event) =>
                          updateOptionField(
                            variantIndex,
                            optionIndex,
                            "sku",
                            event.target.value,
                          )
                        }
                        className="h-11 rounded-xl border-slate-200 bg-white"
                        placeholder="PRS-BLK-40"
                      />
                    </Field>

                    <Field label="Barcode">
                      <Input
                        value={option.barcode}
                        onChange={(event) =>
                          updateOptionField(
                            variantIndex,
                            optionIndex,
                            "barcode",
                            event.target.value,
                          )
                        }
                        className="h-11 rounded-xl border-slate-200 bg-white"
                        placeholder="890123450001"
                      />
                    </Field>

                    <Field label="Additional Price" required>
                      <Input
                        type="number"
                        value={option.price}
                        onChange={(event) =>
                          updateOptionField(
                            variantIndex,
                            optionIndex,
                            "price",
                            toRequiredNumber(event.target.value),
                          )
                        }
                        className="h-11 rounded-xl border-slate-200 bg-white"
                      />
                    </Field>

                    <Field label="Compare At Price">
                      <Input
                        type="number"
                        value={option.compareAtPrice ?? ""}
                        onChange={(event) =>
                          updateOptionField(
                            variantIndex,
                            optionIndex,
                            "compareAtPrice",
                            toOptionalNumber(event.target.value),
                          )
                        }
                        className="h-11 rounded-xl border-slate-200 bg-white"
                      />
                    </Field>

                    <Field label="Cost Price">
                      <Input
                        type="number"
                        value={option.costPrice ?? ""}
                        onChange={(event) =>
                          updateOptionField(
                            variantIndex,
                            optionIndex,
                            "costPrice",
                            toOptionalNumber(event.target.value),
                          )
                        }
                        className="h-11 rounded-xl border-slate-200 bg-white"
                      />
                    </Field>

                    <Field label="Stock">
                      <Input
                        type="number"
                        value={option.stock}
                        onChange={(event) =>
                          updateOptionField(
                            variantIndex,
                            optionIndex,
                            "stock",
                            toRequiredInteger(event.target.value),
                          )
                        }
                        className="h-11 rounded-xl border-slate-200 bg-white"
                      />
                    </Field>
                  </div>

                  <div className="mt-4 space-y-4">
                    <Field label="Option media">
                      <MediaUploadControl
                        multiple
                        onUploaded={(items) =>
                          updateOptionField(
                            variantIndex,
                            optionIndex,
                            "imageIds",
                            [
                              ...new Set([
                                ...option.imageIds,
                                ...items.map((item) => item.id),
                              ]),
                            ],
                          )
                        }
                      />
                    </Field>

                    <Field label="Option Image IDs">
                      <IdChipInput
                        ids={option.imageIds}
                        onChange={(ids) =>
                          updateOptionField(
                            variantIndex,
                            optionIndex,
                            "imageIds",
                            ids,
                          )
                        }
                        placeholder="Add option image id"
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Variant status
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Control visibility of this group
                </p>
              </div>
              <Switch
                checked={variant.isActive}
                onCheckedChange={(checked) =>
                  updateVariantField(variantIndex, "isActive", checked)
                }
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">
              Shared variant image IDs
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              These IDs belong to the whole variant group.
            </p>
            <div className="mt-4 space-y-4">
              <MediaUploadControl
                multiple
                onUploaded={(items) =>
                  updateVariantField(variantIndex, "imageIds", [
                    ...new Set([
                      ...variant.imageIds,
                      ...items.map((item) => item.id),
                    ]),
                  ])
                }
              />
              <IdChipInput
                ids={variant.imageIds}
                onChange={(ids) => updateVariantField(variantIndex, "imageIds", ids)}
                placeholder="Add variant image id"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Group summary</p>
            <div className="mt-4 space-y-3">
              <InfoRow label="Option count" value={String(variant.options.length)} />
              <InfoRow label="Stock" value={`${getVariantStock(variant)} units`} />
              <InfoRow
                label="Starting at"
                value={currencyFormatter.format(
                  getVariantStartingPrice(basePrice, variant),
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
