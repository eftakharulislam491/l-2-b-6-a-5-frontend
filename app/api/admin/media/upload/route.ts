import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const FALLBACK_BASE_URL = "https://e-commerce-backend-491.vercel.app/";

function getAuthHeaders(
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

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value ?? null;
    const refreshToken = cookieStore.get("refreshToken")?.value ?? null;

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Please log in as admin to upload media.",
        },
        { status: 401 },
      );
    }

    const storageType =
      request.nextUrl.searchParams.get("storageType")?.trim() || "cloudinary";
    const formData = await request.formData();
    const backendUploadUrl = new URL(
      "api/image/upload",
      process.env.BASE_URL || FALLBACK_BASE_URL,
    );

    backendUploadUrl.searchParams.set("storageType", storageType);

    const response = await fetch(backendUploadUrl.toString(), {
      method: "POST",
      headers: getAuthHeaders(accessToken, refreshToken),
      body: formData,
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
            : "Unable to upload media right now.",
      },
      { status: 500 },
    );
  }
}
