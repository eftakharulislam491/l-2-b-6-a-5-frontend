"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Package2, PencilLine, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { ProductListItem } from "@/services/products/getAllProducts";
import {
  updateProduct,
  type IUpdateProductPayload,
} from "@/services/products/updateProduct";
import { createEmptyOption, createEmptyVariant } from "./product-editor-data";
import type {
  ProductCategory,
  ProductOption,
  ProductPayload,
  ProductVariant,
} from "./product-editor-types";
import { currencyFormatter, getProductMetrics } from "./product-editor-utils";
import { ProductAttributesSection } from "./components/ProductAttributesSection";
import { ProductEditorSidebar } from "./components/ProductEditorSidebar";
import { ProductGeneralSection } from "./components/ProductGeneralSection";
import { ProductSeoSection } from "./components/ProductSeoSection";
import { ProductVariantsSection } from "./components/ProductVariantsSection";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type AdminProductEditSheetProps = {
  product: ProductListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: ProductCategory[];
  categoryLoadError?: string | null;
  onProductUpdated: (product: ProductListItem) => void;
};

function parseOptionalNumber(value: string | null | undefined): number | null {
  if (!value) {
    return null;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function getOptionalString(value: string): string | undefined {
  const normalizedValue = value.trim();

  return normalizedValue || undefined;
}

function getOptionalNumber(value: number | null | undefined): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function getOptionalInteger(value: number | null | undefined): number | undefined {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.trunc(value))
    : undefined;
}

function getNormalizedIds(ids: string[]): string[] {
  return Array.from(new Set(ids.map((id) => id.trim()).filter(Boolean)));
}

function getImageIds(items: Array<{ id?: string }>): string[] {
  return Array.from(
    new Set(
      items
        .map((item) => item.id)
        .filter((id): id is string => typeof id === "string" && id.trim().length > 0),
    ),
  );
}

function mapProductToPayload(product: ProductListItem): ProductPayload {
  return {
    title: product.title ?? "",
    slug: product.slug ?? "",
    description: product.description ?? "",
    shortDesc: product.shortDesc ?? "",
    brand: product.brand ?? "",
    categoryId: product.categoryId ?? "",
    hasVariants: Boolean(product.hasVariants),
    price: parseOptionalNumber(product.price) ?? 0,
    compareAtPrice: parseOptionalNumber(product.compareAtPrice),
    costPrice: parseOptionalNumber(product.costPrice),
    sku: product.sku ?? "",
    barcode: product.barcode ?? "",
    stock:
      typeof product.stock === "number" && Number.isFinite(product.stock)
        ? Math.max(0, Math.trunc(product.stock))
        : null,
    lowStockThreshold:
      typeof product.lowStockThreshold === "number" &&
      Number.isFinite(product.lowStockThreshold)
        ? Math.max(0, Math.trunc(product.lowStockThreshold))
        : 5,
    isActive: Boolean(product.isActive),
    isFeatured: Boolean(product.isFeatured),
    isDigital: Boolean(product.isDigital),
    metaTitle: product.metaTitle ?? "",
    metaDescription: product.metaDescription ?? "",
    metaKeywords: product.metaKeywords ?? "",
    imageIds: getImageIds(product.images),
    variants: product.variants.map((variant) => ({
      title: variant.title ?? "",
      isActive: Boolean(variant.isActive),
      imageIds: getImageIds(variant.images),
      options: variant.options.map((option) => ({
        title: option.title ?? "",
        sku: option.sku ?? "",
        barcode: option.barcode ?? "",
        price: parseOptionalNumber(option.price) ?? 0,
        compareAtPrice: parseOptionalNumber(option.compareAtPrice),
        costPrice: parseOptionalNumber(option.costPrice),
        stock:
          typeof option.stock === "number" && Number.isFinite(option.stock)
            ? Math.max(0, Math.trunc(option.stock))
            : 0,
        isActive: Boolean(option.isActive),
        imageIds: getImageIds(option.images),
      })),
    })),
  };
}

function validateProductEditor(product: ProductPayload): string | null {
  if (!product.title.trim()) {
    return "Product title is required.";
  }

  if (!product.slug.trim()) {
    return "Product slug is required.";
  }

  if (!slugRegex.test(product.slug.trim())) {
    return "Slug can contain lowercase letters, numbers, and single hyphens only.";
  }

  if (!Number.isFinite(product.price) || product.price < 0) {
    return "Base price must be a valid non-negative number.";
  }

  if (product.compareAtPrice !== null) {
    if (!Number.isFinite(product.compareAtPrice) || product.compareAtPrice < 0) {
      return "Compare at price must be a valid non-negative number.";
    }

    if (product.compareAtPrice < product.price) {
      return "Compare at price must be greater than or equal to price.";
    }
  }

  if (
    product.costPrice !== null &&
    (!Number.isFinite(product.costPrice) || product.costPrice < 0)
  ) {
    return "Cost price must be a valid non-negative number.";
  }

  if (
    !Number.isFinite(product.lowStockThreshold) ||
    product.lowStockThreshold < 0 ||
    !Number.isInteger(product.lowStockThreshold)
  ) {
    return "Low stock threshold must be a valid non-negative integer.";
  }

  if (product.hasVariants) {
    if (!product.variants.length) {
      return "Add at least one variant group or turn variants off.";
    }

    for (const [variantIndex, variant] of product.variants.entries()) {
      if (!variant.title.trim()) {
        return `Variant group ${variantIndex + 1} needs a title.`;
      }

      if (!variant.options.length) {
        return `Variant group ${variantIndex + 1} needs at least one option.`;
      }

      for (const [optionIndex, option] of variant.options.entries()) {
        if (!option.title.trim()) {
          return `Option ${optionIndex + 1} in variant group ${variantIndex + 1} needs a title.`;
        }

        if (!option.sku.trim()) {
          return `Option ${optionIndex + 1} in variant group ${variantIndex + 1} needs a SKU.`;
        }

        if (!Number.isFinite(option.price) || option.price < 0) {
          return `Option ${optionIndex + 1} in variant group ${variantIndex + 1} needs a valid non-negative additional price.`;
        }

        if (option.compareAtPrice !== null) {
          if (!Number.isFinite(option.compareAtPrice) || option.compareAtPrice < 0) {
            return `Option ${optionIndex + 1} in variant group ${variantIndex + 1} has an invalid compare at price.`;
          }

          if (option.compareAtPrice < option.price) {
            return `Option ${optionIndex + 1} in variant group ${variantIndex + 1} needs compare at price greater than or equal to additional price.`;
          }
        }

        if (option.costPrice !== null && option.costPrice < 0) {
          return `Option ${optionIndex + 1} in variant group ${variantIndex + 1} has an invalid cost price.`;
        }

        if (!Number.isFinite(option.stock) || option.stock < 0) {
          return `Option ${optionIndex + 1} in variant group ${variantIndex + 1} needs a valid non-negative stock value.`;
        }
      }
    }

    return null;
  }

  if (product.stock !== null && (!Number.isFinite(product.stock) || product.stock < 0)) {
    return "Stock must be a valid non-negative integer.";
  }

  return null;
}

function buildUpdatePayload(product: ProductPayload): IUpdateProductPayload {
  const payload: IUpdateProductPayload = {
    title: product.title.trim(),
    slug: product.slug.trim(),
    price: product.price,
    hasVariants: product.hasVariants,
    categoryId: getOptionalString(product.categoryId) ?? null,
    lowStockThreshold: Math.max(0, Math.trunc(product.lowStockThreshold)),
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    isDigital: product.isDigital,
    imageIds: getNormalizedIds(product.imageIds),
  };

  const description = getOptionalString(product.description);
  const shortDesc = getOptionalString(product.shortDesc);
  const brand = getOptionalString(product.brand);
  const compareAtPrice = getOptionalNumber(product.compareAtPrice);
  const costPrice = getOptionalNumber(product.costPrice);
  const metaTitle = getOptionalString(product.metaTitle);
  const metaDescription = getOptionalString(product.metaDescription);
  const metaKeywords = getOptionalString(product.metaKeywords);

  if (description) {
    payload.description = description;
  }

  if (shortDesc) {
    payload.shortDesc = shortDesc;
  }

  if (brand) {
    payload.brand = brand;
  }

  if (compareAtPrice !== undefined) {
    payload.compareAtPrice = compareAtPrice;
  }

  if (costPrice !== undefined) {
    payload.costPrice = costPrice;
  }

  if (metaTitle) {
    payload.metaTitle = metaTitle;
  }

  if (metaDescription) {
    payload.metaDescription = metaDescription;
  }

  if (metaKeywords) {
    payload.metaKeywords = metaKeywords;
  }

  if (product.hasVariants) {
    payload.variants = product.variants.map((variant) => {
      const variantImageIds = getNormalizedIds(variant.imageIds);

      return {
        title: variant.title.trim(),
        isActive: variant.isActive,
        ...(variantImageIds.length ? { imageIds: variantImageIds } : {}),
        options: variant.options.map((option) => {
          const optionTitle = getOptionalString(option.title);
          const barcode = getOptionalString(option.barcode);
          const optionCompareAtPrice = getOptionalNumber(option.compareAtPrice);
          const optionCostPrice = getOptionalNumber(option.costPrice);
          const stock = getOptionalInteger(option.stock);
          const optionImageIds = getNormalizedIds(option.imageIds);

          return {
            sku: option.sku.trim(),
            price: option.price,
            isActive: option.isActive,
            ...(optionTitle ? { title: optionTitle } : {}),
            ...(barcode ? { barcode } : {}),
            ...(optionCompareAtPrice !== undefined
              ? { compareAtPrice: optionCompareAtPrice }
              : {}),
            ...(optionCostPrice !== undefined ? { costPrice: optionCostPrice } : {}),
            ...(stock !== undefined ? { stock } : {}),
            ...(optionImageIds.length ? { imageIds: optionImageIds } : {}),
          };
        }),
      };
    });

    return payload;
  }

  const sku = getOptionalString(product.sku);
  const barcode = getOptionalString(product.barcode);
  const stock = getOptionalInteger(product.stock);

  if (sku) {
    payload.sku = sku;
  }

  if (barcode) {
    payload.barcode = barcode;
  }

  if (stock !== undefined) {
    payload.stock = stock;
  }

  return payload;
}

export default function AdminProductEditSheet({
  product,
  open,
  onOpenChange,
  categories,
  categoryLoadError = null,
  onProductUpdated,
}: AdminProductEditSheetProps) {
  const [editorProduct, setEditorProduct] = useState<ProductPayload | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open || !product) {
      return;
    }

    setEditorProduct(mapProductToPayload(product));
    setValidationMessage(null);
  }, [open, product]);

  const categoryOptions = useMemo(() => {
    const options = new Map<string, ProductCategory>();

    for (const category of categories) {
      options.set(category.id, category);
    }

    if (product?.categoryId && !options.has(product.categoryId)) {
      options.set(product.categoryId, {
        id: product.categoryId,
        label: product.category?.name?.trim() || "Current category",
      });
    }

    return Array.from(options.values()).sort((left, right) =>
      left.label.localeCompare(right.label),
    );
  }, [categories, product]);

  const metrics = useMemo(() => {
    if (!editorProduct) {
      return null;
    }

    return getProductMetrics(editorProduct, categoryOptions);
  }, [categoryOptions, editorProduct]);

  if (!product || !editorProduct || !metrics) {
    return null;
  }

  const currentPrice = Number.isFinite(editorProduct.price) ? editorProduct.price : 0;
  const totalQuantity = editorProduct.hasVariants
    ? metrics.totalStock
    : editorProduct.stock ?? 0;

  const updateProductField = <Key extends keyof ProductPayload>(
    key: Key,
    value: ProductPayload[Key],
  ) => {
    setEditorProduct((current) => (current ? { ...current, [key]: value } : current));
  };

  const updateVariantField = <Key extends keyof ProductVariant>(
    variantIndex: number,
    key: Key,
    value: ProductVariant[Key],
  ) => {
    setEditorProduct((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        variants: current.variants.map((variant, index) =>
          index === variantIndex ? { ...variant, [key]: value } : variant,
        ),
      };
    });
  };

  const updateOptionField = <Key extends keyof ProductOption>(
    variantIndex: number,
    optionIndex: number,
    key: Key,
    value: ProductOption[Key],
  ) => {
    setEditorProduct((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        variants: current.variants.map((variant, currentVariantIndex) =>
          currentVariantIndex === variantIndex
            ? {
                ...variant,
                options: variant.options.map((option, currentOptionIndex) =>
                  currentOptionIndex === optionIndex
                    ? { ...option, [key]: value }
                    : option,
                ),
              }
            : variant,
        ),
      };
    });
  };

  const addVariant = () => {
    setEditorProduct((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        hasVariants: true,
        variants: [...current.variants, createEmptyVariant()],
      };
    });
  };

  const removeVariant = (variantIndex: number) => {
    setEditorProduct((current) => {
      if (!current) {
        return current;
      }

      const nextVariants = current.variants.filter((_, index) => index !== variantIndex);

      return {
        ...current,
        variants: nextVariants,
        hasVariants: nextVariants.length > 0,
      };
    });
  };

  const addOption = (variantIndex: number) => {
    setEditorProduct((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        variants: current.variants.map((variant, index) =>
          index === variantIndex
            ? {
                ...variant,
                options: [...variant.options, createEmptyOption()],
              }
            : variant,
        ),
      };
    });
  };

  const removeOption = (variantIndex: number, optionIndex: number) => {
    setEditorProduct((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        variants: current.variants.map((variant, index) =>
          index === variantIndex
            ? {
                ...variant,
                options:
                  variant.options.length === 1
                    ? variant.options
                    : variant.options.filter(
                        (_, currentOptionIndex) => currentOptionIndex !== optionIndex,
                      ),
              }
            : variant,
        ),
      };
    });
  };

  const toggleHasVariants = (checked: boolean) => {
    setEditorProduct((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        hasVariants: checked,
        variants: checked
          ? current.variants.length
            ? current.variants
            : [createEmptyVariant()]
          : [],
      };
    });
  };

  const handleSubmit = async () => {
    const nextValidationMessage = validateProductEditor(editorProduct);

    if (nextValidationMessage) {
      setValidationMessage(nextValidationMessage);
      toast.error(nextValidationMessage);
      return;
    }

    setIsSaving(true);
    setValidationMessage(null);

    try {
      const result = await updateProduct(product.id, buildUpdatePayload(editorProduct));

      if (!result.success || !result.product) {
        const errorMessage = result.message || "Product update failed.";
        setValidationMessage(errorMessage);
        toast.error(errorMessage);
        return;
      }

      onProductUpdated(result.product);
      toast.success(result.message);
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-hidden border-l-0 p-0 sm:max-w-[1100px] sm:border-l">
        <div className="flex h-full flex-col bg-white">
          <SheetHeader className="border-b border-slate-200 bg-[linear-gradient(135deg,#f8fafc_0%,#eef2ff_100%)] px-6 py-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="rounded-full border-slate-300 bg-white/80 px-3 py-1 text-slate-700"
              >
                Full editor
              </Badge>
              <Badge
                variant={editorProduct.isActive ? "default" : "secondary"}
                className="rounded-full"
              >
                {editorProduct.isActive ? "Published" : "Inactive"}
              </Badge>
              {editorProduct.hasVariants ? (
                <Badge
                  variant="outline"
                  className="rounded-full border-sky-200 bg-sky-50 px-3 py-1 text-sky-700"
                >
                  Variant product
                </Badge>
              ) : null}
            </div>
            <SheetTitle className="mt-3 flex items-center gap-3 text-2xl text-slate-950">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-900 text-white">
                <PencilLine className="h-5 w-5" />
              </div>
              Edit {product.title}
            </SheetTitle>
            <SheetDescription className="max-w-3xl text-sm leading-6 text-slate-600">
              This editor now matches the add-product experience, including media IDs
              plus full variant and option editing inside the modal.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-slate-700 shadow-sm">
                    <Package2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Current Price
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-950">
                      {currencyFormatter.format(currentPrice)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-slate-700 shadow-sm">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Inventory
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-950">
                      {totalQuantity} units
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-slate-700 shadow-sm">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Product Type
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-950">
                      {editorProduct.hasVariants ? "Variant based" : "Simple product"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {categoryLoadError ? (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {categoryLoadError} You can still edit every field here, but category
                choices are limited to the categories already visible in the list.
              </div>
            ) : null}

            {validationMessage ? (
              <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {validationMessage}
              </div>
            ) : null}

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
              <div className="space-y-6">
                <ProductGeneralSection
                  product={editorProduct}
                  categories={categoryOptions}
                  updateProductField={updateProductField}
                />
                <ProductAttributesSection attributeGroups={metrics.attributeGroups} />
                <ProductVariantsSection
                  hasVariants={editorProduct.hasVariants}
                  basePrice={editorProduct.price}
                  variants={editorProduct.variants}
                  updateVariantField={updateVariantField}
                  updateOptionField={updateOptionField}
                  addVariant={addVariant}
                  removeVariant={removeVariant}
                  addOption={addOption}
                  removeOption={removeOption}
                />
                <ProductSeoSection
                  product={editorProduct}
                  updateProductField={updateProductField}
                />
              </div>

              <ProductEditorSidebar
                product={editorProduct}
                metrics={metrics}
                updateProductField={updateProductField}
                toggleHasVariants={toggleHasVariants}
              />
            </div>
          </div>

          <SheetFooter className="border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-slate-500">
              Product image IDs and variant trees are saved directly from this modal.
            </p>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-slate-300 bg-white text-slate-700"
                disabled={isSaving}
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="rounded-full bg-slate-900 text-white hover:bg-slate-800"
                disabled={isSaving}
                onClick={() => void handleSubmit()}
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
