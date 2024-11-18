import React from "react";
import { ChatList } from "./chat-list";

interface ChatProps {
  isMobile: boolean;
}

export function Chat() {
  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatList />
    </div>
  );
}
