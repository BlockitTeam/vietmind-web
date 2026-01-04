import { ConversationData } from "@/app/chat/components/conversations-provider";
import { IResponse, getData, mutationPost } from "@/config/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// GET /doctors/conversations?senderName={name} - List doctor conversations
export const FetchConversation = (senderName: string) => {
  const url = `doctors/conversations?senderName=${senderName}`;
  return getData<IResponse<ConversationData[]>>(url);
};

// GET /doctors/conversations/:conversationId/note - Get conversation note
export const FetchNoteConversationId = (id: string | number) => {
  const url = `doctors/conversations/${id}/note`;
  return getData<IResponse<any>>(url);
};

export const useGetConversation = (senderName: string) => {
  return useQuery<IResponse<ConversationData[]>>({
    queryKey: ["conversations", senderName],
    queryFn: () => FetchConversation(senderName)
  });
};

export const useGetNoteConversationId = (id: string | number) => {
  return useQuery<IResponse<any>>({
    queryKey: ["noteConversationId", id],
    queryFn: () => FetchNoteConversationId(id),
    enabled: !!id
  });
};

// POST /doctors/conversations/:conversationId/note - Update conversation note
export const usePutNoteConversationId = (id: string | number) => {
  const queryClient = useQueryClient();

  const url = `doctors/conversations/${id}/note`;
  return useMutation({
    mutationKey: ["postConversationId"],
    mutationFn: (body: any) => {
      return mutationPost<IResponse<any>>({
        url,
        body
      });
    },
    onSuccess() {
      void queryClient.invalidateQueries({
        queryKey: ["noteConversationId"],
      });
    },
  });
};