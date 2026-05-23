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
  ICreateAddressPayload,
} from "./address-types";

export async function createAddress(
  payload: ICreateAddressPayload,
): Promise<AddressMutationResult> {
  try {
    const accessToken = await getCookie("accessToken");
    const refreshToken = await getCookie("refreshToken");

    if (!accessToken) {
      return {
        success: false,
        message: "Please log in to create an address.",
        address: null,
        addressId: null,
        addresses: [],
      };
    }

    const response = await fetch(getAddressApiUrl(), {
      method: "POST",
      headers: getRequestAuthHeaders(
        accessToken,
        refreshToken,
        "application/json",
      ),
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const result = await parseAddressApiResponse(response);

    if (!response.ok || result?.success === false) {
      return {
        success: false,
        message: result?.message || "Address creation failed.",
        address: null,
        addressId: null,
        addresses: [],
      };
    }

    const address = mapAddress(result?.data);
    const refreshedAddresses = await getAddress();

    return {
      success: true,
      message: result?.message || "Address created successfully.",
      address,
      addressId: address?.id ?? null,
      addresses: refreshedAddresses.addresses,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to create address right now.",
      address: null,
      addressId: null,
      addresses: [],
    };
  }
}
