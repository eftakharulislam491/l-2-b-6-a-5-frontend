import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, FolderClosed } from "lucide-react";
import type { CategoryNode } from "../category-types";
import { countNodes } from "../category-utils";

type CategoryTreeProps = {
  nodes: CategoryNode[];
  expandedIds: string[];
  focusedCategoryId: string | null;
  onToggleExpand: (categoryId: string) => void;
  onSelect: (categoryId: string) => void;
};

export function CategoryTree({
  nodes,
  expandedIds,
  focusedCategoryId,
  onToggleExpand,
  onSelect,
}: CategoryTreeProps) {
  return (
    <div className="space-y-2">
      {nodes.map((node) => {
        const hasChildren = node.children.length > 0;
        const isExpanded = expandedIds.includes(node.id);
        const isFocused = focusedCategoryId === node.id;
        const descendantCount = countNodes(node.children);

        return (
          <div key={node.id} className="space-y-2">
            <div className="flex items-start gap-2">
              <button
                type="button"
                onClick={() => {
                  if (hasChildren) {
                    onToggleExpand(node.id);
                  }
                }}
                className="mt-1 flex h-5 w-5 items-center justify-center rounded text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                {hasChildren ? (
                  isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )
                ) : (
                  <span className="block h-4 w-4" />
                )}
              </button>

              <button
                type="button"
                onClick={() => onSelect(node.id)}
                className={cn(
                  "flex min-w-0 flex-1 items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition",
                  isFocused
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-50",
                )}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <FolderClosed
                    className={cn(
                      "h-4 w-4 shrink-0",
                      isFocused ? "text-blue-600" : "text-amber-500",
                    )}
                  />
                  <span className="truncate text-sm font-medium">{node.name}</span>
                </span>

                <div className="flex items-center gap-2">
                  {!node.isActive ? (
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] text-slate-600">
                      Off
                    </span>
                  ) : null}
                  {descendantCount ? (
                    <span className="rounded-full bg-white px-2 py-0.5 text-[11px] text-slate-500 shadow-sm">
                      {descendantCount}
                    </span>
                  ) : null}
                </div>
              </button>
            </div>

            {hasChildren && isExpanded ? (
              <div className="ml-6 border-l border-dashed border-slate-300 pl-4">
                <CategoryTree
                  nodes={node.children}
                  expandedIds={expandedIds}
                  focusedCategoryId={focusedCategoryId}
                  onToggleExpand={onToggleExpand}
                  onSelect={onSelect}
                />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
