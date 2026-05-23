"use client";
import { HelpCircle, LogOut, Settings, User, UserStar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export const title = "Profile Dropdown with Avatar";

const UserAvatarMenu = () => (
  <DropdownMenu modal={false}>
    <DropdownMenuTrigger asChild>
      <Button className="relative h-10 w-10 rounded-full" variant="ghost">
        <Avatar>
          <AvatarImage
            alt="@haydenbleasel"
            src="https://github.com/haydenbleasel.png"
          />
          <AvatarFallback>HB</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56">
      <DropdownMenuLabel className="font-normal">
        <div className="flex flex-col space-y-1">
          <p className="text-sm leading-none font-medium">Hayden Bleasel</p>
          <p className="text-xs leading-none text-muted-foreground">
            hello@haydenbleasel.com
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <User />
        <Link href="/dashboard">Account</Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <UserStar />
        <Link href="/admin">Admin Panle</Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <HelpCircle />
        Help
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive">
        <LogOut />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default UserAvatarMenu;