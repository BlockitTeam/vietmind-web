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
            queryKey: ['appointmentId', data.data.conversationId],
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
        queryKey: ['appointmentId', data.data.conversationId],
      })
    },
  })
}