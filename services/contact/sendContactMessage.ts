"use server";

type ContactActionState = {
  success: boolean;
  message: string;
};

const FALLBACK_BASE_URL = "https://e-commerce-backend-491.vercel.app/";

function getRequiredFormValue(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() || "";
}

export async function sendContactMessage(
  _prevState: ContactActionState | null,
  formData: FormData,
): Promise<ContactActionState> {
  try {
    const payload = {
      name: getRequiredFormValue(formData, "name"),
      phone: getRequiredFormValue(formData, "phone"),
      email: getRequiredFormValue(formData, "email"),
      message: getRequiredFormValue(formData, "message"),
    };

    if (!payload.name || !payload.phone || !payload.email || !payload.message) {
      return {
        success: false,
        message: "Please fill in all contact fields.",
      };
    }

    const baseUrl = process.env.BASE_URL || FALLBACK_BASE_URL;
    const contactUrl = new URL("api/contact", baseUrl).toString();

    const response = await fetch(contactUrl, {
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
        message: result?.message || "Message could not be sent.",
      };
    }

    return {
      success: true,
      message: result?.message || "Message sent successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Something went wrong.",
    };
  }
}
