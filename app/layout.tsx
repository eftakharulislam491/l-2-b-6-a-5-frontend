import type { Metadata } from "next";
import { GlobalLoadingProvider } from "@/components/providers/global-loading-provider";
import { AppProviders } from "@/components/providers/AppProviders";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "FurniNest | Curated Furniture Store",
    template: "%s | FurniNest",
  },
  description:
    "Shop curated furniture, decor, and home essentials with secure checkout and a modern customer dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <GlobalLoadingProvider>
          <AppProviders>
            {children}
            <Toaster position="top-right" richColors />
          </AppProviders>
        </GlobalLoadingProvider>
      </body>
    </html>
  );
}
