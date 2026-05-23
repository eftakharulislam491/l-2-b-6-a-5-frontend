"use server";

import type { ICreateProductPayload } from "./createProduct";
import type { ProductListItem } from "./getAllProducts";
import { getCookie } from "../auth/tokenHandlers";

const FALLBACK_BASE_URL = "https://e-commerce-backend-491.vercel.app/";

type ProductApiResponse = {
  success?: boolean;
  message?: string;
  data?: ProductListItem | null;
};

export type IUpdateProductPayload = Partial<ICreateProductPayload>;

export type UpdateProductResult = {
  success: boolean;
  message: string;
  product: ProductListItem | null;
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

function isProductListItem(value: unknown): value is ProductListItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<ProductListItem>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.slug === "string"
  );
}

export async function updateProduct(
  productId: string,
  payload: IUpdateProductPayload,
): Promise<UpdateProductResult> {
  try {
    const accessToken = await getCookie("accessToken");
    const refreshToken = await getCookie("refreshToken");

    if (!accessToken) {
      return {
        success: false,
        message: "No access token found. Please log in to update a product.",
        product: null,
      };
    }

    const baseUrl = process.env.BASE_URL || FALLBACK_BASE_URL;
    const url = new URL(`api/product/${productId}`, baseUrl);

    const response = await fetch(url.toString(), {
      method: "PATCH",
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
        message: result?.message || "Product update failed.",
        product: null,
      };
    }

    const updatedProduct = isProductListItem(result?.data) ? result.data : null;

    return {
      success: true,
      message: result?.message || "Product updated successfully.",
      product: updatedProduct,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unable to update product right now.",
      product: null,
    };
  }
}
