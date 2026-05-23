"use client";

import { CategoryEditorPanel } from "./components/CategoryEditorPanel";
import { CategoryPageHeader } from "./components/CategoryPageHeader";
import { CategorySidebar } from "./components/CategorySidebar";
import { useCategoryManager } from "./useCategoryManager";
import type { CategoryNode } from "./category-types";

type AddCategoriesProps = {
  initialCategories: CategoryNode[];
  initialLoadError?: string | null;
};

export default function AddCategories({
  initialCategories,
  initialLoadError = null,
}: AddCategoriesProps) {
  const {
    categories,
    expandedIds,
    focusedCategory,
    focusedCategoryId,
    editorMode,
    activeTab,
    form,
    savedAt,
    stats,
    parentOptions,
    isBusy,
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
  } = useCategoryManager(initialCategories);

  return (
    <div className="space-y-6">
      <CategoryPageHeader />

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <CategorySidebar
          categories={categories}
          expandedIds={expandedIds}
          focusedCategoryId={focusedCategoryId}
          stats={stats}
          loadError={initialLoadError}
          onAddRoot={handleAddRoot}
          onAddChild={handleAddChild}
          onCollapseAll={handleCollapseAll}
          onExpandAll={handleExpandAll}
          onToggleExpand={handleToggleExpand}
          onSelect={handleSelectCategory}
        />

        <CategoryEditorPanel
          activeTab={activeTab}
          editorMode={editorMode}
          editorTitle={editorTitle}
          editorDescription={editorDescription}
          selectedPathLabel={selectedPathLabel}
          focusedCategory={focusedCategory}
          parentOptions={parentOptions}
          form={form}
          canSave={canSave}
          isBusy={isBusy}
          onTabChange={setActiveTab}
          onUpdateField={updateField}
          onGenerateSlug={handleGenerateSlug}
          onSave={handleSave}
          onDelete={handleDelete}
          onReset={handleReset}
          savedAt={savedAt}
        />
      </div>
    </div>
  );
}
