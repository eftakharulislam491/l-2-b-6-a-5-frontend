"use client";

import { SlidersHorizontal } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ProductCatalogFilters from "./ProductCatalogFilters";
import ProductCatalogHeader from "./ProductCatalogHeader";
import ProductCatalogResults from "./ProductCatalogResults";
import type {
  CatalogProduct,
  CatalogSortKey,
  CatalogStockFilter,
} from "./types";
import { useProductCatalog } from "./useProductCatalog";

type ProductCatalogPageProps = {
  initialProducts: CatalogProduct[];
  initialLoadError?: string | null;
  initialQuery?: string;
  initialSelectedCategories?: string[];
  initialSort?: CatalogSortKey;
  initialStockFilter?: CatalogStockFilter;
  initialFeaturedOnly?: boolean;
};

export default function ProductCatalogPage({
  initialProducts,
  initialLoadError = null,
  initialQuery = "",
  initialSelectedCategories = [],
  initialSort = "featured",
  initialStockFilter = "all",
  initialFeaturedOnly = false,
}: ProductCatalogPageProps) {
  const { addItem } = useCart();
  const {
    query,
    setQuery,
    sort,
    setSort,
    categoryOptions,
    selectedCategories,
    toggleCategory,
    removeCategory,
    stockFilter,
    setStockFilter,
    featuredOnly,
    setFeaturedOnly,
    priceBounds,
    priceRange,
    setPriceRange,
    resetFilters,
    filteredProducts,
    visibleProducts,
    hasActiveFilters,
    totalPages,
    page,
    setPage,
    pageItems,
  } = useProductCatalog(initialProducts, {
    query: initialQuery,
    selectedCategories: initialSelectedCategories,
    sort: initialSort,
    stockFilter: initialStockFilter,
    featuredOnly: initialFeaturedOnly,
  });

  const handleAddToCart = async (product: CatalogProduct) => {
    await addItem({
      productId: product.id,
      variantOptionIds: product.defaultVariantOptionIds,
      quantity: 1,
    });
  };

  const filters = (
    <ProductCatalogFilters
      categoryOptions={categoryOptions}
      selectedCategories={selectedCategories}
      stockFilter={stockFilter}
      featuredOnly={featuredOnly}
      priceBounds={priceBounds}
      priceRange={priceRange}
      onCategoryToggle={toggleCategory}
      onRemoveCategory={removeCategory}
      onStockFilterChange={setStockFilter}
      onFeaturedOnlyChange={setFeaturedOnly}
      onPriceRangeChange={setPriceRange}
      onReset={resetFilters}
    />
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 sm:py-10">
        {initialLoadError ? (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {initialLoadError}
          </div>
        ) : null}

        <ProductCatalogHeader
          query={query}
          onQueryChange={setQuery}
          productCount={initialProducts.length}
          filtersTrigger={
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-11 rounded-full border-border px-5"
                  >
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[340px]">
                  <SheetHeader>
                    <SheetTitle>Product filters</SheetTitle>
                  </SheetHeader>

                  <div className="mt-6">{filters}</div>

                  <div className="mt-6 flex gap-2">
                    <Button className="w-full" onClick={resetFilters}>
                      Reset
                    </Button>
                    <SheetClose asChild>
                      <Button variant="outline" className="w-full">
                        Close
                      </Button>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          }
        />

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <Card className="rounded-[2rem] border border-border bg-card p-5 text-card-foreground shadow-sm">
              {filters}
            </Card>
          </aside>

          <ProductCatalogResults
            totalProducts={initialProducts.length}
            filteredCount={filteredProducts.length}
            visibleProducts={visibleProducts}
            hasActiveFilters={hasActiveFilters}
            sort={sort}
            page={page}
            totalPages={totalPages}
            pageItems={pageItems}
            onSortChange={setSort}
            onPageChange={setPage}
            onAddToCart={handleAddToCart}
            onReset={resetFilters}
          />
        </div>
      </div>
    </main>
  );
}
