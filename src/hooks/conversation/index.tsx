import { IResponse, getData } from "@/config/api";
import { useQuery } from "@tanstack/react-query";

export const FetchConversation = () => {
  const url = `conversation`;
  return getData<IResponse<any>>(url);
};

export const FetchNoteConversationId = (id: string | number) => {
  const url = `conversation/${id}/note`;
  return getData<IResponse<any>>(url);
};

export const useGetConversation = () => {
  return useQuery<IResponse<any>>({
    queryKey: ["conversation"],
    queryFn: () => FetchConversation()
  });
};

export const useGetNoteConversationId = (id: string | number) => {
  return useQuery<IResponse<any>>({
    queryKey: ["conversation"],
    queryFn: () => FetchNoteConversationId(id),
    enabled:!!id
  });
};