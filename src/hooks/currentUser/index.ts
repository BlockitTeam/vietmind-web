import { IResponse, getData } from "@/config/api";
import { useQuery } from "@tanstack/react-query";
import queryString from "query-string";

export const useCurrentUserHook = () => {
  const url = "api/v1/user/current-user";
  return useQuery<IResponse<any>>({
    queryKey: ["user"],
    queryFn: () => getData<IResponse<any>>(url),
  });
};
