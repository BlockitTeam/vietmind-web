import { Message, UserData } from "../data";
import React from "react";
import { ChatList } from "./chat-list";

interface ChatProps {
  isMobile: boolean;
  refetchConversation: () => void;
}

export function Chat({ isMobile, refetchConversation }: ChatProps) {
  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatList
      refetchConversation={refetchConversation}
        isMobile={isMobile}
      />
    </div>
  );
}