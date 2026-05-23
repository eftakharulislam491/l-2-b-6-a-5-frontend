"use client";

import { useMemo, useState } from "react";
import {
  createEmptyOption,
  createEmptyVariant,
  createInitialProduct,
} from "./product-editor-data";
import type {
  ProductCategory,
  ProductEditorMetrics,
  ProductPayload,
  UpdateOptionField,
  UpdateProductField,
  UpdateVariantField,
} from "./product-editor-types";
import { getProductMetrics } from "./product-editor-utils";

type ProductEditorState = {
  product: ProductPayload;
  categories: ProductCategory[];
  metrics: ProductEditorMetrics;
  updateProductField: UpdateProductField;
  updateVariantField: UpdateVariantField;
  updateOptionField: UpdateOptionField;
  addVariant: () => void;
  removeVariant: (variantIndex: number) => void;
  addOption: (variantIndex: number) => void;
  removeOption: (variantIndex: number, optionIndex: number) => void;
  toggleHasVariants: (checked: boolean) => void;
};

export function useProductEditor(initialCategories: ProductCategory[]): ProductEditorState {
  const [product, setProduct] = useState<ProductPayload>(() => createInitialProduct());

  const metrics = useMemo(
    () => getProductMetrics(product, initialCategories),
    [initialCategories, product],
  );

  const updateProductField: UpdateProductField = (key, value) => {
    setProduct((current) => ({ ...current, [key]: value }));
  };

  const updateVariantField: UpdateVariantField = (variantIndex, key, value) => {
    setProduct((current) => ({
      ...current,
      variants: current.variants.map((variant, index) =>
        index === variantIndex ? { ...variant, [key]: value } : variant,
      ),
    }));
  };

  const updateOptionField: UpdateOptionField = (
    variantIndex,
    optionIndex,
    key,
    value,
  ) => {
    setProduct((current) => ({
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
    }));
  };

  const addVariant = () => {
    setProduct((current) => ({
      ...current,
      hasVariants: true,
      variants: [...current.variants, createEmptyVariant()],
    }));
  };

  const removeVariant = (variantIndex: number) => {
    setProduct((current) => {
      const nextVariants = current.variants.filter((_, index) => index !== variantIndex);

      return {
        ...current,
        variants: nextVariants,
        hasVariants: nextVariants.length > 0,
      };
    });
  };

  const addOption = (variantIndex: number) => {
    setProduct((current) => ({
      ...current,
      variants: current.variants.map((variant, index) =>
        index === variantIndex
          ? {
              ...variant,
              options: [...variant.options, createEmptyOption()],
            }
          : variant,
      ),
    }));
  };

  const removeOption = (variantIndex: number, optionIndex: number) => {
    setProduct((current) => ({
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
    }));
  };

  const toggleHasVariants = (checked: boolean) => {
    setProduct((current) => ({
      ...current,
      hasVariants: checked,
      variants: checked
        ? current.variants.length
          ? current.variants
          : [createEmptyVariant()]
        : [],
    }));
  };

  return {
    product,
    categories: initialCategories,
    metrics,
    updateProductField,
    updateVariantField,
    updateOptionField,
    addVariant,
    removeVariant,
    addOption,
    removeOption,
    toggleHasVariants,
  };
}
