import { cookies } from "next/headers"
import Image from "next/image"
import Example from "./components/resize"
import HeaderChat from "@/components/headerChat"


export default function TestPage() {
  const layout = cookies().get("react-resizable-panels:layout")
  const collapsed = cookies().get("react-resizable-panels:collapsed")

  const defaultLayout = layout ? JSON.parse(layout?.value) : undefined
  // const defaultCollapsed = collapsed && collapsed.value ? JSON.parse(collapsed.value) : undefined;

  return (
   <div className="z-10 max-w-5xl w-full h-full lg:flex flex-col">
    <HeaderChat />
    <Example />
   </div>
  )
}