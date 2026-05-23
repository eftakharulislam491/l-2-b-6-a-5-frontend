"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type GlobalLoadingScreenProps = {
  message?: string;
  description?: string;
  className?: string;
  fixed?: boolean;
  children?: React.ReactNode;
};

export function GlobalLoadingScreen({
  message = "Loading...",
  description = "Please wait while we finish the current request.",
  className,
  fixed = true,
  children,
}: GlobalLoadingScreenProps) {
  return (
    <div
      className={cn(
        "isolate grid place-items-center overflow-hidden p-6",
        fixed ? "fixed inset-0 z-[100]" : "min-h-[50vh] w-full",
        className,
      )}
    >
      {children ? <div className="absolute inset-0">{children}</div> : null}
      <div className="absolute inset-0 bg-white/8 backdrop-blur-md" />

      <div className="relative w-full max-w-md rounded-[30px] border border-white/35 bg-white/32 p-6 text-center shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur-2xl">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl border border-white/55 bg-white/45 text-slate-900 shadow-lg shadow-slate-900/5 backdrop-blur-xl">
          <Loader2 className="h-8 w-8 animate-spin text-slate-800" />
        </div>

        <div className="mt-5 space-y-2">
          <h2 className="text-lg font-semibold text-slate-950">{message}</h2>
          <p className="text-sm leading-6 text-slate-700/80">{description}</p>
        </div>
      </div>
    </div>
  );
}
