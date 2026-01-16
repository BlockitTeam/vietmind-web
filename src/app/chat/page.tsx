import { ChatLayout } from "./components/chat-layout";
import HeaderChat from "@/components/headerChat";

export default function ChatPage() {
  return (
    <div className="hidden z-10 min-w-full w-full h-full flex-col md:flex">
      <HeaderChat />
      <ChatLayout />
    </div>
  );
}
