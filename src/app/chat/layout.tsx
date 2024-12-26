import React from "react";

export default function Layout({ children }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex h-[calc(100dvh)] flex-col justify-center">{children}</main>
    </div>
  );
}