import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Layers3, Plus } from "lucide-react";
import type { CategoryNode, CategoryStats } from "../category-types";
import { CategoryTree } from "./CategoryTree";
import { StatsPill } from "./CategoryFormPrimitives";

type CategorySidebarProps = {
  categories: CategoryNode[];
  expandedIds: string[];
  focusedCategoryId: string | null;
  stats: CategoryStats;
  loadError?: string | null;
  onAddRoot: () => void;
  onAddChild: () => void;
  onCollapseAll: () => void;
  onExpandAll: () => void;
  onToggleExpand: (categoryId: string) => void;
  onSelect: (categoryId: string) => void;
};

export function CategorySidebar({
  categories,
  expandedIds,
  focusedCategoryId,
  stats,
  loadError,
  onAddRoot,
  onAddChild,
  onCollapseAll,
  onExpandAll,
  onToggleExpand,
  onSelect,
}: CategorySidebarProps) {
  return (
    <Card className="overflow-hidden rounded-3xl border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-100 pb-5">
        <CardTitle className="text-xl text-slate-900">Category tree</CardTitle>
        <CardDescription className="text-slate-500">
          Click a category to edit it, or create a new root or nested category.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 pt-6">
        <div className="flex flex-col gap-3">
          <Button
            type="button"
            className="justify-start rounded-xl bg-slate-900 text-white hover:bg-slate-800"
            onClick={onAddRoot}
          >
            <Plus className="h-4 w-4" />
            Add Root Category
          </Button>
          <Button
            type="button"
            variant="outline"
            className="justify-start rounded-xl border-slate-300 bg-white text-slate-700 disabled:opacity-50"
            onClick={onAddChild}
            disabled={!focusedCategoryId}
          >
            <Layers3 className="h-4 w-4" />
            Add Subcategory
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatsPill label="Roots" value={String(stats.roots)} />
          <StatsPill label="Nested" value={String(stats.nested)} />
          <StatsPill label="Total" value={String(stats.total)} />
        </div>

        {loadError ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {loadError}
          </div>
        ) : null}

        <div className="flex items-center gap-3 text-sm">
          <button
            type="button"
            className="text-blue-600 transition hover:text-blue-700"
            onClick={onCollapseAll}
          >
            Collapse All
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            className="text-blue-600 transition hover:text-blue-700"
            onClick={onExpandAll}
          >
            Expand All
          </button>
        </div>

        <div className="max-h-[700px] overflow-y-auto pr-1">
          {categories.length ? (
            <CategoryTree
              nodes={categories}
              expandedIds={expandedIds}
              focusedCategoryId={focusedCategoryId}
              onToggleExpand={onToggleExpand}
              onSelect={onSelect}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
              {loadError ? (
                "Categories could not be loaded from the API."
              ) : (
                <>
                  No categories yet. Use{" "}
                  <span className="font-medium">Add Root Category</span> to create
                  the first one.
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
