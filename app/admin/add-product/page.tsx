import type { CategoryNode } from "@/components/modules/admin/categories/category-types";
import ProductEditorPage from "@/components/modules/admin/products/ProductEditorPage";
import type { ProductCategory } from "@/components/modules/admin/products/product-editor-types";
import { getCategoryTree } from "@/services/category/createCategory";

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
  ]);
}

export default async function AddProductPage() {
  const { categories, error } = await getCategoryTree();

  return (
    <ProductEditorPage
      initialCategories={flattenProductCategories(categories)}
      categoryLoadError={error}
    />
  );
}
