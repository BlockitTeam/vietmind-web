import { IResponse, getData, mutationPost } from "@/config/api";
import { useMutation, useQuery } from "@tanstack/react-query";

// GET /doctors/patients/:userId - Get patient basic info
export const fetchBasicUser = (id: string | number) => {
  const url = `doctors/patients/${id}`;
  return getData<IResponse<any>>(url);
};

export const useGetUserBasicHook = (id: string | number) => {
  return useQuery<IResponse<any>>({
    queryKey: ["user-basic", id],
    queryFn: () => fetchBasicUser(id),
    enabled: !!id
  });
};

// POST /user/change-password - Change user password
export const useChangePassword = () => {
  const url = "user/change-password";
  return useMutation({
    mutationKey: ["change-password"],
    mutationFn: (body: { currentPassword: string; newPassword: string }) => {
      return mutationPost<IResponse<any>>({
        url,
        body
      });
    }
  });
};