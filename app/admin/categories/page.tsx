import AddCategories from "@/components/modules/admin/categories/AddCategories";
import { getCategoryTree } from "@/services/category/createCategory";

export default async function AdminCategoriesPage() {
  const { categories, error } = await getCategoryTree();

  return <AddCategories initialCategories={categories} initialLoadError={error} />;
}
