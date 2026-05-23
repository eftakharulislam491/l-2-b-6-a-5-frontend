"use server";

type RegisterActionState = {
  success: boolean;
  message: string;
};

const FALLBACK_BASE_URL = "https://e-commerce-backend-491.vercel.app/";

export async function registerUser(
  _prevState: RegisterActionState | null,
  formData: FormData
): Promise<RegisterActionState> {
  try {
    const payload = {
      name: formData.get("name")?.toString().trim(),
      email: formData.get("email")?.toString().trim(),
      phone: formData.get("phone")?.toString().trim(),
      password: formData.get("password")?.toString(),
    };

    if (!payload.name || !payload.email || !payload.phone || !payload.password) {
      return {
        success: false,
        message: "Name, email, phone, and password are required.",
      };
    }

    const baseUrl = process.env.BASE_URL || FALLBACK_BASE_URL;
    const registerUrl = new URL("api/auth/register", baseUrl).toString();

    const res = await fetch(registerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const result = (await res.json().catch(() => null)) as
      | {
          success?: boolean;
          message?: string;
        }
      | null;

    if (!res.ok || result?.success === false) {
      return {
        success: false,
        message: result?.message || "Registration failed",
      };
    }

    return {
      success: true,
      message: result?.message || "Registration successful",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
