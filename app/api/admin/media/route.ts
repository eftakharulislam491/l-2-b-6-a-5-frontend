import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const FALLBACK_BASE_URL = "https://e-commerce-backend-491.vercel.app/";

function getAuthHeaders(accessToken: string, refreshToken: string | null) {
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

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value ?? null;
    const refreshToken = cookieStore.get("refreshToken")?.value ?? null;

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Please log in as admin to load media.",
        },
        { status: 401 },
      );
    }

    const backendMediaUrl = new URL(
      "api/image",
      process.env.BASE_URL || FALLBACK_BASE_URL,
    );

    request.nextUrl.searchParams.forEach((value, key) => {
      backendMediaUrl.searchParams.set(key, value);
    });

    const response = await fetch(backendMediaUrl.toString(), {
      method: "GET",
      headers: getAuthHeaders(accessToken, refreshToken),
      cache: "no-store",
    });

    const responseText = await response.text();

    return new NextResponse(responseText, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to load media right now.",
      },
      { status: 500 },
    );
  }
}
