import { Button } from "@/components/ui/button";
import { useGetConversation } from "@/hooks/conversation";
import { useContentMessageHook } from "@/hooks/getContentMessage";
import {
  conversationIdAtom,
  conversationIdContentAtom,
  currentUserAtom,
  senderFullNameAtom,
  userConversationIdAtom,
  userIdTargetUserAtom,
} from "@/lib/jotai";
import { decryptMessageWithKeyAES } from "@/servers/message";
import { cn } from "@/utils/cn";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
export const Conversation = () => {
  // ATOM
  const [userConversationId, setUserConversationId] = useAtom(
    userConversationIdAtom
  );

  const [senderFullName, setSenderFullName] = useAtom(senderFullNameAtom);
  const [conversationId, setConversationId] = useAtom(conversationIdAtom);
  const [conversationIdContent, setConversationIdContentAtom] = useAtom(
    conversationIdContentAtom
  );
  const [userIdTargetUser, setUserIdTargetUser] = useAtom(userIdTargetUserAtom);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

  // query
  const { data: conversations, ...queryConversation } = useGetConversation();
  const { data: contentConversationId, ...queryConversationId } =
    useContentMessageHook(conversationId);

  useEffect(() => {
    if (queryConversationId.isSuccess) {
      setConversationIdContentAtom(contentConversationId?.data);
    }
  }, [contentConversationId]);

  useEffect(() => {
    if (conversationId > 0) {
      queryConversationId.refetch();
    }
  }, [conversationId]);
  return (
    <>
      {queryConversation.isSuccess &&
        conversations?.data &&
        Array.isArray(conversations?.data) &&
        conversations?.data.map((conversation: any, index: number) => {
          const isActive =
            conversation?.conversation?.conversationId === conversationId;

          return (
            <div
              className={cn(
                "flex items-center mt-2 justify-between cursor-pointer p-2",
                isActive && "bg-[#E0E9ED] text-white"
              )}
              key={index}
              onClick={() => {
                setSenderFullName(conversation?.senderFullName);
                setConversationId(conversation?.conversation?.conversationId);
                setUserIdTargetUser(conversation?.conversation?.userId);
                setUserConversationId({
                  senderFullName: conversation?.senderFullName,
                  conversationId: conversation?.conversation?.conversationId,
                  userId: conversation?.conversation?.userId,
                });
              }}
            >
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  className="border-regal-green bg-regal-green w-[40px] h-[40px]"
                >
                  NT
                </Button>
                <div className="cursor-pointer">
                  <p className="text-sm text-neutral-primary">
                    {conversation?.senderFullName}
                  </p>
                  <p className="text-sm text-neutral-ternary whitespace-nowrap w-3">
                    {decryptMessageWithKeyAES(
                      conversation?.lastMessage?.encryptedMessage,
                      conversation?.conversation?.conversationKey
                    )}
                  </p>
                </div>
              </div>
              <div className="items-center">
                {/* <p className="text-sm text-neutral-ternary">{conversation?.lastMessage.createdAt}</p> */}
                <p></p>
              </div>
            </div>
          );
        })}
    </>
  );
};
