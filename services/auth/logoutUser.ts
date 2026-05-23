"use server";

import { deleteCookie } from "./tokenHandlers";

export async function logoutUser() {
  await deleteCookie("accessToken");
  await deleteCookie("refreshToken");
}
