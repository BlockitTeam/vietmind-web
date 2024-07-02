import {
  FileImage,
  Mic,
  Paperclip,
  PlusCircle,
  SendHorizontal,
  Smile,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Message, loggedInUserData } from "../data";
import { buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TypingMessageAtom, aesKeyAtom, conversationIdAtom, privateKeyAtom, publicKeyAtom, userIdTargetUserAtom } from "@/lib/jotai";
import { useAtom } from "jotai";
import CryptoJS from "crypto-js";
import { encryptMessage } from "@/servers/message";

type INewMessageWS = {
  type: "message";
  conversationId: string;
  message: string;
};

interface IChatMessage {
  fromMe: boolean;
  message: string;
}
interface ChatBottombarProps {
  isMobile: boolean;
  sendMessageWS: (newMessageWS: string) => void;
  setMessagesWS: (newMessage: IChatMessage[]) => void;
}

export const BottombarIcons = [{ icon: FileImage }, { icon: Paperclip }];

export default function ChatBottombar({
  isMobile,
  sendMessageWS,
  setMessagesWS,
}: ChatBottombarProps) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [loadTyping, setLoadTyping] = useState(false);
  const [privateKeyAtomStorage, setPrivateKeyAtom] = useAtom(privateKeyAtom);
  const [publicKeyAtomStorage, setPublicKeyAtom] = useAtom(publicKeyAtom);
  const [aesKey, setAesKey] = useAtom(aesKeyAtom);
  const [conversationId, setConversationId] = useAtom(conversationIdAtom);
  const [userIdTargetUser, setUserIdTargetUser] = useAtom(userIdTargetUserAtom);
  const [typingMessage, setTypingMessage] = useAtom(TypingMessageAtom);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    let newMessageWS = {};
    if (event.target.value.toString().trim().length) {
      newMessageWS = {
        type: "typing",
        conversationId: conversationId,
        // message: encryptMessage(message.trim(), aesKey),
        targetUserId: userIdTargetUser
      };
    } else {
       newMessageWS = {
        type: "unTyping",
        conversationId: conversationId,
        // message: encryptMessage(message.trim(), aesKey),
        targetUserId: userIdTargetUser
      };
    }
    sendMessageWS(JSON.stringify(newMessageWS));
    setMessage(event.target.value);
  };

  const handleThumbsUp = () => {
    if (aesKey) {
      const newMessageWS = {
        type: "message",
        conversationId: conversationId,
        message: encryptMessage("👍", aesKey),
        targetUserId: userIdTargetUser
      };
      sendMessageWS(JSON.stringify(newMessageWS));
      // @ts-ignore
      setMessagesWS((prevMessages: IChatMessage[]) => [
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
    if (message.trim()) {
      if (aesKey) {
        const newMessageWS = {
          type: "message",
          conversationId: conversationId,
          message: encryptMessage(message.trim(), aesKey),
          targetUserId: userIdTargetUser
        };
        sendMessageWS(JSON.stringify(newMessageWS));
        // @ts-ignore
        setMessagesWS((prevMessages: IChatMessage[]) => [
          ...prevMessages,
          {
            fromMe: true,
            message: message.trim(),
          },
        ]);
        setMessage("");

        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }

    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setMessage((prev) => prev + "\n");
    }
  };

  useEffect(() => {

  }, [conversationId])

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
          {
            typingMessage && (
              <div className="my-2">
                <span>Typing...</span>
              </div>
            )
          }
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
          <div className="absolute right-2 bottom-0.5  ">
            {/* <EmojiPicker
              onChange={(value) => {
                setMessage(message + value);
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }}
            /> */}
          </div>
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
