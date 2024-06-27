import { IResponse, getData, mutationPost } from "@/config/api";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useContentMessageHook = (conversationId?: string) => {
  const url = "api/v1/conversation/5/content";
  return useQuery<IResponse<any>>({
    queryKey: ["contentConversationId"],
    queryFn: () => getData<IResponse<any>>(url),
  });
};


export const useGetEASHook = (conversationId?: string) => {
  const url = "api/v1/conversation/encrypt-key/2/encrypt-key-v2";
  return useMutation({
    mutationKey: ["getAES"],
    mutationFn: (publicKey: string) => {
      return mutationPost<IResponse<string>>({
        url,
        body: {
          publicKey
        }
      })
    }
  })
};
