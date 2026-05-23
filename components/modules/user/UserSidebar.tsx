"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  MapPin,
  LogOut,
} from "lucide-react";
import { useTransition } from "react";
import { logoutUser } from "@/services/auth/logoutUser";

type SidebarItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: "My Orders",
    href: "/dashboard/orders",
    icon: <ShoppingCart size={18} />,
  },
  {
    label: "My Addresses",
    href: "/dashboard/addresses",
    icon: <MapPin size={18} />,
  },
];

export default function UserSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, startLogoutTransition] = useTransition();

  function handleLogout() {
    startLogoutTransition(async () => {
      await logoutUser();
      router.refresh();
      router.push("/login");
    });
  }

  return (
    <aside className="min-h-screen w-64 border-r bg-white pt-12">
      <nav className="space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-10 border-t pt-4">
        <button
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-70"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut size={18} />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  );
}
