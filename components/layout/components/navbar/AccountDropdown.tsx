"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  Settings,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type AccountDropdownProps = {
  user: {
    name: string;
    email: string;
    image?: string | null;
    isAdmin?: boolean;
  };
  onLogout?: () => void;
  disabled?: boolean;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

export default function AccountDropdown({
  user,
  onLogout,
  disabled = false,
}: AccountDropdownProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account"
          disabled={disabled}
          className="flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white pl-1 pr-2 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Avatar size="default" className="size-8 border border-slate-200 bg-slate-100">
            {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
            <AvatarFallback className="bg-slate-900 text-xs font-semibold text-white">
              {getInitials(user.name) || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-28 truncate text-sm font-medium sm:block">
            {user.name}
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={10} className="w-72 rounded-xl p-2">
        {/* Top user header */}
        <DropdownMenuLabel className="p-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
              <AvatarFallback>{getInitials(user.name) || "U"}</AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Items */}
        {user.isAdmin ? (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/admin" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Admin Panel
            </Link>
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                My Account
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/dashboard/orders" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                My Orders
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          onClick={onLogout}
          className={cn(
            "cursor-pointer flex items-center gap-2",
            "text-red-600 focus:text-red-600 focus:bg-red-50"
          )}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
