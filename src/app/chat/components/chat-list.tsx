import { Message, UserData } from "../data";
import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import ChatBottombar from "./chat-bottombar";
import useWebSocket, { ReadyState } from "react-use-websocket";
import NodeRSA from "node-rsa";
import CryptoJS from "crypto-js";
import { useAtom } from "jotai";
import { aesKeyAtom, privateKeyAtom, publicKeyAtom } from "@/lib/jotai";
import axiosInstance from "@/config/axios/axiosInstance";
import { JSEncrypt } from "jsencrypt";
import { useGetEASHook } from "@/hooks/getContentMessage";

interface ChatListProps {
  isMobile: boolean;
}

interface IChatMessage {
  fromMe: boolean;
  message: string;
}

export function ChatList({ isMobile }: ChatListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [messagesWS, setMessagesWS] = useState<IChatMessage[]>([]);
  const [privateKey, setPrivateKey] = useState<string | null>("");
  const [privateKeyAtomStorage, setPrivateKeyAtom] = useAtom(privateKeyAtom);
  const [publicKeyAtomStorage, setPublicKeyAtom] = useAtom(publicKeyAtom);
  const [aesKey, setAesKey] = useAtom(aesKeyAtom);

  const getAES = useGetEASHook("5");

  const decryptMessage = (m: string): string => {
    if (aesKey) {
      const messDecrypt = CryptoJS.AES.decrypt(m, aesKey, {
        mode: CryptoJS.mode.ECB,
      }).toString(CryptoJS.enc.Utf8);

      return messDecrypt;
    } else {
      throw "Error";
    }
  };

  const {
    sendMessage: sendMessageWS,
    lastMessage,
    readyState,
  } = useWebSocket("ws://localhost:9001/ws", {
    onOpen: () => console.log("WebSocket connection established"),
    onMessage: (message) => {
      if (aesKey) {
        const data = JSON.parse(message.data);
        if (data?.message) {
          setMessagesWS((prevMessages) => [
            ...prevMessages,
            {
              fromMe: false,
              message: decryptMessage(data.message),
            },
          ]);
        }
      }
    },
    queryParams: {
      targetUserId: "a7d40ae2-3387-43d3-87dc-030b12adff47",
    },
  });

  React.useLayoutEffect(() => {
    // Generate RSA keys
    const JSEncryptLib = new JSEncrypt({ default_key_size: "512" });

    // Generate key pair
    JSEncryptLib.getKey();

    // Get private and public keys
    const privateKey = JSEncryptLib.getPrivateKeyB64();
    const publicKey = JSEncryptLib.getPublicKeyB64();
    setPrivateKeyAtom(privateKey);
    setPrivateKey(privateKey);

    getAES.mutate(publicKey, {
      onSuccess: async (resp) => {
        if (resp.statusCode === 200) {
          const aesKeyDecrypted = await JSEncryptLib.decrypt(resp.data);

          if (typeof aesKeyDecrypted === "string") {
            const decodedKey: any = CryptoJS.enc.Base64.parse(aesKeyDecrypted);
            setAesKey(decodedKey);
            return;
          }
          setAesKey(null);
        }
      },
      onError(error, variables, context) {
        console.log(error);
      },
    });
  }, []);

  React.useLayoutEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messagesWS]);

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
      <div
        ref={messagesContainerRef}
        className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col"
      >
        <AnimatePresence>
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
                    <span className="bg-accent p-3 rounded-md max-w-screen-sm break-words">
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
