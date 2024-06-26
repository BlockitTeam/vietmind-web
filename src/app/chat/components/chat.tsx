import { Message, UserData } from "../data";
import React from "react";
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";

interface ChatProps {
  isMobile: boolean;
}

export function Chat({ isMobile }: ChatProps) {
  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatList
        isMobile={isMobile}
      />
    </div>
  );
}