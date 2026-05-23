import { cookies } from "next/headers";

import { getUserFromToken } from "@/lib/auth";
import { getAllCategories } from "@/services/category/getAllCategories";

import NavbarClient, { type NavbarUser, type NavbarCategory } from "./NavbarClient";

export default async function Navbar() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const user: NavbarUser | null = getUserFromToken(accessToken);

  const { categories: apiCategories } = await getAllCategories();
  const categories: NavbarCategory[] = apiCategories.map((c) => ({
    label: c.name,
    value: c.slug,
  }));

  return <NavbarClient user={user} categories={categories} />;
}
