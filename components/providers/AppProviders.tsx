"use client";

import { type ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "./cart-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <CartProvider>{children}</CartProvider>
    </ThemeProvider>
  );
}
