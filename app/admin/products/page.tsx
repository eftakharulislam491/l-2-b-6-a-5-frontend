import AdminProductList from "@/components/modules/admin/products/AdminProductList"
import type { CategoryNode } from "@/components/modules/admin/categories/category-types"
import type { ProductCategory } from "@/components/modules/admin/products/product-editor-types"
import { getCategoryTree } from "@/services/category/createCategory"
import { getAllProducts } from "@/services/products/getAllProducts"

function flattenProductCategories(
  categories: CategoryNode[],
  depth = 0,
): ProductCategory[] {
  return categories.flatMap((category) => [
    {
      id: category.id,
      label: `${depth ? `${"-- ".repeat(depth)}` : ""}${category.name}`,
    },
    ...flattenProductCategories(category.children, depth + 1),
  ])
}

export default async function AdminProductsPage() {
  const [{ products, error }, { categories, error: categoryError }] =
    await Promise.all([getAllProducts(), getCategoryTree()])

  return (
    <div>
      <h1 className="text-3xl font-medium mb-5">All products</h1>
      <AdminProductList
        initialProducts={products}
        initialCategories={flattenProductCategories(categories)}
        initialLoadError={error}
        categoryLoadError={categoryError}
      />
    </div>
  )
}
