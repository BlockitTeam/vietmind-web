import type { Metadata } from "next";
import "./globals.css";

import { Inter as FontSans } from "next/font/google";
import React from "react";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
import { Toaster } from "@/components/ui/toaster";

import { Provider } from "jotai";
import QueryClientProvider from "@/lib/queryClientProvider";

export const metadata: Metadata = {
  title: "Vietmind tư vấn tâm lý",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
        suppressHydrationWarning={true}
      >
        <Provider>
          <QueryClientProvider>{children}</QueryClientProvider>
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
