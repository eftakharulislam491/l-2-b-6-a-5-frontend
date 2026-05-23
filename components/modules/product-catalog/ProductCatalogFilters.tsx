import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { formatCurrency } from "./catalog-utils";
import type { CatalogStockFilter } from "./types";

type ProductCatalogFiltersProps = {
  categoryOptions: string[];
  selectedCategories: string[];
  stockFilter: CatalogStockFilter;
  featuredOnly: boolean;
  priceBounds: [number, number];
  priceRange: [number, number];
  onCategoryToggle: (category: string, checked: boolean) => void;
  onRemoveCategory: (category: string) => void;
  onStockFilterChange: (value: CatalogStockFilter) => void;
  onFeaturedOnlyChange: (value: boolean) => void;
  onPriceRangeChange: (value: [number, number]) => void;
  onReset: () => void;
};

const STOCK_FILTERS: Array<{
  label: string;
  value: CatalogStockFilter;
}> = [
  { label: "All", value: "all" },
  { label: "In Stock", value: "in_stock" },
  { label: "Out of Stock", value: "out_of_stock" },
];

export default function ProductCatalogFilters({
  categoryOptions,
  selectedCategories,
  stockFilter,
  featuredOnly,
  priceBounds,
  priceRange,
  onCategoryToggle,
  onRemoveCategory,
  onStockFilterChange,
  onFeaturedOnlyChange,
  onPriceRangeChange,
  onReset,
}: ProductCatalogFiltersProps) {
  const hasPriceSpread = priceBounds[0] !== priceBounds[1];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Filters</p>
          <p className="mt-1 text-xs text-slate-500">
            Refine the real product list.
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-8 rounded-full px-3"
        >
          Reset
        </Button>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Categories
        </p>

        <div className="space-y-2">
          {categoryOptions.length > 0 ? (
            categoryOptions.map((category) => (
              <label
                key={category}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-100 px-3 py-2 text-sm"
              >
                <span className="text-slate-700">{category}</span>
                <Checkbox
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) =>
                    onCategoryToggle(category, checked === true)
                  }
                />
              </label>
            ))
          ) : (
            <p className="text-sm text-slate-500">No categories available.</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Availability
        </p>

        <div className="flex flex-wrap gap-2">
          {STOCK_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => onStockFilterChange(filter.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                stockFilter === filter.value
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Price Range
        </p>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-4 text-xs font-medium text-slate-600">
            <span>{formatCurrency(priceRange[0])}</span>
            <span>{formatCurrency(priceRange[1])}</span>
          </div>

          {hasPriceSpread ? (
            <div className="mt-4">
              <Slider
                value={[priceRange[0], priceRange[1]]}
                min={priceBounds[0]}
                max={priceBounds[1]}
                step={1}
                onValueChange={(value) =>
                  onPriceRangeChange([value[0], value[1]])
                }
              />
            </div>
          ) : (
            <p className="mt-3 text-xs text-slate-500">
              All products currently share the same price.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Merchandising
        </p>

        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-100 px-3 py-3 text-sm">
          <Checkbox
            checked={featuredOnly}
            onCheckedChange={(checked) => onFeaturedOnlyChange(checked === true)}
          />
          <span className="text-slate-700">Featured products only</span>
        </label>
      </div>

      {selectedCategories.length > 0 ? (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Active Categories
          </p>

          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <Badge key={category} variant="secondary" className="gap-1.5">
                {category}
                <button
                  type="button"
                  onClick={() => onRemoveCategory(category)}
                  className="rounded-full p-0.5 hover:bg-slate-200"
                  aria-label={`Remove ${category}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
