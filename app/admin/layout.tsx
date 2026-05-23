import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AdminSidebar } from "@/components/modules/admin/sidebar/AdminSidebar";
import { getUserFromToken } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const user = getUserFromToken(accessToken);

  if (!user) {
    redirect("/login");
  }

  if (!user.isAdmin) {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <AdminSidebar />

      <SidebarInset className="min-w-0">
        {/* Persistent Header */}
        <header className="flex h-14 items-center gap-2 border-b border-neutral-300 px-3 sm:h-16 sm:px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
        </header>

        {/* Page Content */}
        <main className="min-w-0 flex-1 p-3 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
