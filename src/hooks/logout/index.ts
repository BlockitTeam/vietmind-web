import { IResponse, mutationPost } from "@/config/api";
import { useMutation } from "@tanstack/react-query";

export const useLogoutHook = () => {
  const url = "auth/logout";
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: () => {
      return mutationPost<IResponse<any>>({
        url,
        body: {},
      });
    },
  });
};
