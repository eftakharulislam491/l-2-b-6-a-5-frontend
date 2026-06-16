import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AdminSidebar } from "@/components/modules/admin/sidebar/AdminSidebar";
import { AdminTopbarActions } from "@/components/modules/admin/dashboard/AdminTopbarActions";
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

      <SidebarInset className="min-w-0 bg-background text-foreground">
        {/* Persistent Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/95 px-3 text-foreground backdrop-blur sm:h-16 sm:px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <AdminTopbarActions user={user} />
        </header>

        {/* Page Content */}
        <main className="min-w-0 flex-1 bg-background p-3 text-foreground sm:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
