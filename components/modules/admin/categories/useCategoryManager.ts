"use client";

import { useMemo, useState } from "react";
import { useGlobalLoading } from "@/components/providers/global-loading-provider";
import { createCategory } from "@/services/category/createCategory";
import { createEmptyCategory } from "./category-data";
import type {
  CategoryParentOption,
  CategoryPayload,
  CategoryNode,
  EditorMode,
  EditorTab,
} from "./category-types";
import {
  addChildCategory,
  findCategoryBySlug,
  findCategoryById,
  findCategoryPath,
  findFirstCategoryId,
  flattenCategoryOptions,
  formatSavedAt,
  getCategoryStats,
  getExpandableIds,
  normalizeSlug,
  slugify,
  toPayload,
  updateCategoryById,
  removeCategoryById,
} from "./category-utils";

export function useCategoryManager(initialCategories: CategoryNode[]) {
  const { isLoading, withLoading } = useGlobalLoading();
  const initialFocusedId = initialCategories[0]?.id ?? null;
  const initialFocusedCategory = initialFocusedId
    ? findCategoryById(initialCategories, initialFocusedId)
    : null;

  const [categories, setCategories] = useState<CategoryNode[]>(initialCategories);
  const [focusedCategoryId, setFocusedCategoryId] = useState<string | null>(
    initialFocusedId,
  );
  const [editorMode, setEditorMode] = useState<EditorMode>(
    initialFocusedCategory ? "edit" : "create-root",
  );
  const [activeTab, setActiveTab] = useState<EditorTab>("general");
  const [form, setForm] = useState<CategoryPayload>(
    initialFocusedCategory ? toPayload(initialFocusedCategory) : createEmptyCategory(),
  );
  const [expandedIds, setExpandedIds] = useState<string[]>(
    getExpandableIds(initialCategories),
  );
  const [savedAt, setSavedAt] = useState("Not saved yet");

  const focusedCategory = focusedCategoryId
    ? findCategoryById(categories, focusedCategoryId)
    : null;
  const focusedPath = focusedCategoryId
    ? findCategoryPath(categories, focusedCategoryId)
    : [];
  const selectedParentPath = form.parentId
    ? findCategoryPath(categories, form.parentId)
    : [];
  const stats = useMemo(() => getCategoryStats(categories), [categories]);
  const parentOptions = useMemo<CategoryParentOption[]>(
    () => flattenCategoryOptions(categories),
    [categories],
  );

  const editorTitle =
    editorMode === "edit"
      ? "Category details"
      : editorMode === "create-child"
        ? "Add Subcategory"
        : "Add Root Category";

  const editorDescription =
    editorMode === "edit"
      ? "Update the selected category or remove it from the nested structure."
      : editorMode === "create-child"
        ? "Create a child category under the currently selected parent."
        : "Create a new root category that will appear at the top level on the left.";

  const canSave = Boolean(form.name.trim() && form.slug.trim());
  const selectedPathLabel =
    editorMode === "edit"
      ? focusedPath.map((item) => item.name).join(" / ")
      : selectedParentPath.length
        ? `${selectedParentPath.map((item) => item.name).join(" / ")} / New category`
        : "New root category";

  const updateField = <Key extends keyof CategoryPayload>(
    key: Key,
    value: CategoryPayload[Key],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: key === "slug" && typeof value === "string" ? normalizeSlug(value) : value,
    }));
  };

  const handleSelectCategory = (categoryId: string) => {
    const selected = findCategoryById(categories, categoryId);

    if (!selected) {
      return;
    }

    setFocusedCategoryId(categoryId);
    setEditorMode("edit");
    setForm(toPayload(selected));
    setActiveTab("general");
  };

  const handleAddRoot = () => {
    setEditorMode("create-root");
    setForm(createEmptyCategory());
    setActiveTab("general");
  };

  const handleAddChild = () => {
    if (!focusedCategoryId) {
      return;
    }

    if (!expandedIds.includes(focusedCategoryId)) {
      setExpandedIds((current) => [...current, focusedCategoryId]);
    }

    setEditorMode("create-child");
    setForm({
      ...createEmptyCategory(),
      parentId: focusedCategoryId,
    });
    setActiveTab("general");
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      return;
    }

    await withLoading(
      editorMode === "edit" ? "Updating category..." : "Creating category...",
      async () => {
        if (editorMode === "edit" && focusedCategoryId) {
          setCategories((current) =>
            updateCategoryById(current, focusedCategoryId, form),
          );
          setSavedAt(`Updated locally at ${formatSavedAt()}`);
          return;
        }

        const result = await createCategory(form);

        if (!result.success) {
          setSavedAt(`Create failed: ${result.message}`);
          return;
        }

        const nextCategories = result.categories.length
          ? result.categories
          : result.category
            ? result.category.parentId
              ? addChildCategory(categories, result.category.parentId, result.category)
              : [...categories, result.category]
            : categories;
        const nextFocusedCategory =
          (result.categoryId ? findCategoryById(nextCategories, result.categoryId) : null) ??
          findCategoryBySlug(nextCategories, form.slug);

        setCategories(nextCategories);
        setExpandedIds(getExpandableIds(nextCategories));
        setFocusedCategoryId(
          nextFocusedCategory?.id ?? findFirstCategoryId(nextCategories),
        );
        setEditorMode("edit");
        setForm(
          nextFocusedCategory ? toPayload(nextFocusedCategory) : createEmptyCategory(),
        );
        setSavedAt(`${result.message} at ${formatSavedAt()}`);
      },
    );
  };

  const handleDelete = async () => {
    if (editorMode !== "edit" || !focusedCategoryId) {
      return;
    }

    await withLoading("Deleting category...", async () => {
      const nextCategories = removeCategoryById(categories, focusedCategoryId);
      const nextFocusedId = findFirstCategoryId(nextCategories);
      const nextFocusedCategory = nextFocusedId
        ? findCategoryById(nextCategories, nextFocusedId)
        : null;

      setCategories(nextCategories);
      setExpandedIds(getExpandableIds(nextCategories));
      setFocusedCategoryId(nextFocusedId);

      if (nextFocusedCategory) {
        setEditorMode("edit");
        setForm(toPayload(nextFocusedCategory));
      } else {
        setEditorMode("create-root");
        setForm(createEmptyCategory());
      }

      setActiveTab("general");
      setSavedAt(`Removed locally at ${formatSavedAt()}`);
    });
  };

  const handleReset = () => {
    if (editorMode === "edit" && focusedCategory) {
      setForm(toPayload(focusedCategory));
      return;
    }

    setForm(
      editorMode === "create-child" && focusedCategoryId
        ? {
            ...createEmptyCategory(),
            parentId: focusedCategoryId,
          }
        : createEmptyCategory(),
    );
  };

  const handleGenerateSlug = () => {
    updateField("slug", slugify(form.name));
  };

  const handleToggleExpand = (categoryId: string) => {
    setExpandedIds((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId],
    );
  };

  const handleCollapseAll = () => {
    setExpandedIds([]);
  };

  const handleExpandAll = () => {
    setExpandedIds(getExpandableIds(categories));
  };

  return {
    categories,
    expandedIds,
    focusedCategory,
    focusedCategoryId,
    editorMode,
    activeTab,
    form,
    savedAt,
    isBusy: isLoading,
    stats,
    parentOptions,
    editorTitle,
    editorDescription,
    canSave,
    selectedPathLabel,
    setActiveTab,
    updateField,
    handleSelectCategory,
    handleAddRoot,
    handleAddChild,
    handleSave,
    handleDelete,
    handleReset,
    handleGenerateSlug,
    handleToggleExpand,
    handleCollapseAll,
    handleExpandAll,
  };
}
