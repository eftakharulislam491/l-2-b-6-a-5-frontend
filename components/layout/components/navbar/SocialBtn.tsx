// components/navbar/SocialBtn.tsx
import * as React from "react";

type SocialBtnProps = {
  label: string;
  href?: string;
  children: React.ReactNode;
};

export function SocialBtn({ label, href = "#", children }: SocialBtnProps) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition shrink-0"
    >
      {children}
    </a>
  );
}