import { Message, UserData } from "../data";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import ChatBottombar from "./chat-bottombar";
import useWebSocket, { ReadyState } from "react-use-websocket";
import CryptoJS from "crypto-js";
import { useAtom } from "jotai";
import {
  TypingMessageAtom,
  aesKeyAtom,
  conversationIdAtom,
  conversationIdContentAtom,
  currentUserAtom,
  privateKeyAtom,
  publicKeyAtom,
  userIdTargetUserAtom,
} from "@/lib/jotai";
import { JSEncrypt } from "jsencrypt";
import { useGetEASHook } from "@/hooks/getContentMessage";
import { checkSenderFromDoctor, decryptMessage } from "@/servers/message";
// @ts-ignore:next-line
import { useWebSocketContext } from "./webSocketContext";

interface ChatListProps {
  isMobile: boolean;
  refetchConversation: () => void;
}

interface IChatMessage {
  fromMe: boolean;
  message: string;
}

export function ChatList({ isMobile, refetchConversation }: ChatListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [socketUrl, setSocketUrl] = useState("ws://localhost:9001/ws");
  const [messagesWS, setMessagesWS] = useState<IChatMessage[]>([]);
  const [privateKey, setPrivateKey] = useState<string | null>("");
  const [publicKey, setPublicKey] = useState<string>("");
  const [privateKeyAtomStorage, setPrivateKeyAtom] = useAtom(privateKeyAtom);
  const [publicKeyAtomStorage, setPublicKeyAtom] = useAtom(publicKeyAtom);
  const [aesKey, setAesKey] = useAtom(aesKeyAtom);
  const [conversationIdContent, setConversationIdContentAtom] = useAtom(
    conversationIdContentAtom
  );
  const [conversationId, setConversationId] = useAtom(conversationIdAtom);
  const [userIdTargetUser, setUserIdTargetUser] = useAtom(userIdTargetUserAtom);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [typingMessage, setTypingMessage] = useAtom(TypingMessageAtom)
  const { sendMessageWS, updateUrl, lastMessage } = useWebSocketContext();

  const getAES = useGetEASHook(conversationId);
  // const {
  //   sendMessage: sendMessageWS,
  //   lastMessage,
  //   readyState,
  // } = useWebSocket(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
  //   onOpen: () => console.log("WebSocket connection established"),
  //   onMessage: (message) => {
  //     const data = JSON.parse(message.data);
  //     console.log(data, 'data')

  //     if (aesKey) {
  //       data?.type === 'typing' ? setTypingMessage(true) : setTypingMessage(false);
  //       if (data?.message) {
  //         setMessagesWS((prevMessages) => [
  //           ...prevMessages,
  //           {
  //             fromMe: false,
  //             message: decryptMessage(data.message, aesKey),
  //           },
  //         ]);
  //       }
  //     }
  //     if (data?.type == 'message') {
  //       refetchConversation();
  //     }
  //   },
  //   queryParams: {
  //     targetUserId: userIdTargetUser,
  //   },
  // });

  // Generate RSA keys

  const JSEncryptLib = new JSEncrypt({ default_key_size: "512" });

  React.useLayoutEffect(() => {
    setMessagesWS([]);
    // Generate key pair
    JSEncryptLib.getKey();

    // Get private and public keys
    const privateKey = JSEncryptLib.getPrivateKeyB64();
    const publicKey = JSEncryptLib.getPublicKeyB64();
    setPrivateKeyAtom(privateKey);
    setPrivateKey(privateKey);
    setPublicKey(publicKey);

    if (conversationId) {
      setLoadingMessage(true);
      getAES.mutate(publicKey, {
        onSuccess: async (resp) => {
          if (resp.statusCode === 200) {
            const aesKeyDecrypted = JSEncryptLib.decrypt(resp.data);
            if (typeof aesKeyDecrypted === "string") {
              const decodedKeyAES: any =
                CryptoJS.enc.Base64.parse(aesKeyDecrypted);
              setAesKey(decodedKeyAES);
              if (conversationIdContent.length > 0 && decodedKeyAES) {
                conversationIdContent.map((message: any) => {
                  setMessagesWS((prevMessages) => [
                    ...prevMessages,
                    {
                      fromMe: checkSenderFromDoctor(
                        currentUser?.id as string,
                        message.senderId
                      ),
                      message: decryptMessage(
                        message.encryptedMessage,
                        decodedKeyAES
                      ),
                    },
                  ]);
                });
              }
              setLoadingMessage(false);
              return;
            }
            setAesKey(null);
            setLoadingMessage(false);
          }
        },
        onError(error, variables, context) {
          setLoadingMessage(false);
          console.log(error);
        },
      });
    }
  }, [conversationIdContent]);

  useEffect(() => {
    if (lastMessage !== null) {
      const newMessage = JSON.parse(lastMessage.data);
      console.log("🚀 ~ useEffect ~ newMessage:", newMessage)
      const decryptedMessage = decryptMessage(newMessage.message, aesKey);
      setMessagesWS((prevMessages) => [
        ...prevMessages,
        {
          fromMe: false,
          message: decryptedMessage,
        },
      ]);
    }
  }, [lastMessage, aesKey, currentUser]);

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
        {loadingMessage && (
          <div className="w-full flex justify-center items-center h-full">
            <div className="w-5 bg-[#d991c2] animate-pulse h-5 rounded-full animate-bounce"></div>
            <div className="w-5 animate-pulse h-5 bg-[#9869b8] rounded-full animate-bounce"></div>
            <div className="w-5 h-5 animate-pulse bg-[#6756cc] rounded-full animate-bounce"></div>
          </div>
        )}
        {!loadingMessage && (
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
                      // duration: messagesWS.indexOf(message) * 0.05 + 0.2,
                      duration: 0.5
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
        )}
      </div>
      <ChatBottombar
        sendMessageWS={sendMessageWS}
        isMobile={isMobile}
        setMessagesWS={setMessagesWS}
      />
    </div>
  );
}
