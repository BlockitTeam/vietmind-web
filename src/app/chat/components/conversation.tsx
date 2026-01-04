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
import { cn } from "@/utils/cn";
import { useContentMessageHook, useIsReadMessage } from "@/hooks/getContentMessage";
import dayjs from "dayjs";
import { useWebSocketContext } from "./webSocketContext";

export const Conversation = () => {
  const { conversations, refetchConversation } = useConversationContext();
  // ATOM states
  const [, setUserConversationId] = useAtom(userConversationIdAtom);
  const [, setAppointment] = useAtom(appointmentAtom);
  const [, setSenderFullName] = useAtom(senderFullNameAtom);
  const [conversationId, setConversationId] = useAtom(conversationIdAtom);
  const [, setConversationIdContentAtom] = useAtom(conversationIdContentAtom);
  const [, setUserIdTargetUser] = useAtom(userIdTargetUserAtom);
  const { lastMessage } = useWebSocketContext();

  const { data: contentConversationId, ...queryConversationId } =
    useContentMessageHook(conversationId);

  const isReadMessage = useIsReadMessage(conversationId!);

  useEffect(() => {
    if (queryConversationId.isSuccess) {
      // Extract from nested response: { data: { data: [...], auditId }, statusCode }
      const messages = (contentConversationId?.data as any)?.data;
      setConversationIdContentAtom(messages || []);
    }
  }, [contentConversationId, queryConversationId.isSuccess, setConversationIdContentAtom]);

  // Refetch conversations when receiving new messages
  useEffect(() => {
    if (lastMessage) {
      // Refresh conversation list to update last message preview
      refetchConversation();
    }
  }, [lastMessage, refetchConversation]);

  useEffect(() => {
    if (conversationId) {
      queryConversationId.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  // Sanitize message content - remove newlines and HTML tags
  const sanitizeMessage = (message: string): string => {
    return message.replace(/(\r\n|\n|\r|<br\s*\/?>)/g, " ").trim();
  };

  // Get display message
  const getDisplayMessage = (conversation: ConversationData): string => {
    if (!conversation.lastMessage?.message) {
      return "Bắt đầu cuộc trò chuyện...";
    }
    
    return sanitizeMessage(conversation.lastMessage.message);
  };

  // Get display date - prefer lastMessageAt, fallback to createdAt
  const getDisplayDate = (conversation: ConversationData): string => {
    return conversation.lastMessageAt || conversation.lastMessage?.createdAt || conversation.createdAt;
  };

  return (
    <div className="h-full w-full block">
      {
        Array.isArray(conversations?.data) && conversations.data.length > 0 ? (
        conversations.data.map((conversation: ConversationData, index: number) => {
          const isActive = conversation.id === conversationId;

          return (
            <div
              className={cn(
                "cursor-pointer p-2 flex flex-row gap-2 w-full",
                isActive && "bg-[#E0E9ED]"
              )}
              key={conversation.id || index}
              onClick={() => {
                setSenderFullName(conversation.patientName);
                setConversationId(conversation.id);
                setUserIdTargetUser(conversation.patientId);
                setUserConversationId({
                  senderFullName: conversation.patientName,
                  conversationId: conversation.id,
                  userId: conversation.patientId,
                });
                isReadMessage.mutate(
                  {},
                  {
                    onSuccess: () => {
                      refetchConversation();
                    },
                  }
                );
                setAppointment(false);
              }}
            >
              <Button
                variant="outline"
                className="border-regal-green bg-regal-green w-[40px] h-[40px]"
              >
                {displayAvatar(conversation.patientName)}
              </Button>
              <div className="flex flex-col w-full overflow-hidden">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between w-full gap-2">
                    <p className="text-sm text-neutral-primary truncate overflow-hidden flex-1 font-bold">
                      {conversation.patientName}
                    </p>
                    <p className="text-sm text-neutral-ternary whitespace-nowrap min-w-[45px] text-right">
                      {dayjs(getDisplayDate(conversation)).format("DD/MM")}
                    </p>
                  </div>
                  <div className="w-full flex justify-between">
                    <p className="text-sm text-ellipsis overflow-hidden whitespace-pre w-3/4">
                      {getDisplayMessage(conversation)}
                    </p>
                    {conversation.unreadCount > 0 && conversationId !== conversation.id && (
                      <div className="text-sm bg-regal-green h-5 w-5 text-center rounded">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-neutral-primary">Không tìm thấy cuộc trò chuyện</p>
          </div>
        )}
        
    </div>
  );
};
