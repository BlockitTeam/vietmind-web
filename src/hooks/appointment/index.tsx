import { IResponse, getData, mutationPost, mutationPatch } from "@/config/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// PATCH /doctors/appointments/:appointmentId/status - Update appointment status
export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-appointment-status"],
    mutationFn: ({ appointmentId, status }: { appointmentId: string; status: string }) => {
      return mutationPatch<IResponse<any>>({
        url: `doctors/appointments/${appointmentId}/status`,
        body: { status }
      });
    },
    onSuccess() {
      void queryClient.invalidateQueries({
        queryKey: ["futureAppointment"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["currentAppointment"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["appointment-doctor"],
      });
    },
  });
};

// Legacy hook - wraps the new updateAppointmentStatus
export const useMutationAppointment = () => {
  return useUpdateAppointmentStatus();
};

// Legacy hook for updating appointment
export const usePutMutationAppointmentIdHook = (_id: string | number) => {
  return useUpdateAppointmentStatus();
};

// POST /availability - Set doctor availability
export const useScheduleAppointment = () => {
  const queryClient = useQueryClient();
  const url = "availability";
  return useMutation({
    mutationKey: ["schedule-appointment"],
    mutationFn: (body: any) => {
      return mutationPost<IResponse<any>>({
        url,
        body
      });
    },
    onSuccess() {
      void queryClient.invalidateQueries({
        queryKey: ["schedule-appointment"],
      });
    },
  });
};

// GET /availability - Get doctor availability
export const FetchAvailability = () => {
  const url = "availability";
  return getData<IResponse<any>>(url);
};

export const useGetScheduleAppointment = () => {
  return useQuery<IResponse<any>>({
    queryKey: ["schedule-appointment"],
    queryFn: () => FetchAvailability(),
    staleTime: 0
  });
};

// GET /doctors/appointments - Get all doctor appointments
export const FetchAppointmentDoctor = () => {
  const url = "doctors/appointments";
  return getData<IResponse<any>>(url);
};

export const useGetAppointmentDoctor = () => {
  return useQuery<IResponse<any>>({
    queryKey: ["appointment-doctor"],
    queryFn: () => FetchAppointmentDoctor(),
    staleTime: 0
  });
};

// GET /doctors/appointments/patient/:userId/current - Get current appointment with patient
export const useGetCurrentAppointment = (userId: string | number) => {
  return useQuery<IResponse<any>>({
    queryKey: ["currentAppointment", userId],
    queryFn: () => {
      return getData<IResponse<any>>(`doctors/appointments/patient/${userId}/current`);
    },
    enabled: !!userId,
    retry: false
  });
};

// GET /doctors/appointments/patient/:userId/future - Get future appointments with patient
export const useGetFutureAppointment = (userId: string | number) => {
  return useQuery<IResponse<any>>({
    queryKey: ["futureAppointment", userId],
    queryFn: () => {
      return getData<IResponse<any>>(`doctors/appointments/patient/${userId}/future`);
    },
    enabled: !!userId,
    retry: false
  });
};