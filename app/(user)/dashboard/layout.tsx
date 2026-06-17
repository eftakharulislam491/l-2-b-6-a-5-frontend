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
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] gap-8 px-4 sm:px-6 lg:px-8">
        <UserSidebar />
        <main className="min-w-0 flex-1 py-8 lg:py-12">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
