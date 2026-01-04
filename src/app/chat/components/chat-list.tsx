import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChatBottombar from "./chat-bottombar";
import { useAtom } from "jotai";
import {
  conversationIdAtom,
  conversationIdContentAtom,
  currentUserAtom,
  senderFullNameAtom,
} from "@/lib/jotai";
import { useIsReadMessage } from "@/hooks/getContentMessage";
import { checkSenderFromDoctor } from "@/servers/message";
import { useWebSocketContext } from "./webSocketContext";
import { useConversationContext } from "./conversations-provider";

interface IChatMessage {
  fromMe: boolean;
  message: string;
}

export function ChatList() {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [messagesWS, setMessagesWS] = useState<IChatMessage[]>([]);

  const [conversationIdContent] = useAtom(conversationIdContentAtom);
  const [conversationId] = useAtom(conversationIdAtom);
  const isReadMessage = useIsReadMessage(conversationId!);
  const [currentUser] = useAtom(currentUserAtom);
  const [senderFullName] = useAtom(senderFullNameAtom);
  const { lastMessage, isTyping } = useWebSocketContext();
  const { conversations, setConversationWs } = useConversationContext();

  // Load messages from conversation content (REST API)
  useEffect(() => {
    setMessagesWS([]);
    setLoadingMessage(true);

    if (conversationIdContent && conversationIdContent.length > 0) {
      const formattedMessages = conversationIdContent.map((message: any) => ({
        fromMe: checkSenderFromDoctor(currentUser?.id as string, message.senderId),
        message: message.message || message.encryptedMessage || "",
      }));
      setMessagesWS(formattedMessages);
    }
    
    setLoadingMessage(false);
  }, [conversationIdContent, currentUser?.id]);

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (lastMessage !== null && String(lastMessage.conversationId) === conversationId) {
      // Mark messages as read
      isReadMessage.mutate(
        {},
        {
          onSuccess: () => {
            if (conversations?.data) {
              const updated = conversations.data.map((i) => {
                // Handle both new API (id) and legacy API (conversation.conversationId)
                const convId = i.id || i.conversation?.conversationId?.toString();
                if (convId === conversationId) {
                  return { ...i, unreadCount: 0, unreadMessageCount: 0 };
                }
                return i;
              });
              setConversationWs({ data: updated });
            }
          },
        }
      );

      // Add the new message to the list
      setMessagesWS((prevMessages) => [
        ...prevMessages,
        {
          fromMe: false,
          message: lastMessage.message,
        },
      ]);
    }
  }, [lastMessage]);

  // Check if the other user is typing in current conversation
  const showTypingIndicator = isTyping && String(isTyping.conversationId) === conversationId;
  
  // Debug typing indicator
  if (isTyping) {
    console.log("🔍 Typing check:", { 
      isTypingConvId: isTyping.conversationId, 
      currentConvId: conversationId,
      match: String(isTyping.conversationId) === conversationId,
      showTypingIndicator 
    });
  }

  // Auto-scroll to bottom when new messages arrive or typing indicator shows
  React.useLayoutEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messagesWS, showTypingIndicator]);

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
      <div
        ref={messagesContainerRef}
        className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col"
      >
        {loadingMessage && (
          <div className="w-full flex justify-center items-center h-full">
            <div className="w-5 bg-[#d991c2] animate-pulse h-5 rounded-full animate-bounce"></div>
            <div className="w-5 animate-pulse h-5 bg-[#9869b8] rounded-full animate-bounce"></div>
            <div className="w-5 h-5 animate-pulse bg-[#6756cc] rounded-full animate-bounce"></div>
          </div>
        )}
        {!loadingMessage && (
          <AnimatePresence>
            {messagesWS.length > 0 &&
              messagesWS.map((message, index) => (
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
                      duration: 0.5,
                    },
                  }}
                  style={{
                    originX: 0.5,
                    originY: 0.5,
                  }}
                  className={cn(
                    "flex flex-col gap-2 p-4 whitespace-pre-wrap ",
                    message.fromMe ? "items-end" : "items-start"
                  )}
                >
                  <div className="flex gap-3 items-center ">
                    {message.message && (
                      <span
                        className={cn(
                          "bg-accent p-3 rounded-md max-w-screen-sm break-words ",
                          message.fromMe ? "bg-[#C2F8CB]" : "bg-[#E0E9ED]"
                        )}
                      >
                        {message.message}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        )}
        {showTypingIndicator && (
          <p className="text-xs ml-4 text-gray-500 animate-pulse">
            {senderFullName} đang nhập...
          </p>
        )}
      </div>
      <ChatBottombar setMessagesWS={setMessagesWS} />
    </div>
  );
}
