"use server";

import type {
  CategoryNode,
  CategoryPayload,
} from "@/components/modules/admin/categories/category-types";
import { getCookie } from "../auth/tokenHandlers";

const FALLBACK_BASE_URL = "https://e-commerce-backend-491.vercel.app/";
const CATEGORY_PAGE_LIMIT = 100;

type CategoryApiItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageId: string | null;
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

type CategoryApiResponse = {
  success?: boolean;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPage?: number;
  };
  data?: CategoryApiItem[];
};

type CategoryTreeResult = {
  categories: CategoryNode[];
  error: string | null;
};

type CreateCategoryResult = {
  success: boolean;
  message: string;
  categories: CategoryNode[];
  category: CategoryNode | null;
  categoryId: string | null;
};

type CreateCategoryRequestBody = {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
  imageId?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  parentId?: string;
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function createCategoryNode(item: CategoryApiItem): CategoryNode {
  const imageIdFromRelation =
    item.image && typeof item.image === "object" && typeof item.image.id === "string"
      ? item.image.id
      : null;
  const imageIdFromString =
    typeof item.image === "string" && isUuid(item.image) ? item.image : null;

  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description ?? "",
    isActive: item.isActive,
    sortOrder: item.sortOrder ?? 0,
    image: item.imageId ?? imageIdFromRelation ?? imageIdFromString ?? "",
    metaTitle: item.metaTitle ?? "",
    metaDescription: item.metaDescription ?? "",
    metaKeywords: item.metaKeywords ?? "",
    parentId: item.parentId,
    children: [],
  };
}

function getRequestAuthHeaders(
  accessToken: string,
  refreshToken: string | null,
  contentType?: string,
) {
  const cookieHeader = [
    `accessToken=${accessToken}`,
    refreshToken ? `refreshToken=${refreshToken}` : null,
  ]
    .filter(Boolean)
    .join("; ");

  return {
    Accept: "application/json",
    Authorization: `Bearer ${accessToken}`,
    Cookie: cookieHeader,
    ...(contentType ? { "Content-Type": contentType } : {}),
  };
}

function isCategoryApiItem(value: unknown): value is CategoryApiItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<CategoryApiItem>;

  return typeof candidate.id === "string" && typeof candidate.name === "string";
}

function buildCreateCategoryPayload(
  payload: CategoryPayload,
): CreateCategoryRequestBody {
  const requestPayload: CreateCategoryRequestBody = {
    name: payload.name.trim(),
    slug: payload.slug.trim(),
    description: payload.description.trim(),
    isActive: payload.isActive,
    sortOrder: Number.isFinite(payload.sortOrder) ? payload.sortOrder : 0,
  };

  const image = payload.image.trim();
  const metaTitle = payload.metaTitle.trim();
  const metaDescription = payload.metaDescription.trim();
  const metaKeywords = payload.metaKeywords.trim();
  const parentId = payload.parentId?.trim();

  if (image) {
    requestPayload.imageId = image;
  }

  if (metaTitle) {
    requestPayload.metaTitle = metaTitle;
  }

  if (metaDescription) {
    requestPayload.metaDescription = metaDescription;
  }

  if (metaKeywords) {
    requestPayload.metaKeywords = metaKeywords;
  }

  if (parentId) {
    requestPayload.parentId = parentId;
  }

  return requestPayload;
}

function compareCategoryItems(left: CategoryApiItem, right: CategoryApiItem) {
  const leftSortOrder = left.sortOrder ?? 0;
  const rightSortOrder = right.sortOrder ?? 0;

  if (leftSortOrder !== rightSortOrder) {
    return leftSortOrder - rightSortOrder;
  }

  const createdAtDifference =
    new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();

  if (createdAtDifference !== 0) {
    return createdAtDifference;
  }

  return left.name.localeCompare(right.name);
}

