import { IResponse, getData, mutationPost } from "@/config/api";
import { useMutation, useQuery } from "@tanstack/react-query";

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

export const useResetPassword = () => {
  const url = "user/reset-password";
  return useMutation({
    mutationKey: ["reset-password"],
    mutationFn: (body: {currentPassword: string, newPassword: string}) => {
      return mutationPost<IResponse<any>>({
        url,
        body
      });
    }
  });
};