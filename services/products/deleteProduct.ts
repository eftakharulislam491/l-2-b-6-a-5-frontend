"use server";

import { getCookie } from "../auth/tokenHandlers";

const FALLBACK_BASE_URL = "https://e-commerce-backend-491.vercel.app/";

type ProductApiResponse = {
  success?: boolean;
  message?: string;
};

export type DeleteProductResult = {
  success: boolean;
  message: string;
};

function getRequestAuthHeaders(
  accessToken: string,
  refreshToken: string | null,
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
  };
}

export async function deleteProduct(
  productId: string,
): Promise<DeleteProductResult> {
  try {
    const accessToken = await getCookie("accessToken");
    const refreshToken = await getCookie("refreshToken");

    if (!accessToken) {
      return {
        success: false,
        message: "No access token found. Please log in to delete a product.",
      };
    }

    const baseUrl = process.env.BASE_URL || FALLBACK_BASE_URL;
    const url = new URL(`api/product/${productId}`, baseUrl);

    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers: getRequestAuthHeaders(accessToken, refreshToken),
      cache: "no-store",
    });

    const result = (await response.json().catch(() => null)) as ProductApiResponse | null;

    if (!response.ok || result?.success === false) {
      return {
        success: false,
        message: result?.message || "Product deletion failed.",
      };
    }

    return {
      success: true,
      message: result?.message || "Product deleted successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unable to delete product right now.",
    };
  }
}
