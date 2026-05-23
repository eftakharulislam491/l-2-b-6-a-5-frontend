import AboutUs from "@/components/home/AboutUs";
import Banner from "@/components/home/Banner";
import BestSellingProducts from "@/components/home/BestSellingProducts";
import CategorySection from "@/components/home/CategorySection";
import CurvedSplitImage from "@/components/home/CurvedSplitImage";
import DecorateHomeSection from "@/components/home/DecorateHomeSection";
import ExclusiveProduct from "@/components/home/ExclusiveProduct";
import type { ExclusiveCategoryItem } from "@/components/home/ExclusiveProduct";
import PromotionalOffers from "@/components/home/PromotionalOffers";
import WholesaleBanner from "@/components/home/WholesaleBanner";
import { Product } from "@/types/product";
import { getAllProducts } from "@/services/products/getAllProducts";
import { getAllCategories } from "@/services/category/getAllCategories";

const FALLBACK_BASE_URL =
  process.env.BASE_URL || "https://e-commerce-backend-491.vercel.app/";
const PRODUCT_IMAGE_PLACEHOLDER = "/product/product-placeholder.svg";
const CATEGORY_IMAGE_PLACEHOLDER = "/icons/all-ingredients.svg";

function resolveMediaSrc(src: string | null | undefined, fallback: string) {
  if (!src?.trim()) {
    return fallback;
  }

  if (/^(https?:)?\/\//i.test(src) || src.startsWith("data:")) {
    return src;
  }

  try {
    return new URL(src, FALLBACK_BASE_URL).toString();
  } catch {
    return fallback;
  }
}

export default async function page() {
  const { products: apiProducts } = await getAllProducts();
  const { categories: apiCategories } = await getAllCategories();

  // Map API products to the local Product type used by UI components
  const products: Product[] = apiProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    image: resolveMediaSrc(p.images?.[0]?.src ?? p.images?.[0]?.url, PRODUCT_IMAGE_PLACEHOLDER),
    title: p.title,
    category: p.category?.slug || p.categoryId || "all",
    sizes: ["100 gm"],
    defaultSize: "100 gm",
    price: Number(p.price || 0),
    originalPrice: p.compareAtPrice ? Number(p.compareAtPrice) : undefined,
    inStock: p.stock !== null ? p.stock > 0 : true,
    badge: p.isFeatured ? "Featured" : undefined,
  }));

  // Categories for the "Shop by Category" tab section (includes "All")
  const dynamicCategories = [
    {
      label: "All Ingredients",
      value: "all",
      image: "/icons/all-ingredients.svg",
    },
    ...apiCategories.map((c) => ({
      label: c.name,
      value: c.slug,
      image: resolveMediaSrc(c.image, CATEGORY_IMAGE_PLACEHOLDER),
    })),
  ];

  // Categories for the "Exclusive Beauty Essentials" grid section
  const exclusiveCategories: ExclusiveCategoryItem[] = apiCategories.map(
    (c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      image: c.image ?? null,
    })
  );

  return (
    <div>
      <Banner />
      <AboutUs />
      <CategorySection products={products} categories={dynamicCategories} />
      <PromotionalOffers />
      <BestSellingProducts products={products} />
      <WholesaleBanner />
      <DecorateHomeSection />
      <CurvedSplitImage />
      <ExclusiveProduct categories={exclusiveCategories} />
    </div>
  );
}
