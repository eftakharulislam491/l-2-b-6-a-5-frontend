'use client'

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { Loader2, MoreVertical, Plus, Upload, Search } from "lucide-react"
import Link from "next/link"
import { deleteProduct } from "@/services/products/deleteProduct"
import type { ProductListItem } from "@/services/products/getAllProducts"
import type { ProductCategory } from "./product-editor-types"
import AdminProductEditSheet from "./AdminProductEditSheet"

type AdminProductListProps = {
  initialProducts: ProductListItem[]
  initialCategories?: ProductCategory[]
  initialLoadError?: string | null
  categoryLoadError?: string | null
}

function parsePrice(value: string | null | undefined) {
  if (!value) {
    return null
  }

  const parsedValue = Number(value)

  return Number.isFinite(parsedValue) ? parsedValue : null
}

function getProductPrice(product: ProductListItem) {
  const directPrice = parsePrice(product.price)

  if (directPrice !== null) {
    return directPrice
  }

  for (const variant of product.variants) {
    for (const option of variant.options) {
      const optionPrice = parsePrice(option.price)

      if (optionPrice !== null) {
        return optionPrice
      }
    }
  }

  return 0
}

function getProductQuantity(product: ProductListItem) {
  if (typeof product.stock === "number") {
    return product.stock
  }

  let totalStock = 0
  let hasVariantStock = false

  for (const variant of product.variants) {
    for (const option of variant.options) {
      if (typeof option.stock === "number") {
        totalStock += option.stock
        hasVariantStock = true
      }
    }
  }

  return hasVariantStock ? totalStock : 0
}

function getCategoryLabel(product: ProductListItem) {
  return product.category?.name?.trim() || "Uncategorized"
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value)
}

function getInitial(title: string) {
  return title.trim().charAt(0).toUpperCase() || "P"
}

function updatePageAwareValue<Value>(
  setValue: (value: Value) => void,
  setCurrentPage: (value: number) => void,
  value: Value,
) {
  setValue(value)
  setCurrentPage(1)
}

