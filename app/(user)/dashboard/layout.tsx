import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import UserSidebar from "@/components/modules/user/UserSidebar";
import { getUserFromToken } from "@/lib/auth";
import React from "react";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const user = getUserFromToken(accessToken);

  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  if (user.isAdmin) {
    redirect("/admin");
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto flex gap-12 sm:px-6 lg:px-8">
        <UserSidebar />
        <main className="mt-12 flex-1">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
