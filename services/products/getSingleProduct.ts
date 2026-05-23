import { getAllProducts, type ProductListItem } from "./getAllProducts";

const FALLBACK_BASE_URL = "https://e-commerce-backend-491.vercel.app/";

type ProductApiResponse = {
  statusCode?: number;
  success?: boolean;
  message?: string;
  data?: ProductListItem | null;
};

export type GetSingleProductResult = {
  product: ProductListItem | null;
  error: string | null;
  notFound: boolean;
};

async function requestSingleProduct(
  identifier: string,
): Promise<ProductListItem | null> {
  const baseUrl = process.env.BASE_URL || FALLBACK_BASE_URL;
  const url = new URL(`api/product/${encodeURIComponent(identifier)}`, baseUrl);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const result = (await response.json().catch(() => null)) as
    | ProductApiResponse
    | null;

  if (response.status === 404) {
    return null;
  }

  if (!response.ok || result?.success === false) {
    throw new Error(result?.message || "Failed to load product.");
  }

  if (!result?.data || typeof result.data !== "object") {
    throw new Error("Product data is missing from the response.");
  }

  return result.data;
}

export async function getSingleProduct(
  identifier: string,
): Promise<GetSingleProductResult> {
  try {
    const normalizedIdentifier = identifier.trim();

    if (!normalizedIdentifier) {
      return {
        product: null,
        error: "Product identifier is required.",
        notFound: true,
      };
    }

    const directProduct = await requestSingleProduct(normalizedIdentifier);

    if (directProduct) {
      return {
        product: directProduct,
        error: null,
        notFound: false,
      };
    }

    const { products, error } = await getAllProducts();

    if (error) {
      return {
        product: null,
        error,
        notFound: false,
      };
    }

    const matchedProduct = products.find(
      (product) =>
        product.id === normalizedIdentifier || product.slug === normalizedIdentifier,
    );

    if (!matchedProduct) {
      return {
        product: null,
        error: "Product not found.",
        notFound: true,
      };
    }

    const resolvedProduct =
      matchedProduct.id === normalizedIdentifier
        ? matchedProduct
        : await requestSingleProduct(matchedProduct.id);

    if (!resolvedProduct) {
      return {
        product: null,
        error: "Product not found.",
        notFound: true,
      };
    }

    return {
      product: resolvedProduct,
      error: null,
      notFound: false,
    };
  } catch (error) {
    return {
      product: null,
      error:
        error instanceof Error ? error.message : "Unable to load product right now.",
      notFound: false,
    };
  }
}
