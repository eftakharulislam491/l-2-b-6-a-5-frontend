import type { MediaStorageType, UploadedMediaItem } from "./uploadAdminMedia";

type AdminMediaApiResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
};

type AdminMediaListInput = {
  page?: number;
  limit?: number;
  sort?: string;
  storageType?: MediaStorageType;
};

type AdminMediaListResult = {
  success: boolean;
  message: string;
  items: UploadedMediaItem[];
};

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
  }

  return "";
}

function getNullableStringValue(...values: unknown[]) {
  const value = getStringValue(...values);
  return value || null;
}

function getBooleanValue(value: unknown, fallback = false) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    if (value === "true") {
      return true;
    }

    if (value === "false") {
      return false;
    }
  }

  return fallback;
}

function mapUploadedMedia(value: unknown): UploadedMediaItem | null {
  const record = toRecord(value);

  if (!record) {
    return null;
  }

  const id = getStringValue(record.id);
  const src = getStringValue(record.src, record.url);

  if (!id || !src) {
    return null;
  }

  return {
    id,
    src,
    altText: getNullableStringValue(record.altText),
    publicId: getNullableStringValue(record.publicId),
    fileName: getNullableStringValue(record.fileName),
    isPrimary: getBooleanValue(record.isPrimary),
  };
}

function extractRows(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  const payloadRecord = toRecord(payload);

  if (!payloadRecord) {
    return [];
  }

  if (Array.isArray(payloadRecord.data)) {
    return payloadRecord.data;
  }

  return [];
}

export async function getAdminMedia(
  query: AdminMediaListInput = {},
): Promise<AdminMediaListResult> {
  try {
    const params = new URLSearchParams();

    params.set("page", String(Math.max(1, query.page ?? 1)));
    params.set("limit", String(Math.max(1, Math.min(100, query.limit ?? 60))));
    params.set("sort", query.sort?.trim() || "-createdAt");

    if (query.storageType?.trim()) {
      params.set("storageType", query.storageType);
    }

    const response = await fetch(`/api/admin/media?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
    });

    const result = (await response.json().catch(() => null)) as
      | AdminMediaApiResponse
      | null;

    if (!response.ok || result?.success === false) {
      return {
        success: false,
        message: result?.message || "Failed to load media.",
        items: [],
      };
    }

    const items = extractRows(result?.data)
      .map(mapUploadedMedia)
      .filter((item): item is UploadedMediaItem => Boolean(item));

    return {
      success: true,
      message: result?.message || "Media loaded successfully.",
      items,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to load media.",
      items: [],
    };
  }
}
