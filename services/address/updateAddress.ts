"use server";

import { getCookie } from "../auth/tokenHandlers";
import {
  getAddressApiUrl,
  getRequestAuthHeaders,
  mapAddress,
  parseAddressApiResponse,
} from "./address-api";
import { getAddress } from "./getAddress";
import type {
  AddressMutationResult,
  IUpdateAddressPayload,
} from "./address-types";

export async function updateAddress(
  addressId: string,
  payload: IUpdateAddressPayload,
): Promise<AddressMutationResult> {
  try {
    const accessToken = await getCookie("accessToken");
    const refreshToken = await getCookie("refreshToken");

    if (!accessToken) {
      return {
        success: false,
        message: "Please log in to update this address.",
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

    const response = await fetch(getAddressApiUrl(), {
      method: "PATCH",
      headers: getRequestAuthHeaders(
        accessToken,
        refreshToken,
        "application/json",
      ),
      body: JSON.stringify({
        addressId: normalizedAddressId,
        ...payload,
      }),
      cache: "no-store",
    });

    const result = await parseAddressApiResponse(response);

    if (!response.ok || result?.success === false) {
      return {
        success: false,
        message: result?.message || "Address update failed.",
        address: null,
        addressId: normalizedAddressId,
        addresses: [],
      };
    }

    const address = mapAddress(result?.data);
    const refreshedAddresses = await getAddress();

    return {
      success: true,
      message: result?.message || "Address updated successfully.",
      address,
      addressId: address?.id ?? normalizedAddressId,
      addresses: refreshedAddresses.addresses,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update address right now.",
      address: null,
      addressId,
      addresses: [],
    };
  }
}
