import { IResponse, getData } from "@/config/api";
import { useQuery } from "@tanstack/react-query";

export const FetchCurrentUser = () => {
  const url = `user/current-user`;
  return getData<IResponse<any>>(url);
};

export const useCurrentUserHook = () => {
  const url = "user/current-user";
  return useQuery<IResponse<any>>({
    queryKey: ["user"],
    queryFn: () => FetchCurrentUser()
  });
};
