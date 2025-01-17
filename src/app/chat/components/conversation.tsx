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
                "cursor-pointer p-2 flex flex-row gap-2",
                isActive && "bg-[#E0E9ED] w-full"
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
              <Button
                variant="outline"
                className="border-regal-green bg-regal-green w-[40px] h-[40px]"
              >
                {displayAvatar(conversation.senderFullName)}
              </Button>
              <div className="flex flex-col w-full overflow-hidden">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between w-full">
                    <p className="text-sm text-neutral-primary truncate overflow-hidden flex-1">
                      {conversation.senderFullName}
                    </p>
                    <p className="text-sm text-neutral-ternary whitespace-nowrap ml-2">{dayjs(conversation.lastMessage.createdAt).format("DD/MM")}</p>
                  </div>
                  <div className="w-full">
                    <p className="text-sm text-ellipsis overflow-hidden whitespace-pre w-full">
                    {decryptMessageWithKeyAES(
                      conversation.lastMessage.encryptedMessage,
                      conversation.conversation.conversationKey
                    )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
};