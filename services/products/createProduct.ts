"use server";

import { getCookie } from "../auth/tokenHandlers";

const FALLBACK_BASE_URL = "https://e-commerce-backend-491.vercel.app/";

export interface ICreateProductPayload {
  title: string;
  slug: string;
  description?: string;
  shortDesc?: string;
  brand?: string;
  categoryId?: string | null;
  price?: number;
  compareAtPrice?: number;
  costPrice?: number;
  sku?: string;
  barcode?: string;
  stock?: number;
  lowStockThreshold?: number;
  hasVariants?: boolean;
  isActive?: boolean;
  isFeatured?: boolean;
  isDigital?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  metadata?: unknown;
  imageIds?: string[];
  variants?: IProductVariantInput[];
}

export interface IProductVariantInput {
  title: string;
  isActive?: boolean;
  imageIds?: string[];
  options: IVariantOptionInput[];
}

export interface IVariantOptionInput {
  title?: string;
  sku: string;
  barcode?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  stock?: number;
  isActive?: boolean;
  imageIds?: string[];
}

type ProductSummary = {
  id: string;
  title?: string;
  slug?: string;
};

type ProductApiResponse = {
  success?: boolean;
  message?: string;
  data?: ProductSummary | null;
};

export type CreateProductResult = {
  success: boolean;
  message: string;
  product: ProductSummary | null;
  productId: string | null;
};

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

function isProductSummary(value: unknown): value is ProductSummary {
  if (!value || typeof value !== "object") {
    return false;
  }

  return typeof (value as ProductSummary).id === "string";
}

export async function createProduct(
  payload: ICreateProductPayload,
): Promise<CreateProductResult> {
  try {
    const accessToken = await getCookie("accessToken");
    const refreshToken = await getCookie("refreshToken");

    if (!accessToken) {
      return {
        success: false,
        message: "No access token found. Please log in to create a product.",
        product: null,
        productId: null,
      };
    }

    const baseUrl = process.env.BASE_URL || FALLBACK_BASE_URL;
    const url = new URL("api/product", baseUrl);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: getRequestAuthHeaders(
        accessToken,
        refreshToken,
        "application/json",
      ),
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const result = (await response.json().catch(() => null)) as ProductApiResponse | null;

    if (!response.ok || result?.success === false) {
      return {
        success: false,
        message: result?.message || "Product creation failed.",
        product: null,
        productId: null,
      };
    }

    const createdProduct = isProductSummary(result?.data) ? result.data : null;

    return {
      success: true,
      message: result?.message || "Product created successfully.",
      product: createdProduct,
      productId: createdProduct?.id ?? null,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unable to create product right now.",
      product: null,
      productId: null,
    };
  }
}
