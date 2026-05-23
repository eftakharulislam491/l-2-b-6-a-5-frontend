export type MediaStorageType = "cloudinary" | "link" | "local" | "supabase";

export type UploadedMediaItem = {
  id: string;
  src: string;
  altText: string | null;
  publicId: string | null;
  fileName: string | null;
  isPrimary: boolean;
};

type UploadAdminMediaInput = {
  files: File[];
  storageType?: MediaStorageType;
  altText?: string;
  isPrimary?: boolean;
  productId?: string;
  variantId?: string;
  variantOptionId?: string;
};

type UploadAdminMediaResult = {
  success: boolean;
  message: string;
  items: UploadedMediaItem[];
};

type UploadApiResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
};

export const MEDIA_STORAGE_OPTIONS: Array<{
  value: MediaStorageType;
  label: string;
  enabled: boolean;
}> = [
  {
    value: "cloudinary",
    label: "Cloudinary",
    enabled: true,
  },
  {
    value: "link",
    label: "Link (Disabled)",
    enabled: false,
  },
  {
    value: "local",
    label: "Local (Disabled)",
    enabled: false,
  },
  {
    value: "supabase",
    label: "Supabase (Disabled)",
    enabled: false,
  },
];

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
  const src = getStringValue(record.src);

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

function appendOptionalFormValue(
  formData: FormData,
  key: string,
  value: string | boolean | undefined,
) {
  if (value === undefined) {
    return;
  }

  if (typeof value === "string") {
    const normalizedValue = value.trim();

    if (!normalizedValue) {
      return;
    }

    formData.append(key, normalizedValue);
    return;
  }

  formData.append(key, String(value));
}

export async function uploadAdminMedia(
  payload: UploadAdminMediaInput,
): Promise<UploadAdminMediaResult> {
  const files = payload.files.filter(Boolean);

  if (!files.length) {
    return {
      success: false,
      message: "Select at least one file to upload.",
      items: [],
    };
  }

  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    appendOptionalFormValue(formData, "altText", payload.altText);
    appendOptionalFormValue(formData, "isPrimary", payload.isPrimary);
    appendOptionalFormValue(formData, "productId", payload.productId);
    appendOptionalFormValue(formData, "variantId", payload.variantId);
    appendOptionalFormValue(formData, "variantOptionId", payload.variantOptionId);

    const storageType = payload.storageType ?? "cloudinary";
    const response = await fetch(
      `/api/admin/media/upload?storageType=${encodeURIComponent(storageType)}`,
      {
        method: "POST",
        body: formData,
      },
    );

    const result = (await response.json().catch(() => null)) as
      | UploadApiResponse
      | null;

    if (!response.ok || result?.success === false) {
      return {
        success: false,
        message: result?.message || "Media upload failed.",
        items: [],
      };
    }

    const rows = Array.isArray(result?.data) ? result.data : [];
    const items = rows
      .map(mapUploadedMedia)
      .filter((item): item is UploadedMediaItem => Boolean(item));

    return {
      success: true,
      message: result?.message || "Media uploaded successfully.",
      items,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Media upload failed.",
      items: [],
    };
  }
}
