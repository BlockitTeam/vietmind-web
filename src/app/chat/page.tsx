import { cookies } from "next/headers";
import { ChatLayout } from "./components/chat-layout";
import HeaderChat from "@/components/headerChat";
export default function ChatPage() {
  const layout = cookies().get("react-resizable-panels:layout");
  const collapsed = cookies().get("react-resizable-panels:collapsed");

  const defaultLayout = layout ? JSON.parse(layout?.value) : undefined;
  const defaultCollapsed =
    collapsed && collapsed.value ? JSON.parse(collapsed.value) : undefined;

  return (
    <div className="hidden z-10 min-w-full w-full h-full flex-col md:flex">
      <HeaderChat />
      <ChatLayout
        defaultLayout={defaultLayout}
        defaultCollapsed={defaultCollapsed}
        navCollapsedSize={4}
      />
    </div>
  );
}
