import type {
  CatalogProduct,
  CatalogSortKey,
  CatalogStockFilter,
} from "./types";

export type ProductCatalogFilterState = {
  query: string;
  selectedCategories: string[];
  stockFilter: CatalogStockFilter;
  featuredOnly: boolean;
  priceRange: [number, number];
};

function getCreatedAtTime(product: CatalogProduct) {
  const timestamp = new Date(product.createdAt).getTime();

  return Number.isFinite(timestamp) ? timestamp : 0;
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function buildPageItems(
  currentPage: number,
  totalPages: number,
): Array<number | "..."> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: Array<number | "..."> = [1];

  if (currentPage > 3) {
    items.push("...");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let page = start; page <= end; page += 1) {
    items.push(page);
  }

  if (currentPage < totalPages - 2) {
    items.push("...");
  }

  items.push(totalPages);

  return items;
}

export function getUniqueCategories(products: CatalogProduct[]) {
  return Array.from(
    new Set(products.map((product) => product.categoryLabel).filter(Boolean)),
  ).sort((left, right) => left.localeCompare(right));
}

export function getPriceBounds(products: CatalogProduct[]): [number, number] {
  if (!products.length) {
    return [0, 0];
  }

  const prices = products.map((product) => product.price);

  return [Math.min(...prices), Math.max(...prices)];
}

export function filterProducts(
  products: CatalogProduct[],
  filters: ProductCatalogFilterState,
) {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return products.filter((product) => {
    if (normalizedQuery) {
      const searchValues = [
        product.title,
        product.slug,
        product.brand ?? "",
        product.categoryLabel,
      ].join(" ");

      if (!searchValues.toLowerCase().includes(normalizedQuery)) {
        return false;
      }
    }

    if (
      filters.selectedCategories.length > 0 &&
      !filters.selectedCategories.includes(product.categoryLabel)
    ) {
      return false;
    }

    if (filters.stockFilter === "in_stock" && !product.inStock) {
      return false;
    }

    if (filters.stockFilter === "out_of_stock" && product.inStock) {
      return false;
    }

    if (filters.featuredOnly && !product.isFeatured) {
      return false;
    }

    if (
      product.price < filters.priceRange[0] ||
      product.price > filters.priceRange[1]
    ) {
      return false;
    }

    return true;
  });
}

export function sortProducts(
  products: CatalogProduct[],
  sort: CatalogSortKey,
) {
  return [...products].sort((left, right) => {
    switch (sort) {
      case "price_asc":
        return left.price - right.price || left.title.localeCompare(right.title);
      case "price_desc":
        return (
          right.price - left.price || left.title.localeCompare(right.title)
        );
      case "title_asc":
        return left.title.localeCompare(right.title);
      case "newest":
        return getCreatedAtTime(right) - getCreatedAtTime(left);
      case "featured":
      default:
        return (
          Number(right.isFeatured) - Number(left.isFeatured) ||
          Number(right.inStock) - Number(left.inStock) ||
          getCreatedAtTime(right) - getCreatedAtTime(left)
        );
    }
  });
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);
}
