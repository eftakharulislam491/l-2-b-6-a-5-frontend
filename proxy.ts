import { NextResponse, type NextRequest } from "next/server";

import { getUserFromToken } from "@/lib/auth";

export function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const user = getUserFromToken(accessToken);

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!user.isAdmin) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
