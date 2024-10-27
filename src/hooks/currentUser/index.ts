import { IResponse, getData } from "@/config/api";
import { useQuery } from "@tanstack/react-query";

export const FetchCurrentUser = () => {
  const url = `user/current-user`;
  return getData<IResponse<any>>(url);
};

export const FetchCurrentUserDoctor = () => {
  const url = `user/current-user-doctor`;
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
