"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  startGlobalRouteLoading,
  useGlobalLoading,
} from "@/components/providers/global-loading-provider";
import { createProduct } from "@/services/products/createProduct";
import { ProductAttributesSection } from "./components/ProductAttributesSection";
import { ProductEditorHeader } from "./components/ProductEditorHeader";
import { ProductEditorSidebar } from "./components/ProductEditorSidebar";
import { ProductGeneralSection } from "./components/ProductGeneralSection";
import { ProductSeoSection } from "./components/ProductSeoSection";
import { ProductVariantsSection } from "./components/ProductVariantsSection";
import type { ProductCategory, ProductPayload } from "./product-editor-types";
import { useProductEditor } from "./useProductEditor";

type ProductEditorPageProps = {
  initialCategories?: ProductCategory[];
  categoryLoadError?: string | null;
};

type SubmitIntent = "draft" | "publish";

function getOptionalString(value: string) {
  const normalizedValue = value.trim();

  return normalizedValue || undefined;
}

function getOptionalNumber(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function getOptionalInteger(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.trunc(value))
    : undefined;
}

function getNormalizedIds(ids: string[]) {
  const normalizedIds = ids.map((id) => id.trim()).filter(Boolean);

  return normalizedIds.length ? normalizedIds : undefined;
}

function validateProduct(product: ProductPayload) {
  if (!product.title.trim()) {
    return "Product title is required.";
  }

  if (!product.slug.trim()) {
    return "Product slug is required.";
  }

  if (!product.description.trim()) {
    return "Product description is required.";
  }

  if (!Number.isFinite(product.price) || product.price < 0) {
    return "Base price must be a valid non-negative number.";
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
      }
    }

    return null;
  }

  if (product.stock !== null && (!Number.isFinite(product.stock) || product.stock < 0)) {
    return "Stock must be a valid non-negative integer.";
  }

  return null;
}

function buildCreateProductPayload(
  product: ProductPayload,
  intent: SubmitIntent,
): Parameters<typeof createProduct>[0] {
  const requestPayload: Parameters<typeof createProduct>[0] = {
    title: product.title.trim(),
    slug: product.slug.trim(),
    price: product.price,
    hasVariants: product.hasVariants,
    isActive: intent === "publish",
    isFeatured: product.isFeatured,
    isDigital: product.isDigital,
    lowStockThreshold: Math.max(0, Math.trunc(product.lowStockThreshold)),
  };

  const description = getOptionalString(product.description);
  const shortDesc = getOptionalString(product.shortDesc);
  const brand = getOptionalString(product.brand);
  const categoryId = getOptionalString(product.categoryId);
  const compareAtPrice = getOptionalNumber(product.compareAtPrice);
  const costPrice = getOptionalNumber(product.costPrice);
  const metaTitle = getOptionalString(product.metaTitle);
  const metaDescription = getOptionalString(product.metaDescription);
  const metaKeywords = getOptionalString(product.metaKeywords);
  const imageIds = getNormalizedIds(product.imageIds);

  if (description) {
    requestPayload.description = description;
  }

  if (shortDesc) {
    requestPayload.shortDesc = shortDesc;
  }

  if (brand) {
    requestPayload.brand = brand;
  }

  if (categoryId) {
    requestPayload.categoryId = categoryId;
  }

  if (compareAtPrice !== undefined) {
    requestPayload.compareAtPrice = compareAtPrice;
  }

  if (costPrice !== undefined) {
    requestPayload.costPrice = costPrice;
  }

  if (metaTitle) {
    requestPayload.metaTitle = metaTitle;
  }

  if (metaDescription) {
    requestPayload.metaDescription = metaDescription;
  }

  if (metaKeywords) {
    requestPayload.metaKeywords = metaKeywords;
  }

  if (imageIds) {
    requestPayload.imageIds = imageIds;
  }

  if (product.hasVariants) {
    requestPayload.variants = product.variants.map((variant) => {
      const variantImageIds = getNormalizedIds(variant.imageIds);

      return {
        title: variant.title.trim(),
        isActive: variant.isActive,
        ...(variantImageIds ? { imageIds: variantImageIds } : {}),
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
            ...(optionImageIds ? { imageIds: optionImageIds } : {}),
          };
        }),
      };
    });

    return requestPayload;
  }

  const sku = getOptionalString(product.sku);
  const barcode = getOptionalString(product.barcode);
  const stock = getOptionalInteger(product.stock);

  if (sku) {
    requestPayload.sku = sku;
  }

  if (barcode) {
    requestPayload.barcode = barcode;
  }

  if (stock !== undefined) {
    requestPayload.stock = stock;
  }

  return requestPayload;
}

export default function ProductEditorPage({
  initialCategories = [],
  categoryLoadError = null,
}: ProductEditorPageProps) {
  const router = useRouter();
  const { withLoading } = useGlobalLoading();
  const [submitIntent, setSubmitIntent] = useState<SubmitIntent | null>(null);
  const {
    product,
    categories,
    metrics,
    updateProductField,
    updateVariantField,
    updateOptionField,
    addVariant,
    removeVariant,
    addOption,
    removeOption,
    toggleHasVariants,
  } = useProductEditor(initialCategories);

  const handleSubmit = async (intent: SubmitIntent) => {
    const validationMessage = validateProduct(product);

    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    setSubmitIntent(intent);

    try {
      const result = await withLoading(
        intent === "draft" ? "Saving product draft..." : "Publishing product...",
        async () => createProduct(buildCreateProductPayload(product, intent)),
      );

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      startGlobalRouteLoading();
      router.push("/admin/products");
      router.refresh();
    } finally {
      setSubmitIntent(null);
    }
  };

  return (
    <div className="space-y-6">
      {categoryLoadError ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {categoryLoadError} Products can still be created without a category.
        </div>
      ) : null}

      <ProductEditorHeader
        product={product}
        metrics={metrics}
        submitIntent={submitIntent}
        onSaveDraft={() => void handleSubmit("draft")}
        onPublish={() => void handleSubmit("publish")}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <ProductGeneralSection
            product={product}
            categories={categories}
            updateProductField={updateProductField}
          />
          <ProductAttributesSection attributeGroups={metrics.attributeGroups} />
          <ProductVariantsSection
            hasVariants={product.hasVariants}
            basePrice={product.price}
            variants={product.variants}
            updateVariantField={updateVariantField}
            updateOptionField={updateOptionField}
            addVariant={addVariant}
            removeVariant={removeVariant}
            addOption={addOption}
            removeOption={removeOption}
          />
          <ProductSeoSection
            product={product}
            updateProductField={updateProductField}
          />
        </div>

        <ProductEditorSidebar
          product={product}
          metrics={metrics}
          updateProductField={updateProductField}
          toggleHasVariants={toggleHasVariants}
        />
      </div>
    </div>
  );
}
