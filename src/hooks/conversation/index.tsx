import { ConversationData } from "@/app/chat/components/conversations-provider";
import { IResponse, getData } from "@/config/api";
import { useQuery } from "@tanstack/react-query";

export const FetchConversation = () => {
  const url = `conversation`;
  return getData<IResponse<ConversationData[]>>(url);
};

export const FetchNoteConversationId = (id: string | number) => {
  const url = `conversation/${id}/note`;
  return getData<IResponse<any>>(url);
};

export const useGetConversation = () => {
  return useQuery<IResponse<ConversationData[]>>({
    queryKey: ["conversations"],
    queryFn: () => FetchConversation()
  });
};

export const useGetNoteConversationId = (id: string | number) => {
  return useQuery<IResponse<any>>({
    queryKey: ["conversationId"],
    queryFn: () => FetchNoteConversationId(id),
    enabled:!!id
  });
};