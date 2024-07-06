import { IResponse, getData } from "@/config/api";
import { useQuery } from "@tanstack/react-query";

export const fetchScreeningTestUserId = (id: string | number) => {
  const url = `response/result/${id}`;
  return getData<IResponse<any>>(url);
};

export const useGetScreeningTestUserIdHook = (id: string | number) => {
  return useQuery<IResponse<any>>({
    queryKey: ["screening-testUserId"],
    queryFn: () => fetchScreeningTestUserId(id),
    enabled: !!id
  });
};
