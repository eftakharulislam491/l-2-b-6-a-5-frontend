"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Menu, Search, ShoppingCart, User } from "lucide-react";
import { useMemo, useState, useTransition, type FormEvent } from "react";

import { getNavBarCategoriesWithFallback } from "@/lib/home-product-categories";
import { logoutUser } from "@/services/auth/logoutUser";
import { useCart } from "@/components/providers/cart-provider";
import { ModeToggle } from "@/components/ui/ModeToggle";

import AccountDropdown from "./components/navbar/AccountDropdown";
import CartSidebar from "./components/navbar/CartSidebar";
import { CategoryDropdown } from "./components/navbar/CategoryDropdown";
import { SidebarOverlay } from "./components/navbar/SidebarOverlay";
import { MAIN_NAV_LINKS } from "./components/navbar/constants";

export type NavbarUser = {
  name: string;
  email: string;
  image?: string | null;
  isAdmin?: boolean;
};

export type NavbarCategory = {
  label: string;
  value: string;
};

type NavbarClientProps = {
  user: NavbarUser | null;
  categories?: NavbarCategory[];
};

export default function NavbarClient({
  user,
  categories: dynamicCategories,
}: NavbarClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    items: cartItems,
    itemCount,
    isLoading: isCartLoading,
    isUpdating: isCartUpdating,
    refreshCart,
  } = useCart();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSearching, startSearchTransition] = useTransition();
  const [isLoggingOut, startLogoutTransition] = useTransition();

  const categories = useMemo(() => {
    const resolvedCategories = getNavBarCategoriesWithFallback(dynamicCategories);
    const uniqueCategories = resolvedCategories.filter((currentCategory, index, items) => {
      const normalizedValue = currentCategory.value.trim().toLowerCase();

      if (!normalizedValue) {
        return false;
      }

      return (
        items.findIndex(
          (candidateCategory) =>
            candidateCategory.value.trim().toLowerCase() === normalizedValue,
        ) === index
      );
    });

    if (uniqueCategories.some((currentCategory) => currentCategory.value === "all")) {
      return uniqueCategories;
    }

    return [{ label: "All Categories", value: "all" }, ...uniqueCategories];
  }, [dynamicCategories]);

  const categoryLinks = useMemo(
    () => categories.filter((currentCategory) => currentCategory.value !== "all"),
    [categories],
  );
  const showCartBadgeLoading =
    isCartUpdating || (isCartLoading && cartItems.length === 0);
  const searchParamsKey = searchParams.toString();
  const routeDrivenSearchState = useMemo(() => {
    if (pathname !== "/products") {
      return {
        syncKey: pathname,
        category: "all",
        searchQuery: "",
      };
    }

    const currentSearchParams = new URLSearchParams(searchParamsKey);
    const currentQuery = currentSearchParams.get("query") ?? "";
    const currentCategoryLabel = currentSearchParams.get("category");
    const matchedCategory = currentCategoryLabel
      ? categories.find(
          (currentCategory) =>
            currentCategory.label.toLowerCase() ===
              currentCategoryLabel.trim().toLowerCase() ||
            currentCategory.value.toLowerCase() ===
              currentCategoryLabel.trim().toLowerCase(),
        )
      : null;

    return {
      syncKey: `${pathname}?${searchParamsKey}|${categories
        .map((currentCategory) => currentCategory.value)
        .join(",")}`,
      category: matchedCategory?.value ?? "all",
      searchQuery: currentQuery,
    };
  }, [categories, pathname, searchParamsKey]);
  const [category, setCategory] = useState(routeDrivenSearchState.category);
  const [searchQuery, setSearchQuery] = useState(routeDrivenSearchState.searchQuery);
  const [lastRouteSyncKey, setLastRouteSyncKey] = useState(
    routeDrivenSearchState.syncKey,
  );

  if (lastRouteSyncKey !== routeDrivenSearchState.syncKey) {
    setLastRouteSyncKey(routeDrivenSearchState.syncKey);
    setCategory(routeDrivenSearchState.category);
    setSearchQuery(routeDrivenSearchState.searchQuery);
  }

  function handleLogout() {
    startLogoutTransition(async () => {
      await logoutUser();
      await refreshCart();
      router.refresh();
    });
  }

  function buildProductsSearchHref() {
    const nextSearchParams = new URLSearchParams();
    const trimmedQuery = searchQuery.trim();
    const selectedCategory = categories.find(
      (currentCategory) => currentCategory.value === category,
    );

    if (trimmedQuery) {
      nextSearchParams.set("query", trimmedQuery);
    }

    if (selectedCategory && selectedCategory.value !== "all") {
      nextSearchParams.set("category", selectedCategory.label);
    }

    const serializedSearch = nextSearchParams.toString();

    return serializedSearch ? `/products?${serializedSearch}` : "/products";
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startSearchTransition(() => {
      router.push(buildProductsSearchHref());
    });
  }

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
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 shadow-sm backdrop-blur">
        <div className="container mx-auto px-4 py-3 sm:px-0">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 gap-y-3 sm:gap-x-3 lg:gap-4">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
                className="flex h-10 items-center justify-center gap-2 rounded-full border border-border px-3 text-foreground transition hover:bg-secondary active:scale-95"
              >
                <Menu className="h-5 w-5" />
                <span className="hidden text-sm font-medium sm:inline">Menu</span>
              </button>

              <Link href="/" className="min-w-0 select-none">
                <span
                  className="block truncate text-xl font-black tracking-tight text-foreground uppercase sm:text-2xl"
                  style={{
                    fontFamily: "'Montserrat','Trebuchet MS',sans-serif",
                    letterSpacing: "-0.03em",
                  }}
                >
                  <span className="text-red-600">M</span>ETRO
                </span>
              </Link>
            </div>

            <div className="col-span-3 min-w-0 lg:col-span-1 lg:justify-self-center">
              <form
                onSubmit={handleSearchSubmit}
                className="mx-auto flex w-full max-w-[840px] items-center rounded-full border border-border bg-muted transition focus-within:border-ring focus-within:bg-card focus-within:shadow-sm"
              >
                <CategoryDropdown
                  categories={categories}
                  value={category}
                  onChange={setCategory}
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search products"
                  className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />

                <button
                  type="submit"
                  aria-label="Search"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-r-full text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                >
                  {isSearching ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                </button>
              </form>
            </div>

            <nav className="flex shrink-0 items-center justify-end gap-2 lg:justify-self-end">
              <ModeToggle />

              <CartSidebar
                items={cartItems}
                isLoading={isCartLoading}
                onCheckout={() => router.push("/cart")}
              >
                <button
                  type="button"
                  aria-label="Cart"
                  className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition hover:bg-secondary"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span
                    className={`absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none font-bold ${
                      showCartBadgeLoading
                        ? "bg-slate-900 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {showCartBadgeLoading ? (
                      <Loader2 className="h-2.5 w-2.5 animate-spin" />
                    ) : (
                      itemCount
                    )}
                  </span>
                </button>
              </CartSidebar>

              {user ? (
                <AccountDropdown
                  user={user}
                  onLogout={handleLogout}
                  disabled={isLoggingOut}
                />
              ) : (
                <Link
                  href="/login"
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 active:scale-95 sm:gap-2 sm:px-4"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              )}
            </nav>
          </div>
        </div>

        <div className="hidden border-t border-border md:block">
          <div className="container mx-auto flex items-center gap-3 overflow-x-auto px-4 py-3 sm:px-0">
            <nav className="flex shrink-0 items-center gap-2 whitespace-nowrap">
              {MAIN_NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isMainLinkActive(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* {secondaryCategories.length > 0 ? (
              <>
                <div className="h-5 w-px shrink-0 bg-slate-200" />
                <div className="flex min-w-0 items-center gap-2 whitespace-nowrap">
                  {secondaryCategories.map((currentCategory) => (
                    <Link
                      key={currentCategory.value}
                      href={buildCategoryHref(currentCategory.label)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        pathname === "/products" &&
                        activeCategory === currentCategory.label
                          ? "border-red-200 bg-red-50 text-red-600"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      {currentCategory.label}
                    </Link>
                  ))}
                </div>
              </>
            ) : null} */}
          </div>
        </div>
      </header>

      {sidebarOpen ? (
        <SidebarOverlay
          categories={categoryLinks}
          onClose={() => setSidebarOpen(false)}
        />
      ) : null}
    </>
  );
}
