type CategoryItem = {
  label: string;
  value: string;
  image?: string;
};

export const HOME_PRODUCT_CATEGORIES: readonly CategoryItem[] = [
  {
    label: "All Ingredients",
    value: "all",
    image: "/icons/all-ingredients.svg",
  },
  {
    label: "Formula Bases",
    value: "formula-bases",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=80&q=60&auto=format&fit=crop",
  },
  {
    label: "Actives & Additives",
    value: "actives-additives",
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=80&q=60&auto=format&fit=crop",
  },
  {
    label: "Oils & Extracts",
    value: "oils-extracts",
    image:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=80&q=60&auto=format&fit=crop",
  },
  {
    label: "Hydrators & Gels",
    value: "hydrators-gels",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=80&q=60&auto=format&fit=crop",
  },
];

const FALLBACK_NAVBAR_CATEGORIES = HOME_PRODUCT_CATEGORIES.map(
  ({ label, value }) => ({
    label,
    value,
  })
);

export function getNavBarCategoriesWithFallback(
  categories?: Array<{ label: string; value: string }>
): Array<{ label: string; value: string }> {
  if (!categories || categories.length === 0) {
    return FALLBACK_NAVBAR_CATEGORIES;
  }
  return categories;
}
