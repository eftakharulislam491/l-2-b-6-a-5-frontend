// components/navbar/SidebarOverlay.tsx
"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { SocialBtn } from "./SocialBtn";
import { buildCategoryHref, MAIN_NAV_LINKS } from "./constants";

type SidebarOverlayProps = {
  categories: Array<{
    label: string;
    value: string;
  }>;
  onClose: () => void;
};

export function SidebarOverlay({ categories, onClose }: SidebarOverlayProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const activeCategory = searchParams.get("category");
  const searchParamsKey = searchParams.toString();

  useEffect(() => {
    const currentOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = currentOverflow;
    };
  }, []);

  function isMainLinkActive(href: string) {
    const url = new URL(href, "https://metro.local");

    if (pathname !== url.pathname) {
      return false;
    }

    if (!href.includes("?")) {
      return pathname === url.pathname && searchParamsKey.length === 0;
    }

    return searchParamsKey === url.searchParams.toString();
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <aside
        className={cn(
          "absolute inset-4 flex overflow-hidden rounded-2xl bg-white shadow-2xl transition-[width] duration-300 ease-out lg:inset-y-4 lg:left-4 lg:right-auto",
          categoriesOpen
            ? "lg:w-[min(950px,calc(100vw-2rem))]"
            : "lg:w-[min(390px,calc(100vw-2rem))]"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* LEFT PANEL */}
        <div className="flex min-w-0 flex-1 flex-col lg:w-[390px] lg:flex-none">
          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-100">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 transition shrink-0"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <span
              className="font-black text-xl tracking-tight text-slate-900 uppercase select-none"
              style={{
                fontFamily: "'Montserrat','Trebuchet MS',sans-serif",
                letterSpacing: "-0.03em",
              }}
            >
              <span className="text-red-600">M</span>ETRO
            </span>
          </div>

          {/* Links */}
          <nav className="flex flex-1 flex-col">
            {MAIN_NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center border-b border-slate-100 px-7 py-[22px] text-[17px] font-medium transition",
                  isMainLinkActive(item.href)
                    ? "bg-slate-900 text-white"
                    : "text-slate-800 hover:bg-slate-50",
                )}
              >
                {item.label}
              </Link>
            ))}

            {/* Categories toggle */}
            <button
              type="button"
              onClick={() => setCategoriesOpen((open) => !open)}
              className={cn(
                "flex w-full items-center justify-between border-b border-slate-100 px-7 py-[22px] text-left text-[17px] font-medium transition hover:bg-slate-50",
                categoriesOpen ? "text-red-600" : "text-slate-800",
              )}
            >
              Categories
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border transition",
                  categoriesOpen
                    ? "border-red-200 bg-red-50 text-red-500"
                    : "border-slate-200 text-slate-400"
                )}
              >
                <svg
                  className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    categoriesOpen && "rotate-90"
                  )}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </span>
            </button>

            {categoriesOpen ? (
              <div className="border-b border-slate-100 px-4 py-4 lg:hidden">
                <div className="max-h-[42vh] overflow-y-auto rounded-xl bg-slate-50 py-1">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <Link
                        key={category.value}
                        href={buildCategoryHref(category.label)}
                        onClick={onClose}
                        className={cn(
                          "flex items-center px-4 py-3 text-[15px] transition hover:bg-white hover:text-slate-950",
                          activeCategory === category.label
                            ? "bg-white font-medium text-slate-950"
                            : "text-slate-800",
                        )}
                      >
                        {category.label}
                      </Link>
                    ))
                  ) : (
                    <p className="px-4 py-3 text-sm text-slate-500">
                      No categories available right now.
                    </p>
                  )}
                </div>
              </div>
            ) : null}
          </nav>

          {/* Social */}
          <div className="flex flex-wrap items-center gap-2.5 px-7 py-6">
            <SocialBtn label="Facebook">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </SocialBtn>

            <SocialBtn label="Instagram">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </SocialBtn>

            <SocialBtn label="YouTube">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
                <polygon
                  points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
                  fill="white"
                />
              </svg>
            </SocialBtn>

            <SocialBtn label="X / Twitter">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </SocialBtn>

            <SocialBtn label="Pinterest">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
              </svg>
            </SocialBtn>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div
          className={cn(
            "hidden overflow-hidden border-l border-slate-100 transition-all duration-300 ease-out lg:flex lg:flex-1 lg:flex-col",
            categoriesOpen
              ? "translate-x-0 opacity-100"
              : "pointer-events-none -translate-x-4 opacity-0",
          )}
        >
          <div className="border-b border-slate-100 px-8 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Browse Categories
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Jump straight into the catalog
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto py-3">
            {categories.length > 0 ? (
              categories.map((category) => (
                <Link
                  key={category.value}
                  href={buildCategoryHref(category.label)}
                  onClick={onClose}
                  className={cn(
                    "flex items-center px-8 py-[14px] text-[16px] transition hover:bg-slate-50 hover:text-slate-950",
                    activeCategory === category.label
                      ? "bg-slate-50 font-medium text-slate-950"
                      : "text-slate-800",
                  )}
                >
                  {category.label}
                </Link>
              ))
            ) : (
              <p className="px-8 py-6 text-sm text-slate-500">
                No categories available right now.
              </p>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
