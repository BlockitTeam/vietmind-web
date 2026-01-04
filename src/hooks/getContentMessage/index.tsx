import { IResponse, getData, mutationPost } from "@/config/api";
import { useMutation, useQuery } from "@tanstack/react-query";

// GET /doctors/conversations/:conversationId/content - Get conversation messages
export const FetchContentMessage = (conversationId?: string) => {
  const url = `doctors/conversations/${conversationId}/content`;
  return getData<IResponse<any>>(url);
};

export const useContentMessageHook = (conversationId?: string) => {
  return useQuery<IResponse<any>>({
    queryKey: ["contentConversationId", conversationId],
    queryFn: () => FetchContentMessage(conversationId),
    enabled: !!conversationId && conversationId.length > 0,
  });
};

// Note: useGetEASHook is deprecated - server now handles encryption
// Keeping for backward compatibility but it's no longer needed
export const useGetEASHook = (conversationId?: string) => {
  return useMutation({
    mutationKey: ["getAES"],
    mutationFn: async (publicKey: string) => {
      // Deprecated: encryption is now handled server-side
      console.warn("useGetEASHook is deprecated - encryption is now handled server-side");
      return { data: "", statusCode: 200 } as IResponse<string>;
    },
    retry: 0
  });
};

// POST /doctors/conversations/:conversationId/mark-read - Mark messages as read
export const useIsReadMessage = (id: string) => {
  const url = `doctors/conversations/${id}/mark-read`;
  return useMutation({
    mutationKey: ["markMessageIsRead"],
    mutationFn: (body: {}) => {
      return mutationPost<IResponse<any>>({
        url,
        body,
      });
    },
  });
};