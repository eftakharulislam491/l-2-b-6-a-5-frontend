"use server";

import { setCookie } from "./tokenHandlers";

type LoginActionState = {
  success: boolean;
  message: string;
};

type ParsedSetCookie = {
  name: string;
  value: string;
  maxAge?: number;
};

const FALLBACK_BASE_URL = "https://e-commerce-backend-491.vercel.app/";

function parseSetCookieHeader(setCookieHeader: string): ParsedSetCookie | null {
  const [nameValue, ...attributes] = setCookieHeader
    .split(";")
    .map((part) => part.trim());
  if (!nameValue) {
    return null;
  }

  const separatorIndex = nameValue.indexOf("=");

  if (separatorIndex === -1) {
    return null;
  }

  const name = nameValue.slice(0, separatorIndex);
  const value = nameValue.slice(separatorIndex + 1);
  const maxAgeAttribute = attributes.find((attribute) =>
    attribute.toLowerCase().startsWith("max-age=")
  );
  const maxAge = maxAgeAttribute
    ? Number.parseInt(maxAgeAttribute.slice("max-age=".length), 10)
    : undefined;

  return {
    name,
    value,
    maxAge: Number.isFinite(maxAge) ? maxAge : undefined,
  };
}

function splitCombinedSetCookieHeader(setCookieHeader: string) {
  const cookies: string[] = [];
  let chunkStart = 0;
  let insideExpires = false;

  for (let index = 0; index < setCookieHeader.length; index += 1) {
    const char = setCookieHeader[index];

    if (
      !insideExpires &&
      setCookieHeader.slice(index, index + 8).toLowerCase() === "expires="
    ) {
      insideExpires = true;
      index += 7;
      continue;
    }

    if (insideExpires && char === ";") {
      insideExpires = false;
      continue;
    }

    if (!insideExpires && char === ",") {
      const cookieChunk = setCookieHeader.slice(chunkStart, index).trim();

      if (cookieChunk) {
        cookies.push(cookieChunk);
      }

      chunkStart = index + 1;
    }
  }

  const finalChunk = setCookieHeader.slice(chunkStart).trim();

  if (finalChunk) {
    cookies.push(finalChunk);
  }

  return cookies;
}

function getResponseCookies(response: Response) {
  const setCookieHeaders =
    typeof response.headers.getSetCookie === "function"
      ? response.headers.getSetCookie()
      : (() => {
          const header = response.headers.get("set-cookie");
          return header ? splitCombinedSetCookieHeader(header) : [];
        })();

  return setCookieHeaders
    .map(parseSetCookieHeader)
    .filter((cookie): cookie is ParsedSetCookie => cookie !== null);
}

export async function loginUser(
  _prevState: LoginActionState | null,
  formData: FormData
): Promise<LoginActionState> {
  try {
    const payload = {
      email: formData.get("email")?.toString().trim(),
      password: formData.get("password")?.toString(),
    };

    if (!payload.email || !payload.password) {
      return {
        success: false,
        message: "Email and password are required.",
      };
    }

    const baseUrl = process.env.BASE_URL || FALLBACK_BASE_URL;
    const loginUrl = new URL("api/auth/login", baseUrl).toString();

    const response = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const result = (await response.json().catch(() => null)) as
      | {
          success?: boolean;
          message?: string;
        }
      | null;

    if (!response.ok || result?.success === false) {
      return {
        success: false,
        message: result?.message || "Login failed",
      };
    }

    const responseCookies = getResponseCookies(response);
    const accessToken = responseCookies.find(
      (cookie) => cookie.name === "accessToken"
    );
    const refreshToken = responseCookies.find(
      (cookie) => cookie.name === "refreshToken"
    );

    if (!accessToken || !refreshToken) {
      return {
        success: false,
        message: "Login succeeded, but tokens were not returned by the server.",
      };
    }

    const shouldUseSecureCookies = process.env.NODE_ENV === "production";

    await setCookie("accessToken", accessToken.value, {
      httpOnly: true,
      secure: shouldUseSecureCookies,
      path: "/",
      maxAge: accessToken.maxAge ?? 3600,
      sameSite: "lax",
    });

    await setCookie("refreshToken", refreshToken.value, {
      httpOnly: true,
      secure: shouldUseSecureCookies,
      path: "/",
      maxAge: refreshToken.maxAge ?? 3600 * 24 * 90,
      sameSite: "lax",
    });

    return {
      success: true,
      message: result?.message || "Login successful",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
