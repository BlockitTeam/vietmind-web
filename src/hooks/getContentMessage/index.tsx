import { IResponse, getData, mutationPost } from "@/config/api";
import { useMutation, useQuery } from "@tanstack/react-query";

export const FetchContentMessage = (conversationId?: number) => {
  const url = `conversation/${conversationId}/content`;
  return getData<IResponse<any>>(url);
};


export const useContentMessageHook = (conversationId?: number) => {
  return useQuery<IResponse<any>>({
    queryKey: ["contentConversationId", conversationId],
    queryFn: () => FetchContentMessage(conversationId),
    enabled: !!conversationId && conversationId > 0, // Only enable the query if conversationId is greater than 0
  });
};

export const useGetEASHook = (conversationId?: number) => {
  const url = `conversation/${conversationId}/encrypt-key`;
  return useMutation({
    mutationKey: ["getAES"],
    mutationFn: (publicKey: string) => {
      return mutationPost<IResponse<string>>({
        url,
        body: {
          publicKey,
        },
      });
    },
    retry: 0
  });
};

export const useIsReadMessage = (id: number) => {
  const url = `message/markMessageIsReadByConverId/${id}`;
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