"use client";

import * as React from "react";
import {
  buildPageItems,
  clamp,
  filterProducts,
  getPriceBounds,
  getUniqueCategories,
  sortProducts,
} from "./catalog-utils";
import type {
  CatalogProduct,
  CatalogSortKey,
  CatalogStockFilter,
} from "./types";

const PRODUCTS_PER_PAGE = 9;

type ProductCatalogInitialState = {
  query?: string;
  sort?: CatalogSortKey;
  selectedCategories?: string[];
  stockFilter?: CatalogStockFilter;
  featuredOnly?: boolean;
};

export function useProductCatalog(
  products: CatalogProduct[],
  initialState: ProductCatalogInitialState = {},
) {
  const categoryOptions = React.useMemo(
    () => getUniqueCategories(products),
    [products],
  );
  const priceBounds = React.useMemo(() => getPriceBounds(products), [products]);
  const initialSelectedCategories = React.useMemo(
    () =>
      (initialState.selectedCategories ?? []).filter((category) =>
        categoryOptions.includes(category),
      ),
    [categoryOptions, initialState.selectedCategories],
  );

  const [query, setQuery] = React.useState(initialState.query ?? "");
  const deferredQuery = React.useDeferredValue(query);
  const [sort, setSort] = React.useState<CatalogSortKey>(
    initialState.sort ?? "featured",
  );
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    initialSelectedCategories,
  );
  const [stockFilter, setStockFilter] =
    React.useState<CatalogStockFilter>(initialState.stockFilter ?? "all");
  const [featuredOnly, setFeaturedOnly] = React.useState(
    initialState.featuredOnly ?? false,
  );
  const [priceRange, setPriceRange] =
    React.useState<[number, number]>(priceBounds);
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    setQuery(initialState.query ?? "");
  }, [initialState.query]);

  React.useEffect(() => {
    setSort(initialState.sort ?? "featured");
  }, [initialState.sort]);

  React.useEffect(() => {
    setSelectedCategories(initialSelectedCategories);
  }, [initialSelectedCategories]);

  React.useEffect(() => {
    setStockFilter(initialState.stockFilter ?? "all");
  }, [initialState.stockFilter]);

  React.useEffect(() => {
    setFeaturedOnly(initialState.featuredOnly ?? false);
  }, [initialState.featuredOnly]);

  React.useEffect(() => {
    setPriceRange(priceBounds);
  }, [
    initialSelectedCategories,
    initialState.featuredOnly,
    initialState.query,
    initialState.sort,
    initialState.stockFilter,
    priceBounds,
  ]);

  React.useEffect(() => {
    setPage(1);
  }, [
    deferredQuery,
    sort,
    selectedCategories,
    stockFilter,
    featuredOnly,
    priceRange,
  ]);

  const filteredProducts = React.useMemo(
    () =>
      sortProducts(
        filterProducts(products, {
          query: deferredQuery,
          selectedCategories,
          stockFilter,
          featuredOnly,
          priceRange,
        }),
        sort,
      ),
    [
      products,
      deferredQuery,
      selectedCategories,
      stockFilter,
      featuredOnly,
      priceRange,
      sort,
    ],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  );

  React.useEffect(() => {
    setPage((currentPage) => clamp(currentPage, 1, totalPages));
  }, [totalPages]);

  const visibleProducts = React.useMemo(
    () =>
      filteredProducts.slice(
        (page - 1) * PRODUCTS_PER_PAGE,
        page * PRODUCTS_PER_PAGE,
      ),
    [filteredProducts, page],
  );

  const pageItems = React.useMemo(
    () => buildPageItems(page, totalPages),
    [page, totalPages],
  );

  const hasActiveFilters =
    query.trim().length > 0 ||
    selectedCategories.length > 0 ||
    stockFilter !== "all" ||
    featuredOnly ||
    priceRange[0] !== priceBounds[0] ||
    priceRange[1] !== priceBounds[1];

  const toggleCategory = React.useCallback(
    (category: string, checked: boolean) => {
      setSelectedCategories((currentCategories) => {
        if (checked) {
          return currentCategories.includes(category)
            ? currentCategories
            : [...currentCategories, category];
        }

        return currentCategories.filter(
          (currentCategory) => currentCategory !== category,
        );
      });
    },
    [],
  );

  const resetFilters = React.useCallback(() => {
    setQuery("");
    setSort("featured");
    setSelectedCategories([]);
    setStockFilter("all");
    setFeaturedOnly(false);
    setPriceRange(priceBounds);
    setPage(1);
  }, [priceBounds]);

  return {
    query,
    setQuery,
    sort,
    setSort,
    categoryOptions,
    selectedCategories,
    toggleCategory,
    removeCategory: (category: string) => toggleCategory(category, false),
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
  };
}
