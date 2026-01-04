import { IResponse, getData } from "@/config/api";
import { useQuery } from "@tanstack/react-query";

// GET /user/current-user - Get current user info
export const FetchCurrentUser = () => {
  const url = "user/current-user";
  return getData<IResponse<any>>(url);
};

// GET /doctors/me - Get current doctor profile
export const FetchCurrentUserDoctor = () => {
  const url = "doctors/me";
  return getData<IResponse<any>>(url);
};

export const useCurrentUserHook = () => {
  return useQuery<IResponse<any>>({
    queryKey: ["user"],
    queryFn: () => FetchCurrentUser()
  });
};

export const useCurrentUserDoctorHook = () => {
  return useQuery<IResponse<any>>({
    queryKey: ["userDoctor"],
    queryFn: () => FetchCurrentUserDoctor()
  });
};
