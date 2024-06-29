import { IResponse, getData, mutationPost } from "@/config/api";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetConversation = () => {
  const url = "api/v1/conversation";
  return useQuery<IResponse<any>>({
    queryKey: ["conversation"],
    queryFn: () => getData<IResponse<any>>(url),
  });
};