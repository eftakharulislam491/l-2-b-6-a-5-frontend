import type {
  CategoryParentOption,
  CategoryNode,
  CategoryPayload,
  CategoryStats,
} from "./category-types";

export function toPayload(category: CategoryNode): CategoryPayload {
  return {
    name: category.name,
    slug: category.slug,
    description: category.description,
    isActive: category.isActive,
    sortOrder: category.sortOrder,
    image: category.image,
    metaTitle: category.metaTitle,
    metaDescription: category.metaDescription,
    metaKeywords: category.metaKeywords,
    parentId: category.parentId,
  };
}

export function findCategoryById(
  categories: CategoryNode[],
  categoryId: string,
): CategoryNode | null {
  for (const category of categories) {
    if (category.id === categoryId) {
      return category;
    }

    const childMatch = findCategoryById(category.children, categoryId);

    if (childMatch) {
      return childMatch;
    }
  }

  return null;
}

export function findCategoryPath(
  categories: CategoryNode[],
  categoryId: string,
  path: CategoryNode[] = [],
): CategoryNode[] {
  for (const category of categories) {
    const nextPath = [...path, category];

    if (category.id === categoryId) {
      return nextPath;
    }

    const childPath = findCategoryPath(category.children, categoryId, nextPath);

    if (childPath.length) {
      return childPath;
    }
  }

  return [];
}

export function updateCategoryById(
  categories: CategoryNode[],
  categoryId: string,
  payload: CategoryPayload,
): CategoryNode[] {
  return categories.map((category) => {
    if (category.id === categoryId) {
      return {
        ...category,
        ...payload,
      };
    }

    return {
      ...category,
      children: updateCategoryById(category.children, categoryId, payload),
    };
  });
}

export function addChildCategory(
  categories: CategoryNode[],
  parentId: string,
  childCategory: CategoryNode,
): CategoryNode[] {
  return categories.map((category) => {
    if (category.id === parentId) {
      return {
        ...category,
        children: [...category.children, childCategory],
      };
    }

    return {
      ...category,
      children: addChildCategory(category.children, parentId, childCategory),
    };
  });
}

export function removeCategoryById(
  categories: CategoryNode[],
  categoryId: string,
): CategoryNode[] {
  return categories
    .filter((category) => category.id !== categoryId)
    .map((category) => ({
      ...category,
      children: removeCategoryById(category.children, categoryId),
    }));
}

export function countNodes(categories: CategoryNode[]): number {
  return categories.reduce(
    (total, category) => total + 1 + countNodes(category.children),
    0,
  );
}

export function getCategoryStats(categories: CategoryNode[]): CategoryStats {
  const roots = categories.length;
  const total = countNodes(categories);

  return {
    roots,
    total,
    nested: Math.max(total - roots, 0),
  };
}

export function getExpandableIds(categories: CategoryNode[]): string[] {
  return categories.flatMap((category) => [
    ...(category.children.length ? [category.id] : []),
    ...getExpandableIds(category.children),
  ]);
}

export function findFirstCategoryId(categories: CategoryNode[]): string | null {
  return categories[0]?.id ?? null;
}

export function findCategoryBySlug(
  categories: CategoryNode[],
  slug: string,
): CategoryNode | null {
  for (const category of categories) {
    if (category.slug === slug) {
      return category;
    }

    const childMatch = findCategoryBySlug(category.children, slug);

    if (childMatch) {
      return childMatch;
    }
  }

  return null;
}

export function flattenCategoryOptions(
  categories: CategoryNode[],
  depth = 0,
): CategoryParentOption[] {
  return categories.flatMap((category) => [
    {
      id: category.id,
      label: `${depth ? `${"— ".repeat(depth)}` : ""}${category.name}`,
    },
    ...flattenCategoryOptions(category.children, depth + 1),
  ]);
}

export function createCategoryId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `cat-${Date.now()}`;
}

export function formatSavedAt() {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());
}

export function shortId(value: string) {
  if (value.length <= 18) {
    return value;
  }

  return `${value.slice(0, 10)}...${value.slice(-4)}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
