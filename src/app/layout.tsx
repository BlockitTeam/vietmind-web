import type { Metadata } from "next";
import "./globals.css";

import { Inter as FontSans } from "next/font/google";
import React from "react";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
import { Toaster } from "@/components/ui/toaster";

import { Provider } from "jotai";
import QueryClientProvider from "@/lib/queryClientProvider";
import Script from "next/script";
export const metadata: Metadata = {
  title: "Vietmind tư vấn tâm lý",
  description: "",
  icons: {
    icon: "/image/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script strategy="afterInteractive" src="https://dunsregistered.dnb.com" type="text/javascript" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased w-full",
          fontSans.variable
        )}
        suppressHydrationWarning={true}
      >
        <ThemeProvider attribute="class">
          <Provider>
            <QueryClientProvider>{children}</QueryClientProvider>
          </Provider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
