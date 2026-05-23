import ProductCatalogPage from "@/components/modules/product-catalog/ProductCatalogPage";
import { mapProductsToCatalogProducts } from "@/components/modules/product-catalog/catalog-mappers";
import type {
  CatalogSortKey,
  CatalogStockFilter,
} from "@/components/modules/product-catalog/types";
import { getAllProducts } from "@/services/products/getAllProducts";

type ProductsPageProps = {
  searchParams: Promise<{
    query?: string | string[];
    category?: string | string[];
    sort?: string | string[];
    featured?: string | string[];
    stock?: string | string[];
  }>;
};

const VALID_SORTS: CatalogSortKey[] = [
  "featured",
  "newest",
  "price_asc",
  "price_desc",
  "title_asc",
];

const VALID_STOCK_FILTERS: CatalogStockFilter[] = [
  "all",
  "in_stock",
  "out_of_stock",
];

function getSingleSearchParam(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const { products, error } = await getAllProducts();
  const initialQuery = getSingleSearchParam(resolvedSearchParams.query)?.trim() ?? "";
  const initialCategory =
    getSingleSearchParam(resolvedSearchParams.category)?.trim() ?? "";
  const initialSortParam = getSingleSearchParam(resolvedSearchParams.sort)?.trim();
  const initialStockParam = getSingleSearchParam(resolvedSearchParams.stock)?.trim();
  const initialFeaturedParam = getSingleSearchParam(
    resolvedSearchParams.featured,
  )?.trim();

  const initialSort: CatalogSortKey = VALID_SORTS.includes(
    initialSortParam as CatalogSortKey,
  )
    ? (initialSortParam as CatalogSortKey)
    : "featured";
  const initialStockFilter: CatalogStockFilter = VALID_STOCK_FILTERS.includes(
    initialStockParam as CatalogStockFilter,
  )
    ? (initialStockParam as CatalogStockFilter)
    : "all";

  return (
    <ProductCatalogPage
      initialProducts={mapProductsToCatalogProducts(products)}
      initialLoadError={error}
      initialQuery={initialQuery}
      initialSelectedCategories={initialCategory ? [initialCategory] : []}
      initialSort={initialSort}
      initialFeaturedOnly={initialFeaturedParam === "true"}
      initialStockFilter={initialStockFilter}
    />
  );
}
