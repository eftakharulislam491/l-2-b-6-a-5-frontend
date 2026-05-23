import type { UserAddress } from "./address-types";

export const FALLBACK_BASE_URL = "https://e-commerce-backend-491.vercel.app/";

type AddressApiResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
};

export function getAddressApiUrl(path = "api/user/addresses") {
  return new URL(path, process.env.BASE_URL || FALLBACK_BASE_URL).toString();
}

export function getRequestAuthHeaders(
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

export async function parseAddressApiResponse(
  response: Response,
): Promise<AddressApiResponse | null> {
  return (await response.json().catch(() => null)) as AddressApiResponse | null;
}

function toRecord(value: unknown) {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function getStringValue(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }

  return "";
}

function getBooleanValue(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "boolean") {
      return value;
    }
  }

  return false;
}

export function extractAddressItems(data: unknown): unknown[] {
  if (Array.isArray(data)) {
    return data;
  }

  const dataRecord = toRecord(data);

  if (!dataRecord) {
    return [];
  }

  const candidates = [
    dataRecord.addresses,
    dataRecord.items,
    dataRecord.rows,
    dataRecord.results,
    dataRecord.data,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
}

export function mapAddress(item: unknown): UserAddress | null {
  const itemRecord = toRecord(item);

  if (!itemRecord) {
    return null;
  }

  const id = getStringValue(itemRecord.id, itemRecord._id, itemRecord.addressId);

  if (!id) {
    return null;
  }

  const recipient = getStringValue(
    itemRecord.recipient,
    itemRecord.name,
    itemRecord.fullName,
  );
  const street = getStringValue(
    itemRecord.street,
    itemRecord.addressLine1,
    itemRecord.address,
  );
  const city = getStringValue(itemRecord.city);
  const state = getStringValue(itemRecord.state, itemRecord.division);
  const zipCode = getStringValue(
    itemRecord.zipCode,
    itemRecord.postalCode,
    itemRecord.zip,
  );
  const country = getStringValue(itemRecord.country);

  return {
    id,
    label:
      getStringValue(itemRecord.label, itemRecord.type) ||
      recipient ||
      "Address",
    recipient,
    phone: getStringValue(itemRecord.phone, itemRecord.mobile),
    street,
    city,
    state,
    zipCode,
    country,
    isDefault: getBooleanValue(itemRecord.isDefault, itemRecord.default),
  };
}
