// components/navbar/constants.ts
export type NavbarMainLink = {
  label: string;
  href: string;
};

export const MAIN_NAV_LINKS: NavbarMainLink[] = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/products" },
  { label: "Featured", href: "/products?featured=true" },
  { label: "New Arrivals", href: "/products?sort=newest" },
  { label: "In Stock", href: "/products?stock=in_stock" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function buildCategoryHref(categoryLabel: string) {
  const params = new URLSearchParams({
    category: categoryLabel,
  });

  return `/products?${params.toString()}`;
}
