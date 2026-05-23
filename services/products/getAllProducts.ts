const FALLBACK_BASE_URL = "https://e-commerce-backend-491.vercel.app/";
const LOCAL_BACKEND_BASE_URL = "http://localhost:5000/";
const PRODUCT_PAGE_LIMIT = 100;

export type ProductCategory = {
  id: string;
  name: string;
  slug?: string;
};

export type ProductImage = {
  id?: string;
  src?: string | null;
  url?: string | null;
  altText?: string | null;
};

export type ProductVariantOption = {
  id: string;
  productVariantId: string;
  title?: string | null;
  sku: string | null;
  barcode: string | null;
  price: string | null;
  compareAtPrice: string | null;
  costPrice: string | null;
  stock: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
};

export type ProductVariant = {
  id: string;
  productId: string;
  title: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  options: ProductVariantOption[];
};

export type ProductListItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  shortDesc: string | null;
  brand: string | null;
  categoryId: string | null;
  price: string | null;
  compareAtPrice: string | null;
  costPrice: string | null;
  sku: string | null;
  barcode: string | null;
  stock: number | null;
  lowStockThreshold: number | null;
  hasVariants: boolean;
  isActive: boolean;
  isFeatured: boolean;
  isDigital: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  category: ProductCategory | null;
  images: ProductImage[];
  variants: ProductVariant[];
};

type ProductApiResponse = {
  statusCode?: number;
  success?: boolean;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPage?: number;
  };
  data?: ProductListItem[];
};

export type GetAllProductsResult = {
  products: ProductListItem[];
  error: string | null;
};

const getBaseUrlCandidates = () => {
  const configuredBaseUrl = process.env.BASE_URL?.trim();

  return [...new Set([configuredBaseUrl, FALLBACK_BASE_URL, LOCAL_BACKEND_BASE_URL])]
    .filter((value): value is string => Boolean(value));
};

async function requestProductPageFromBaseUrl(
  page: number,
  baseUrl: string,
): Promise<ProductApiResponse> {
  const url = new URL("api/product", baseUrl);

  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(PRODUCT_PAGE_LIMIT));

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });

  const result = (await response.json().catch(() => null)) as ProductApiResponse | null;

  if (!response.ok || result?.success === false || !Array.isArray(result?.data)) {
    throw new Error(result?.message || "Failed to load products.");
  }

  return result;
}

async function requestProductPage(page: number): Promise<ProductApiResponse> {
  const baseUrlCandidates = getBaseUrlCandidates();
  const errors: string[] = [];

  for (const baseUrl of baseUrlCandidates) {
    try {
      return await requestProductPageFromBaseUrl(page, baseUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${baseUrl} -> ${message}`);
    }
  }

  throw new Error(
    `Unable to load products from configured API base URLs. ${errors.join(" | ")}`,
  );
}

export async function getAllProducts(): Promise<GetAllProductsResult> {
  try {
    const firstPage = await requestProductPage(1);
    const products = [...(firstPage.data ?? [])];
    const totalPages =
      firstPage.meta?.totalPage ??
      Math.max(
        1,
        Math.ceil((firstPage.meta?.total ?? products.length) / PRODUCT_PAGE_LIMIT),
      );

    const remainingPages = Array.from(
      { length: Math.max(0, totalPages - 1) },
      (_, index) => index + 2,
    );

    if (remainingPages.length > 0) {
      const remainingResults = await Promise.all(
        remainingPages.map((page) => requestProductPage(page)),
      );

      for (const pageResult of remainingResults) {
        products.push(...(pageResult.data ?? []));
      }
    }

    return {
      products,
      error: null,
    };
  } catch (error) {
    return {
      products: [],
      error:
        error instanceof Error ? error.message : "Unable to load products right now.",
    };
  }
}
