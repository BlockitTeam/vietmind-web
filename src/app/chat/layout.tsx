import HeaderChat from "@/components/headerChat";

export default function Layout({ children }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <HeaderChat />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  )
}