function buildCategoryTree(items: CategoryApiItem[]): CategoryNode[] {
  const sortedItems = [...items].sort(compareCategoryItems);
  const nodesById = new Map<string, CategoryNode>();
  const rootNodes: CategoryNode[] = [];

  sortedItems.forEach((item) => {
    nodesById.set(item.id, createCategoryNode(item));
  });

  sortedItems.forEach((item) => {
    const node = nodesById.get(item.id);

    if (!node) {
      return;
    }

    if (item.parentId) {
      const parentNode = nodesById.get(item.parentId);

      if (parentNode) {
        parentNode.children.push(node);
        return;
      }
    }

    rootNodes.push(node);
  });

  return rootNodes;
}

async function requestCategoryPage(
  page: number,
  accessToken: string,
  refreshToken: string | null,
): Promise<CategoryApiResponse> {
  const baseUrl = process.env.BASE_URL || FALLBACK_BASE_URL;
  const url = new URL("api/category", baseUrl);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(CATEGORY_PAGE_LIMIT));

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: getRequestAuthHeaders(accessToken, refreshToken),
    cache: "no-store",
  });

  const result = (await response.json().catch(() => null)) as CategoryApiResponse | null;

  if (!response.ok || result?.success === false || !Array.isArray(result?.data)) {
    throw new Error(result?.message || "Failed to load categories.");
  }

  return result;
}

export async function getCategoryTree(): Promise<CategoryTreeResult> {
  try {
    const accessToken = await getCookie("accessToken");
    const refreshToken = await getCookie("refreshToken");

    if (!accessToken) {
      return {
        categories: [],
        error: "No access token found. Please log in to load admin categories.",
      };
    }

    const firstPage = await requestCategoryPage(1, accessToken, refreshToken);
    const firstPageItems = firstPage.data ?? [];
    const totalPages =
      firstPage.meta?.totalPage ??
      Math.max(
        1,
        Math.ceil((firstPage.meta?.total ?? firstPageItems.length) / CATEGORY_PAGE_LIMIT),
      );
    const allItems = [...firstPageItems];

    const remainingPages = Array.from(
      { length: Math.max(0, totalPages - 1) },
      (_, index) => index + 2,
    );

    if (remainingPages.length > 0) {
      const remainingResults = await Promise.all(
        remainingPages.map((page) =>
          requestCategoryPage(page, accessToken, refreshToken),
        ),
      );

      for (const pageResult of remainingResults) {
        allItems.push(...(pageResult.data ?? []));
      }
    }

    return {
      categories: buildCategoryTree(allItems),
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

export async function createCategory(
  payload: CategoryPayload,
): Promise<CreateCategoryResult> {
  try {
    const accessToken = await getCookie("accessToken");
    const refreshToken = await getCookie("refreshToken");

    if (!accessToken) {
      return {
        success: false,
        message: "No access token found. Please log in to create a category.",
        categories: [],
        category: null,
        categoryId: null,
      };
    }

    const baseUrl = process.env.BASE_URL || FALLBACK_BASE_URL;
    const url = new URL("api/category", baseUrl);
    const requestPayload = buildCreateCategoryPayload(payload);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: getRequestAuthHeaders(
        accessToken,
        refreshToken,
        "application/json",
      ),
      body: JSON.stringify(requestPayload),
      cache: "no-store",
    });

    const result = (await response.json().catch(() => null)) as
      | (CategoryApiResponse & { data?: CategoryApiItem | null })
      | null;

    if (!response.ok || result?.success === false) {
      return {
        success: false,
        message: result?.message || "Category creation failed.",
        categories: [],
        category: null,
        categoryId: null,
      };
    }

    const createdCategory = isCategoryApiItem(result?.data)
      ? createCategoryNode(result.data)
      : null;
    const refreshedTree = await getCategoryTree();

    return {
      success: true,
      message: result?.message || "Category created successfully.",
      categories: refreshedTree.categories,
      category: createdCategory,
      categoryId: createdCategory?.id ?? null,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unable to create category right now.",
      categories: [],
      category: null,
      categoryId: null,
    };
  }
}
