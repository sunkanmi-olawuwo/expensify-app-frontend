import { Inter, Manrope } from "next/font/google";

import { QueryClientProvider } from "@/lib/api";
import { AuthProvider } from "@/lib/auth";
import { TooltipProvider } from "@/ui/base";
import { ToastProvider } from "@/ui/composite";

import type { Metadata } from "next";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: {
    default: "expensify",
    template: "%s | expensify",
  },
  description:
    "Editorial personal finance workspace built on Next.js App Router.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground min-h-screen antialiased">
        <QueryClientProvider>
          <AuthProvider>
            <TooltipProvider>
              {children}
              <ToastProvider />
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
