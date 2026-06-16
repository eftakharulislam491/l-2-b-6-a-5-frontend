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
          <p className="text-sm font-semibold text-foreground">Filters</p>
          <p className="mt-1 text-xs text-muted-foreground">
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
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Categories
        </p>

        <div className="space-y-2">
          {categoryOptions.length > 0 ? (
            categoryOptions.map((category) => (
              <label
                key={category}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-border bg-card px-3 py-2 text-sm"
              >
                <span className="text-card-foreground">{category}</span>
                <Checkbox
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) =>
                    onCategoryToggle(category, checked === true)
                  }
                />
              </label>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No categories available.</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
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
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-card-foreground hover:bg-secondary",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Price Range
        </p>

        <div className="rounded-2xl border border-border bg-muted p-4">
          <div className="flex items-center justify-between gap-4 text-xs font-medium text-muted-foreground">
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
            <p className="mt-3 text-xs text-muted-foreground">
              All products currently share the same price.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Merchandising
        </p>

        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-card px-3 py-3 text-sm">
          <Checkbox
            checked={featuredOnly}
            onCheckedChange={(checked) => onFeaturedOnlyChange(checked === true)}
          />
          <span className="text-card-foreground">Featured products only</span>
        </label>
      </div>

      {selectedCategories.length > 0 ? (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Active Categories
          </p>

          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <Badge key={category} variant="secondary" className="gap-1.5">
                {category}
                <button
                  type="button"
                  onClick={() => onRemoveCategory(category)}
                  className="rounded-full p-0.5 hover:bg-secondary"
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
