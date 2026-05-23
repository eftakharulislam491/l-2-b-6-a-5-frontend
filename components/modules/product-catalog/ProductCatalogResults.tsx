import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ProductCatalogCard from "./ProductCatalogCard";
import ProductCatalogPagination from "./ProductCatalogPagination";
import type { CatalogProduct, CatalogSortKey } from "./types";

type ProductCatalogResultsProps = {
  totalProducts: number;
  filteredCount: number;
  visibleProducts: CatalogProduct[];
  hasActiveFilters: boolean;
  sort: CatalogSortKey;
  page: number;
  totalPages: number;
  pageItems: Array<number | "...">;
  onSortChange: (value: CatalogSortKey) => void;
  onPageChange: (page: number) => void;
  onAddToCart: (product: CatalogProduct) => void | Promise<void>;
  onReset: () => void;
};

export default function ProductCatalogResults({
  totalProducts,
  filteredCount,
  visibleProducts,
  hasActiveFilters,
  sort,
  page,
  totalPages,
  pageItems,
  onSortChange,
  onPageChange,
  onAddToCart,
  onReset,
}: ProductCatalogResultsProps) {
  return (
    <section>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {visibleProducts.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900">
              {filteredCount}
            </span>{" "}
            matching products
          </p>

          {hasActiveFilters ? (
            <p className="mt-1 text-xs text-slate-400">
              Filters are narrowing your live catalog results.
            </p>
          ) : null}
        </div>

        <Select
          value={sort}
          onValueChange={(value) => onSortChange(value as CatalogSortKey)}
        >
          <SelectTrigger className="h-10 w-full rounded-full bg-white sm:w-[220px]">
            <SelectValue placeholder="Sort products" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured first</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="title_asc">Title A-Z</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {visibleProducts.length === 0 ? (
        <Card className="rounded-[2rem] border-0 bg-white p-10 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            {totalProducts === 0
              ? "No products available right now."
              : "No products matched these filters."}
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            {totalProducts === 0
              ? "Once products are available from the API, they will appear here automatically."
              : "Try widening the filters or clear them to see more of the catalog."}
          </p>

          {hasActiveFilters ? (
            <div className="mt-5">
              <Button onClick={onReset} className="rounded-full px-6">
                Reset filters
              </Button>
            </div>
          ) : null}
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleProducts.map((product) => (
              <ProductCatalogCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>

          <div className="mt-10">
            <ProductCatalogPagination
              page={page}
              totalPages={totalPages}
              pageItems={pageItems}
              onPageChange={onPageChange}
            />
          </div>
        </>
      )}
    </section>
  );
}
