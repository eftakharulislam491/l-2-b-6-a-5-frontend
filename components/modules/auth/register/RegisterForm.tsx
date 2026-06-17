"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { startGlobalRouteLoading } from "@/components/providers/global-loading-provider";
import { registerUser } from "@/services/auth/registerUser";

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerUser, null);
  const router = useRouter();

  useEffect(() => {
    if (!state) {
      return;
    }

    if (state.success) {
      toast.success(state.message);
      startGlobalRouteLoading();
      router.push("/login");
      return;
    }

    toast.error(state.message);
  }, [state, router]);

  return (
    <form action={formAction} className="grid gap-6">
      <div className="grid gap-4">
        {/* Name */}
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-800">
            Name
          </label>
          <input
            name="name"
            type="text"
            placeholder="John Doe"
            autoComplete="name"
            required
            className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        {/* Email */}
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-800">
            Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="m@example.com"
            autoComplete="email"
            required
            className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        {/* Phone Number */}
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-800">
            Phone Number
          </label>
          <input
            name="phone"
            type="tel"
            placeholder="01400000000"
            autoComplete="tel"
            required
            className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        {/* Password */}
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-800">
            Password
          </label>
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="h-10 w-full rounded-md bg-slate-900 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-[0.99]"
        >
          {isPending ? "Creating account..." : "Create account"}
        </button>
      </div>
    </form>
  );
}
