const FALLBACK_BASE_URL = "https://e-commerce-backend-491.vercel.app/";
const CATEGORY_PAGE_LIMIT = 100;

type CategoryApiRawItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageId?: string | null;
  image:
    | {
        id?: string | null;
        src?: string | null;
      }
    | string
    | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  isActive: boolean;
  sortOrder: number | null;
  parentId: string | null;
  createdAt: string;
};

type CategoryCollectionRawNode = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageId?: string | null;
  image:
    | {
        id?: string | null;
        src?: string | null;
      }
    | string
    | null;
  isActive: boolean;
  sortOrder: number | null;
  parentId: string | null;
  createdAt?: string;
  children?: CategoryCollectionRawNode[];
};

export type CategoryApiItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageId: string | null;
  image: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  isActive: boolean;
  sortOrder: number | null;
  parentId: string | null;
  createdAt: string;
};

type CategoryApiResponse = {
  success?: boolean;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPage?: number;
  };
  data?: CategoryApiRawItem[];
};

type CategoryCollectionsResponse = {
  success?: boolean;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPage?: number;
  };
  data?: CategoryCollectionRawNode[];
};

export type GetAllCategoriesResult = {
  categories: CategoryApiItem[];
  error: string | null;
};

async function requestCategoryPage(page: number): Promise<CategoryApiResponse> {
  const baseUrl = process.env.BASE_URL || FALLBACK_BASE_URL;
  const url = new URL("api/category", baseUrl);

  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(CATEGORY_PAGE_LIMIT));

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const result = (await response.json().catch(() => null)) as CategoryApiResponse | null;

  if (!response.ok || result?.success === false || !Array.isArray(result?.data)) {
    throw new Error(result?.message || "Failed to load categories.");
  }

  return result;
}

async function requestCollectionsPage(
  page: number,
): Promise<CategoryCollectionsResponse> {
  const baseUrl = process.env.BASE_URL || FALLBACK_BASE_URL;
  const url = new URL("api/category/collections", baseUrl);

  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(CATEGORY_PAGE_LIMIT));

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const result = (await response.json().catch(() => null)) as
    | CategoryCollectionsResponse
    | null;

  if (!response.ok || result?.success === false || !Array.isArray(result?.data)) {
    throw new Error(result?.message || "Failed to load public collections.");
  }

  return result;
}

function normalizeCategoryItem(raw: CategoryApiRawItem): CategoryApiItem {
  const imageIdFromRelation =
    raw.image && typeof raw.image === "object" && typeof raw.image.id === "string"
      ? raw.image.id
      : null;
  const imageUrlFromRelation =
    raw.image && typeof raw.image === "object" && typeof raw.image.src === "string"
      ? raw.image.src
      : null;

  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description,
    imageId: raw.imageId ?? imageIdFromRelation,
    image: typeof raw.image === "string" ? raw.image : imageUrlFromRelation,
    metaTitle: raw.metaTitle,
    metaDescription: raw.metaDescription,
    metaKeywords: raw.metaKeywords,
    isActive: raw.isActive,
    sortOrder: raw.sortOrder,
    parentId: raw.parentId,
    createdAt: raw.createdAt,
  };
}

function normalizeCollectionCategoryItem(
  raw: CategoryCollectionRawNode,
): CategoryApiItem {
  const imageIdFromRelation =
    raw.image && typeof raw.image === "object" && typeof raw.image.id === "string"
      ? raw.image.id
      : null;
  const imageUrlFromRelation =
    raw.image && typeof raw.image === "object" && typeof raw.image.src === "string"
      ? raw.image.src
      : null;

  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description,
    imageId: raw.imageId ?? imageIdFromRelation,
    image: typeof raw.image === "string" ? raw.image : imageUrlFromRelation,
    metaTitle: null,
    metaDescription: null,
    metaKeywords: null,
    isActive: raw.isActive,
    sortOrder: raw.sortOrder,
    parentId: raw.parentId,
    createdAt: raw.createdAt ?? "",
  };
}

function flattenCollectionCategories(
  categories: CategoryCollectionRawNode[],
): CategoryApiItem[] {
  const flattenedCategories: CategoryApiItem[] = [];
  const stack = [...categories];

  while (stack.length > 0) {
    const currentCategory = stack.shift();

    if (!currentCategory) {
      continue;
    }

    flattenedCategories.push(normalizeCollectionCategoryItem(currentCategory));

    if (Array.isArray(currentCategory.children) && currentCategory.children.length > 0) {
      stack.push(...currentCategory.children);
    }
  }

  return flattenedCategories;
}

function dedupeCategories(categories: CategoryApiItem[]): CategoryApiItem[] {
  const uniqueCategories = new Map<string, CategoryApiItem>();

  for (const category of categories) {
    if (!category.slug.trim()) {
      continue;
    }

    uniqueCategories.set(category.slug.trim().toLowerCase(), category);
  }

  return Array.from(uniqueCategories.values());
}

async function fetchCategoriesFromCollections(): Promise<CategoryApiItem[]> {
  const firstPage = await requestCollectionsPage(1);
  const categories = flattenCollectionCategories(firstPage.data ?? []);
  const totalPages =
    firstPage.meta?.totalPage ??
    Math.max(
      1,
      Math.ceil((firstPage.meta?.total ?? categories.length) / CATEGORY_PAGE_LIMIT),
    );

  const remainingPages = Array.from(
    { length: Math.max(0, totalPages - 1) },
    (_, index) => index + 2,
  );

  if (remainingPages.length > 0) {
    const remainingResults = await Promise.all(
      remainingPages.map((page) => requestCollectionsPage(page)),
    );

    for (const pageResult of remainingResults) {
      categories.push(...flattenCollectionCategories(pageResult.data ?? []));
    }
  }

  return dedupeCategories(categories);
}

async function fetchCategoriesFromPrivateList(): Promise<CategoryApiItem[]> {
  const firstPage = await requestCategoryPage(1);
  const categories = (firstPage.data ?? []).map(normalizeCategoryItem);
  const totalPages =
    firstPage.meta?.totalPage ??
    Math.max(
      1,
      Math.ceil((firstPage.meta?.total ?? categories.length) / CATEGORY_PAGE_LIMIT),
    );

  const remainingPages = Array.from(
    { length: Math.max(0, totalPages - 1) },
    (_, index) => index + 2,
  );

  if (remainingPages.length > 0) {
    const remainingResults = await Promise.all(
      remainingPages.map((page) => requestCategoryPage(page)),
    );

    for (const pageResult of remainingResults) {
      categories.push(...(pageResult.data ?? []).map(normalizeCategoryItem));
    }
  }

  return dedupeCategories(categories);
}

export async function getAllCategories(): Promise<GetAllCategoriesResult> {
  try {
    const categories = await fetchCategoriesFromCollections();
    return {
      categories,
      error: null,
    };
  } catch {
    try {
      const categories = await fetchCategoriesFromPrivateList();
      return {
        categories,
        error: null,
      };
    } catch (error) {
      return {
        categories: [],
        error:
          error instanceof Error ? error.message : "Unable to load categories right now.",
      };
    }
  }
}
