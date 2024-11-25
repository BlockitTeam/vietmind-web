import { IResponse, getData, mutationPost, mutationPut } from "@/config/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient()

    const url = `appointments`;
    return useMutation({
        mutationKey: ['create-appointment'],
        mutationFn: (body: any) => {
            return mutationPost<IResponse<any>>({
                url,
                body
            })
        },
        onSuccess(data, variables, context) {
          void queryClient.invalidateQueries({
            queryKey: ['appointmentId'],
          })
        },
    })
}

// PUT
export const usePutMutationAppointmentIdHook = (id: string | number) => {
  const queryClient = useQueryClient()
  const url = `appointments`;

  return useMutation({
    mutationKey: ['put-appointment', id],
    mutationFn: (body: any) => {
      const obj = {
        url,
        body
      }
      return mutationPut<any>(obj)
    },
    onSuccess(data, variables, context) {
      void queryClient.invalidateQueries({
        queryKey: ['appointmentId'],
      })
    },
  })
}

export const useScheduleAppointment = () => {
  const queryClient = useQueryClient()
  const url = `availabilities`;
  return useMutation({
    mutationKey: ['schedule-appointment'],
    mutationFn: (body: any) => {
      return mutationPost<IResponse<any>>({
        url,
        body
      })
    },
    onSuccess(data, variables, context) {
      void queryClient.invalidateQueries({
        queryKey: ['schedule-appointment'],
      })
    },
  })
}

export const FetchAvailability = () => {
  const url = `availabilities`;
  return getData<IResponse<any>>(url);
};

export const useGetScheduleAppointment = () => {
  return useQuery<IResponse<any>>({
    queryKey: ["schedule-appointment"],
    queryFn: () => FetchAvailability(),
    staleTime: 0
  });
}