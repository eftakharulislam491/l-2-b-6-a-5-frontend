"use server";

import { getCookie } from "../auth/tokenHandlers";
import {
  getAddressApiUrl,
  getRequestAuthHeaders,
  parseAddressApiResponse,
} from "./address-api";
import { getAddress } from "./getAddress";
import type { AddressMutationResult } from "./address-types";

export async function deleteAddress(
  addressId: string,
): Promise<AddressMutationResult> {
  try {
    const accessToken = await getCookie("accessToken");
    const refreshToken = await getCookie("refreshToken");

    if (!accessToken) {
      return {
        success: false,
        message: "Please log in to delete this address.",
        address: null,
        addressId: null,
        addresses: [],
      };
    }

    const normalizedAddressId = addressId.trim();

    if (!normalizedAddressId) {
      return {
        success: false,
        message: "Address id is required.",
        address: null,
        addressId: null,
        addresses: [],
      };
    }

    const response = await fetch(
      getAddressApiUrl(`api/user/addresses/${normalizedAddressId}`),
      {
        method: "DELETE",
        headers: getRequestAuthHeaders(accessToken, refreshToken),
        cache: "no-store",
      },
    );

    const result = await parseAddressApiResponse(response);

    if (!response.ok || result?.success === false) {
      return {
        success: false,
        message: result?.message || "Address deletion failed.",
        address: null,
        addressId: normalizedAddressId,
        addresses: [],
      };
    }

    const refreshedAddresses = await getAddress();

    return {
      success: true,
      message: result?.message || "Address deleted successfully.",
      address: null,
      addressId: normalizedAddressId,
      addresses: refreshedAddresses.addresses,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to delete address right now.",
      address: null,
      addressId,
      addresses: [],
    };
  }
}
