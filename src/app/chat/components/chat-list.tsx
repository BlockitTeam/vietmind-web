import { Message, UserData } from "../data";
import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import ChatBottombar from "./chat-bottombar";
import useWebSocket, { ReadyState } from "react-use-websocket";

interface ChatListProps {
  isMobile: boolean;
}

interface IChatMessage {
  fromMe: boolean;
  message: string;
}

export function ChatList({
  isMobile,
}: ChatListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [messagesWS, setMessagesWS] = useState<IChatMessage[]>([]);

  const {
    sendMessage: sendMessageWS,
    lastMessage,
    readyState,
  } = useWebSocket("ws://localhost:9001/ws", {
    onOpen: () => console.log("WebSocket connection established"),
    queryParams: {
      targetUserId: "a7d40ae2-3387-43d3-87dc-030b12adff47",
    },
  });

  React.useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messagesWS]);

  React.useEffect(() => {
    if (lastMessage !== null) {
      const { type, key, message, encrypted } = JSON.parse(lastMessage.data);
      setMessagesWS((prevMessages) => [
        ...prevMessages,
        {
          fromMe: false,
          message,
        },
      ]);
    }
  }, [lastMessage]);

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
      <div
        ref={messagesContainerRef}
        className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col"
      >
        <AnimatePresence>
          {/* {messages?.map((message, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
              transition={{
                opacity: { duration: 0.1 },
                layout: {
                  type: "spring",
                  bounce: 0.3,
                  duration: messages.indexOf(message) * 0.05 + 0.2,
                },
              }}
              style={{
                originX: 0.5,
                originY: 0.5,
              }}
              className={cn(
                "flex flex-col gap-2 p-4 whitespace-pre-wrap",
                message.name !== selectedUser.name ? "items-end" : "items-start"
              )}
            >
              <div className="flex gap-3 items-center">
                {message.name === selectedUser.name && (
                  <Avatar className="flex justify-center items-center">
                    <AvatarImage
                      src={message.avatar}
                      alt={message.name}
                      width={6}
                      height={6}
                    />
                  </Avatar>
                )}
                <span className=" bg-accent p-3 rounded-md max-w-xs">
                  {message.message}
                </span>
                {message.name !== selectedUser.name && (
                  <Avatar className="flex justify-center items-center">
                    <AvatarImage
                      src={message.avatar}
                      alt={message.name}
                      width={6}
                      height={6}
                    />
                  </Avatar>
                )}
              </div>
            </motion.div>
          ))} */}
          {messagesWS.length &&
            messagesWS?.map((message, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
                transition={{
                  opacity: { duration: 0.1 },
                  layout: {
                    type: "spring",
                    bounce: 0.3,
                    duration: messagesWS.indexOf(message) * 0.05 + 0.2,
                  },
                }}
                style={{
                  originX: 0.5,
                  originY: 0.5,
                }}
                className={cn(
                  "flex flex-col gap-2 p-4 whitespace-pre-wrap",
                  message.fromMe ? "items-end" : "items-start"
                )}
              >
                <div className="flex gap-3 items-center">
                  {!message.fromMe && message.message && (
                    <Avatar className="flex justify-center items-center">
                      <AvatarImage
                        src={"/User1.png"}
                        alt={"hello"}
                        width={6}
                        height={6}
                      />
                    </Avatar>
                  )}
                  {message.message && (
                    <span className=" bg-accent p-3 rounded-md max-w-xs">
                      {message.message}
                    </span>
                  )}
                  {message.fromMe && message.message && (
                    <Avatar className="flex justify-center items-center">
                      <AvatarImage
                        src={"/User2.png"}
                        alt={"hello"}
                        width={6}
                        height={6}
                      />
                    </Avatar>
                  )}
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
      <ChatBottombar
        sendMessageWS={sendMessageWS}
        isMobile={isMobile}
        setMessagesWS={setMessagesWS}
      />
    </div>
  );
}
