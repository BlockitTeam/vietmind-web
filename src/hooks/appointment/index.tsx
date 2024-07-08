import { IResponse, getData, mutationPost } from "@/config/api";
import { useMutation, useQuery } from "@tanstack/react-query";

export const FetchAppointment = (id: string | number) => {
  const url = `appointments/conversation/${id}`;
  return getData<IResponse<any>>(url);
};

export const useAppointmentIdHook = (id: string | number) => {
  return useQuery<IResponse<any>>({
    queryKey: ["appointmentId", id],
    queryFn: () => FetchAppointment(id),
    enabled:!!id
  });
};

// POST
export const useMutationAppointment = () => {
    const url = `appointments`;
    return useMutation({
        mutationKey: ['create-appointment'],
        mutationFn: (body: any) => {
            return mutationPost<IResponse<any>>({
                url,
                body
            })
        }
    })
}