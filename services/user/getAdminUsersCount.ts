"use server";

import { getCookie } from "@/services/auth/tokenHandlers";

const FALLBACK_BASE_URL = "https://e-commerce-backend-491.vercel.app/";

type UsersApiResponse = {
  success?: boolean;
  message?: string;
  meta?: {
    total?: number;
  };
};

type GetAdminUsersCountResult = {
  count: number;
  error: string | null;
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

export async function getAdminUsersCount(): Promise<GetAdminUsersCountResult> {
  try {
    const accessToken = await getCookie("accessToken");
    const refreshToken = await getCookie("refreshToken");

    if (!accessToken) {
      return {
        count: 0,
        error: "Please log in as admin to load user counts.",
      };
    }

    const url = new URL("api/user", process.env.BASE_URL || FALLBACK_BASE_URL);
    url.searchParams.set("page", "1");
    url.searchParams.set("limit", "1");

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: getRequestAuthHeaders(accessToken, refreshToken),
      cache: "no-store",
    });

    const result = (await response.json().catch(() => null)) as
      | UsersApiResponse
      | null;

    if (!response.ok || result?.success === false) {
      return {
        count: 0,
        error: result?.message || "Unable to load user counts right now.",
      };
    }

    return {
      count: Math.max(0, Number(result?.meta?.total || 0)),
      error: null,
    };
  } catch (error) {
    return {
      count: 0,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load user counts right now.",
    };
  }
}
