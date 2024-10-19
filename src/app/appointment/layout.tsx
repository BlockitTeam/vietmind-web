import HeaderChat from "@/components/headerChat";

export default function Layout({ children }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <div className="flex h-screen w-full flex-col">
      <main className="flex h-full flex-col justify-center overflow-auto">{children}</main>
    </div>
  )
}