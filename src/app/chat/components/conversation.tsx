import { Button } from "@/components/ui/button";
import { displayAvatar } from "@/helper";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { ConversationData, useConversationContext } from "./conversations-provider";
import {
  appointmentAtom,
  conversationIdAtom,
  conversationIdContentAtom,
  senderFullNameAtom,
  userConversationIdAtom,
  userIdTargetUserAtom,
} from "@/lib/jotai";
import { decryptMessageWithKeyAES } from "@/servers/message";
import { cn } from "@/utils/cn";
import { useContentMessageHook } from "@/hooks/getContentMessage";
import dayjs from "dayjs";

export const Conversation = () => {
  const { conversations } = useConversationContext();
  // ATOM states
  const [, setUserConversationId] = useAtom(userConversationIdAtom);
  const [, setAppointment] = useAtom(appointmentAtom);
  const [, setSenderFullName] = useAtom(senderFullNameAtom);
  const [conversationId, setConversationId] = useAtom(conversationIdAtom);
  const [, setConversationIdContentAtom] = useAtom(conversationIdContentAtom);
  const [, setUserIdTargetUser] = useAtom(userIdTargetUserAtom);

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
      {
        Array.isArray(conversations) &&
        conversations.map((conversation: ConversationData, index: number) => {
          const isActive = conversation.conversation.conversationId === conversationId;

          return (
            <div
              className={cn(
                "flex items-center mt-2 justify-between cursor-pointer p-2",
                isActive && "bg-[#E0E9ED] text-white"
              )}
              key={index}
              onClick={() => {
                setSenderFullName(conversation.senderFullName);
                setConversationId(conversation.conversation.conversationId);
                setUserIdTargetUser(conversation.conversation.userId);
                setUserConversationId({
                  senderFullName: conversation.senderFullName,
                  conversationId: conversation.conversation.conversationId,
                  userId: conversation.conversation.userId,
                });
                setAppointment(false);
              }}
            >
              <div className="flex  w-full">
                <div className="flex items-center gap-2  w-full">
                  <Button
                    variant="outline"
                    className="border-regal-green bg-regal-green w-[40px] h-[40px]"
                  >
                    {displayAvatar(conversation.senderFullName)}
                  </Button>
                  <div className="cursor-pointer">
                    <p className="text-sm text-neutral-primary">
                      {conversation.senderFullName}
                    </p>
                    <p className="text-sm text-neutral-ternary whitespace-nowrap w-3">
                      {decryptMessageWithKeyAES(
                        conversation.lastMessage.encryptedMessage,
                        conversation.conversation.conversationKey
                      )}
                    </p>
                  </div>
                 
                </div>
                <div className="items-center">
                  <p className="text-sm text-neutral-ternary">{dayjs(conversation.lastMessage.createdAt).format('DD/MM')}</p>
                  <p></p>
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
};