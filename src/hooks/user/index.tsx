import { IResponse, getData } from "@/config/api";
import { useQuery } from "@tanstack/react-query";

export const fetchBasicUser = (id: string | number) => {
  const url = `user/basic-info/${id}`;
  return getData<IResponse<any>>(url);
};

export const useGetUserBasicHook = (id: string | number) => {
  return useQuery<IResponse<any>>({
    queryKey: ["user-basic", id],
    queryFn: () => fetchBasicUser(id),
    enabled: !!id
  });
};