export default function AdminProductList({
  initialProducts,
  initialCategories = [],
  initialLoadError = null,
  categoryLoadError = null,
}: AdminProductListProps) {
  const [products, setProducts] = useState(initialProducts)
  const [editingProduct, setEditingProduct] = useState<ProductListItem | null>(null)
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [rowsPerPage, setRowsPerPage] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const categoryFilterOptions = Array.from(
    new Set(products.map((product) => getCategoryLabel(product))),
  ).sort((left, right) => left.localeCompare(right))

  const editCategoryOptions = Array.from(
    new Map(
      [
        ...initialCategories.map((category) => [category.id, category] as const),
        ...products.flatMap((product) =>
          product.categoryId
            ? [
                [
                  product.categoryId,
                  {
                    id: product.categoryId,
                    label: getCategoryLabel(product),
                  },
                ] as const,
              ]
            : [],
        ),
      ],
    ).values(),
  ).sort((left, right) => left.label.localeCompare(right.label))

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const filteredProducts = products.filter((product) => {
    const quantity = getProductQuantity(product)
    const matchesSearch =
      normalizedSearch.length === 0 ||
      [
        product.title,
        product.brand ?? "",
        product.slug,
        getCategoryLabel(product),
      ].some((value) => value.toLowerCase().includes(normalizedSearch))
    const matchesCategory =
      categoryFilter === "all" || getCategoryLabel(product) === categoryFilter
    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "in" ? quantity > 0 : quantity <= 0)
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "publish" ? product.isActive : !product.isActive)

    return matchesSearch && matchesCategory && matchesStock && matchesStatus
  })

  const itemsPerPage =
    rowsPerPage === "all" ? filteredProducts.length || 1 : Number(rowsPerPage)
  const totalPages =
    rowsPerPage === "all"
      ? 1
      : Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage))
  const activePage = Math.min(currentPage, totalPages)

  const startIndex = rowsPerPage === "all" ? 0 : (activePage - 1) * itemsPerPage
  const visibleProducts =
    rowsPerPage === "all"
      ? filteredProducts
      : filteredProducts.slice(startIndex, startIndex + itemsPerPage)
  const showingFrom = filteredProducts.length === 0 ? 0 : startIndex + 1
  const showingTo =
    filteredProducts.length === 0
      ? 0
      : rowsPerPage === "all"
        ? filteredProducts.length
        : Math.min(startIndex + itemsPerPage, filteredProducts.length)

  async function handleDeleteProduct(product: ProductListItem) {
    const shouldDelete = window.confirm(
      `Delete "${product.title}"? This action cannot be undone.`,
    )

    if (!shouldDelete) {
      return
    }

    setDeletingProductId(product.id)

    try {
      const result = await deleteProduct(product.id)

      if (!result.success) {
        toast.error(result.message)
        return
      }

      setProducts((currentProducts) =>
        currentProducts.filter(
          (currentProduct) => currentProduct.id !== product.id,
        ),
      )
      setEditingProduct((currentProduct) =>
        currentProduct?.id === product.id ? null : currentProduct,
      )
      toast.success(result.message)
    } finally {
      setDeletingProductId(null)
    }
  }

  return (
    <>
      <div className="space-y-6 rounded-2xl border bg-white p-4 sm:p-6">
        {initialLoadError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {initialLoadError}
          </div>
        ) : null}

        {categoryLoadError ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {categoryLoadError} Product editing still works, but category choices are limited
            to the categories already visible in this list.
          </div>
        ) : null}

        {/* Filter Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Filter</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              value={categoryFilter}
              onValueChange={(value) =>
                updatePageAwareValue(setCategoryFilter, setCurrentPage, value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {categoryFilterOptions.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={stockFilter}
              onValueChange={(value) =>
                updatePageAwareValue(setStockFilter, setCurrentPage, value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="in">In Stock</SelectItem>
                <SelectItem value="out">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(value) =>
                updatePageAwareValue(setStatusFilter, setCurrentPage, value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="publish">Publish</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search + Actions */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) =>
                updatePageAwareValue(
                  setSearchTerm,
                  setCurrentPage,
                  event.target.value,
                )
              }
              placeholder="Search product"
              className="pl-9"
            />
          </div>

          <div className="flex w-full flex-wrap items-center gap-2 md:w-auto md:justify-end">
            <Select
              value={rowsPerPage}
              onValueChange={(value) =>
                updatePageAwareValue(setRowsPerPage, setCurrentPage, value)
              }
            >
              <SelectTrigger className="w-full sm:w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="secondary" className="w-full sm:w-auto">
              <Upload className="mr-2 h-4 w-4" />
              Export
            </Button>

            <Button asChild className="w-full sm:w-auto">
              <Link href="/admin/add-product">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><Checkbox /></TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>QTY</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {visibleProducts.map((product) => {
              const quantity = getProductQuantity(product)
              const categoryLabel = getCategoryLabel(product)
              const isLowStock =
                quantity > 0 &&
                typeof product.lowStockThreshold === "number" &&
                quantity <= product.lowStockThreshold
              const isDeleting = deletingProductId === product.id

              return (
              <TableRow key={product.id}>
                <TableCell><Checkbox /></TableCell>

                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                      <span className="text-sm font-semibold text-muted-foreground">
                        {getInitial(product.title)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{product.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.brand?.trim() || "No brand"}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>{categoryLabel}</TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch checked={quantity > 0} disabled />
                    <span className="text-xs text-muted-foreground">
                      {quantity > 0 ? "In stock" : "Out of stock"}
                    </span>
                  </div>
                </TableCell>

                <TableCell>{formatCurrency(getProductPrice(product))}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{quantity}</span>
                    {isLowStock ? (
                      <Badge variant="outline" className="rounded-full border-amber-200 text-amber-700">
                        Low
                      </Badge>
                    ) : null}
                  </div>
                </TableCell>

                <TableCell>
                  <Badge
                    variant={product.isActive ? "default" : "secondary"}
                    className="rounded-full"
                  >
                    {product.isActive ? "Publish" : "Inactive"}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" disabled={isDeleting}>
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MoreVertical className="h-4 w-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        disabled={isDeleting}
                        onSelect={() => setEditingProduct(product)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={isDeleting}
                        className="text-red-600 focus:text-red-600"
                        onSelect={() => {
                          void handleDeleteProduct(product)
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
              )
            })}

            {visibleProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                  {products.length === 0
                    ? "No products found yet."
                    : "No products matched your current filters."}
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {showingFrom} to {showingTo} of {filteredProducts.length} entries
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={activePage === 1 || totalPages === 1}
              onClick={() => setCurrentPage(Math.max(1, activePage - 1))}
            >
              Previous
            </Button>
            <Button size="sm" disabled={totalPages === 1}>
              {activePage}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={activePage === totalPages || totalPages === 1}
              onClick={() => setCurrentPage(Math.min(totalPages, activePage + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <AdminProductEditSheet
        product={editingProduct}
        open={editingProduct !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingProduct(null)
          }
        }}
        categories={editCategoryOptions}
        categoryLoadError={categoryLoadError}
        onProductUpdated={(updatedProduct) => {
          setProducts((currentProducts) =>
            currentProducts.map((currentProduct) =>
              currentProduct.id === updatedProduct.id
                ? updatedProduct
                : currentProduct,
            ),
          )
        }}
      />
    </>
  )
}
