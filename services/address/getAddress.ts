"use server";

import { getCookie } from "../auth/tokenHandlers";
import {
  extractAddressItems,
  getAddressApiUrl,
  getRequestAuthHeaders,
  mapAddress,
  parseAddressApiResponse,
} from "./address-api";
import type { GetAddressResult, UserAddress } from "./address-types";

export async function getAddress(): Promise<GetAddressResult> {
  try {
    const accessToken = await getCookie("accessToken");
    const refreshToken = await getCookie("refreshToken");

    if (!accessToken) {
      return {
        addresses: [],
        error: "Please log in to load your addresses.",
      };
    }

    const response = await fetch(getAddressApiUrl(), {
      method: "GET",
      headers: getRequestAuthHeaders(accessToken, refreshToken),
      cache: "no-store",
    });

    const result = await parseAddressApiResponse(response);

    if (!response.ok || result?.success === false) {
      return {
        addresses: [],
        error: result?.message || "Unable to load your addresses right now.",
      };
    }

    const addresses = extractAddressItems(result?.data)
      .map(mapAddress)
      .filter((address): address is UserAddress => Boolean(address));

    return {
      addresses,
      error: null,
    };
  } catch (error) {
    return {
      addresses: [],
      error:
        error instanceof Error
          ? error.message
          : "Unable to load your addresses right now.",
    };
  }
}
