"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderKanban,
  LayoutDashboard,
  ListOrdered,
  MessageSquareText,
  PackagePlus,
  PackageSearch,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      items: [
        {
          title: "Dashboard",
          url: "/admin",
          icon: LayoutDashboard,
        },
        {
          title: "Categories",
          url: "/admin/categories",
          icon: FolderKanban,
        },
        {
          title: "All Products",
          url: "/admin/products",
          icon: PackageSearch,
        },
        {
          title: "Add Product",
          url: "/admin/add-product",
          icon: PackagePlus,
        },
        {
          title: "Orders",
          url: "/admin/orders",
          icon: ListOrdered,
        },
        {
          title: "Reviews",
          url: "/admin/reviews",
          icon: MessageSquareText,
        },
      ],
    },
  ],
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar {...props} className="border border-sidebar-border bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
            MA
          </div>
          <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">
            Metro Admin
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((navItem) => (
                  <SidebarMenuItem key={navItem.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === navItem.url}
                      tooltip={navItem.title}
                    >
                      <Link href={navItem.url}>
                        <navItem.icon />
                        <span>{navItem.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
