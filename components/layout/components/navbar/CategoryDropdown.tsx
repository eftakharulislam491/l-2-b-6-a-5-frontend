"use client";

import { cn } from "@/lib/utils";
import { useMemo, useRef, useState, useEffect } from "react";

type Category = { label: string; value: string };

type CategoryDropdownProps = {
  categories: Category[];
  value: string; // selected value (example: "all")
  onChange: (value: string) => void;
  className?: string;
};

export function CategoryDropdown({
  categories,
  value,
  onChange,
  className,
}: CategoryDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = useMemo(
    () =>
      categories.find((category) => category.value === value) ??
      categories.find((category) => category.value === "all") ??
      categories[0],
    [categories, value],
  );

  // close on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div ref={ref} className={cn("relative shrink-0", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-11 shrink-0 items-center gap-1.5 rounded-l-full border-r border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:bg-white/70 max-sm:max-w-[126px] max-sm:px-2.5"
      >
        <svg
          className="h-4 w-4 shrink-0 text-slate-500"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <rect x="1" y="1" width="6" height="6" rx="1" />
          <rect x="9" y="1" width="6" height="6" rx="1" />
          <rect x="1" y="9" width="6" height="6" rx="1" />
          <rect x="9" y="9" width="6" height="6" rx="1" />
        </svg>

        <span className="truncate text-xs sm:max-w-[118px] sm:text-sm">
          {selected?.label ?? "All Categories"}
        </span>

        <svg
          className={cn(
            "h-4 w-4 shrink-0 text-slate-400 transition-transform",
            open && "rotate-180",
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute left-0 top-[calc(100%+8px)] z-50 w-60 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
          role="listbox"
        >
          <div className="max-h-72 overflow-y-auto py-1 scrollbar-hide">
            {categories.map((cat, idx) => {
              const active = cat.value === value;
              const isLast = idx === categories.length - 1;

              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => {
                    onChange(cat.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-sm transition",
                    active ? "bg-slate-100 text-slate-900 font-medium" : "text-slate-700 hover:bg-slate-50",
                    isLast && "border-t border-slate-100"
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
