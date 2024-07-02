import { IResponse, mutationPost } from "@/config/api";
import { useMutation } from "@tanstack/react-query";

export const useLogoutHook = () => {
  const url = `api/v1/logout`;
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
