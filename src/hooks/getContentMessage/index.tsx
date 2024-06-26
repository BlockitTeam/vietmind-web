import { IResponse, getData } from "@/config/api";
import { useQuery } from "@tanstack/react-query";
import queryString from "query-string";

export const useContentMessageHook = (conversationId?: string) => {
  const url = "api/v1/conversation/5/content";
  return useQuery<IResponse<any>>({
    queryKey: ["contentConversationId"],
    queryFn: () => getData<IResponse<any>>(url),
  });
};
