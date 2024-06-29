import { IResponse, getData, mutationPost } from "@/config/api";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useContentMessageHook = (conversationId?: number) => {
  const url = `api/v1/conversation/${conversationId}/content`;
  return useQuery<IResponse<any>>({
    queryKey: ["contentConversationId"],
    queryFn: () => getData<IResponse<any>>(url),
  });
};

export const useGetEASHook = (conversationId?: number) => {
  const url = `api/v1/conversation/${conversationId}/encrypt-key`;
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
  });
};
