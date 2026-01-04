import {
  FileImage,
  Paperclip,
  SendHorizontal,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  conversationIdAtom,
  userIdTargetUserAtom,
} from "@/lib/jotai";
import { useAtom } from "jotai";
import { useWebSocketContext } from "./webSocketContext";

interface IChatMessage {
  fromMe: boolean;
  message: string;
}
interface ChatBottombarProps {
  setMessagesWS: (_newMessage: IChatMessage[] | ((prev: IChatMessage[]) => IChatMessage[])) => void;
}

export const BottombarIcons = [{ icon: FileImage }, { icon: Paperclip }];

export default function ChatBottombar({
  setMessagesWS,
}: ChatBottombarProps) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [conversationId] = useAtom(conversationIdAtom);
  const [userIdTargetUser] = useAtom(userIdTargetUserAtom);
  const { sendMessage, sendTyping, sendStopTyping } = useWebSocketContext();
  const [imTyping, setImTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced stop typing - will send stop typing after 2 seconds of inactivity
  const stopTypingDebounced = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      if (userIdTargetUser && conversationId) {
        sendStopTyping(userIdTargetUser.toString(), conversationId.toString());
        setImTyping(false);
      }
    }, 2000); // 2 seconds debounce
  }, [userIdTargetUser, conversationId, sendStopTyping]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    
    // Send typing indicator when user starts typing
    if (value.trim().length && !imTyping) {
      setImTyping(true);
      if (userIdTargetUser && conversationId) {
        sendTyping(userIdTargetUser.toString(), conversationId.toString());
      }
    }
    
    // If user is typing, reset the debounce timer
    if (value.trim().length && imTyping) {
      stopTypingDebounced();
    }
    
    // Send stop typing immediately when user clears input
    if (!value.trim().length && imTyping) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      setImTyping(false);
      if (userIdTargetUser && conversationId) {
        sendStopTyping(userIdTargetUser.toString(), conversationId.toString());
      }
    }
    
    setMessage(value);
  };

  const handleThumbsUp = () => {
    if (userIdTargetUser && conversationId) {
      sendMessage(userIdTargetUser.toString(), "👍", conversationId.toString());
      setMessagesWS((prevMessages) => [
        ...prevMessages,
        {
          fromMe: true,
          message: "👍",
        },
      ]);
      setMessage("");
    }
  };

  const handleSend = () => {
    if (message.trim() && userIdTargetUser && conversationId) {
      // Send message via Socket.IO
      sendMessage(userIdTargetUser.toString(), message.trim(), conversationId.toString());
      
      // Add to local messages (optimistic update)
      setMessagesWS((prevMessages) => [
        ...prevMessages,
        {
          fromMe: true,
          message: message.trim(),
        },
      ]);
      
      // Clear typing timeout and stop typing indicator
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (imTyping) {
        sendStopTyping(userIdTargetUser.toString(), conversationId.toString());
        setImTyping(false);
      }
      
      setMessage("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ignore Enter key during IME composition (Vietnamese Telex, etc.)
    if (event.nativeEvent.isComposing) {
      return;
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }

    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setMessage((prev) => prev + "\n");
    }
  };

  return (
    <div className="p-2 flex justify-between w-full items-center gap-2 mb-16">
      <AnimatePresence initial={false}>
        <motion.div
          key="input"
          className="w-full relative"
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.05 },
            layout: {
              type: "spring",
              bounce: 0.15,
            },
          }}
        >
          <Textarea
            autoComplete="off"
            value={message}
            ref={inputRef}
            onKeyDown={handleKeyPress}
            onChange={handleInputChange}
            name="message"
            placeholder="Aa"
            className="w-full border flex items-center h-9 resize-none overflow-hidden bg-background border-regal-green"
          ></Textarea>
        </motion.div>

        {message.trim() ? (
          <Link
            href="#"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-9 w-9",
              "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
            )}
            onClick={handleSend}
          >
            <SendHorizontal size={20} className="text-muted-foreground" />
          </Link>
        ) : (
          <Link
            href="#"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-9 w-9",
              "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
            )}
            onClick={handleThumbsUp}
          >
            <ThumbsUp size={20} className="text-muted-foreground" />
          </Link>
        )}
      </AnimatePresence>
    </div>
  );
}
