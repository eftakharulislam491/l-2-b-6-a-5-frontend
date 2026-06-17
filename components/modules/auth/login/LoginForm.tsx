"use client";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { useCart } from "@/components/providers/cart-provider";
import { startGlobalRouteLoading } from "@/components/providers/global-loading-provider";
import { loginUser } from "@/services/auth/loginUser";

function getSafeRedirectPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value === "/login" ? "/" : value;
}

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginUser, null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshCart } = useCart();
  const redirectPath = getSafeRedirectPath(searchParams.get("redirect"));

  useEffect(() => {
    if (state?.success) {
      const handleSuccessfulLogin = async () => {
        toast.success(state.message);
        await refreshCart();
        startGlobalRouteLoading();
        router.replace(redirectPath);
      };

      void handleSuccessfulLogin();
    }

    if (state && !state.success) {
      toast.error(state.message);
    }
  }, [redirectPath, refreshCart, router, state]);

  return (
    <form action={formAction} className="grid gap-6">
      {/* Fields */}
      <div className="grid gap-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-800">Email</label>
          <input
            name="email"
            type="email"
            placeholder="m@example.com"
            className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-800">
            Password
          </label>

          <input
            name="password"
            type="password"
            className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="h-10 w-full rounded-md bg-slate-900 text-white"
        >
          {isPending ? "Logging in..." : "Login"}
        </button>
      </div>
    </form>
  );
}
