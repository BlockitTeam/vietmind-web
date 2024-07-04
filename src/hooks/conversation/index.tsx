import { IResponse, getData } from "@/config/api";
import { useQuery } from "@tanstack/react-query";


export const FetchConversation = () => {
  const url = `conversation`;
  return getData<IResponse<any>>(url);
};

export const useGetConversation = () => {
  return useQuery<IResponse<any>>({
    queryKey: ["conversation"],
    queryFn: () => FetchConversation()
  });
};