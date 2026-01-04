"use client";
import { useForm } from "react-hook-form";
import {
  appointmentAtom,
  appointmentDetailAtom,
  userConversationIdAtom,
  userIdTargetUserAtom,
} from "@/lib/jotai";
import { useAtom } from "jotai";
import { cn } from "@/lib/utils";
import { useGetFutureAppointment, usePutMutationAppointmentIdHook } from "@/hooks/appointment";
import { useWebSocketContext } from "./webSocketContext";
import { useEffect } from "react";
import { notification } from "antd";
import dayjs from "dayjs";

const AppointmentStatus = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];

export function Appointment() {
  const [userConversationId,] = useAtom(
    userConversationIdAtom
  );

  const [, setAppointment] = useAtom(appointmentAtom);
  const [userIdTargetUser,] = useAtom(userIdTargetUserAtom);
  const [, setAppointmentDetail] = useAtom(
    appointmentDetailAtom
  );
  const { sendRawMessage } = useWebSocketContext();
  const {
    data: futureAppointmentsResponse,
    ...queryFutureAppointment
  } = useGetFutureAppointment(userIdTargetUser!);
  
  // Extract the first future appointment from the nested response structure
  // API returns: { data: { data: [...], auditId }, statusCode }
  const futureAppointment = (futureAppointmentsResponse?.data as any)?.data?.[0];
  
  const usePutMutationAppointmentId = usePutMutationAppointmentIdHook(
    futureAppointment?.userId
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      content: "",
      appointmentDate: "",
      startTime: "",
      endTime: "",
      note: "",
      userId: userConversationId && userConversationId.userId,
    },
  });

  useEffect(() => {
    if (futureAppointment && queryFutureAppointment.isSuccess) {
      setAppointmentDetail({
        status: futureAppointment.status,
        data: futureAppointment
      });
      setValue(
        "content",
        futureAppointment.status === "PENDING" ? futureAppointment.content : ""
      );
      setValue(
        "appointmentDate",
        futureAppointment.status === "PENDING" && futureAppointment.appointmentDate
      );
      setValue(
        "startTime",
        futureAppointment.status === "PENDING" && futureAppointment.startTime
      );
      setValue(
        "endTime",
        futureAppointment.status === "PENDING" && futureAppointment.endTime
      );
      setValue(
        "note",
        futureAppointment.status === "PENDING" ? futureAppointment.note : ""
      );
    }
  }, [futureAppointment, queryFutureAppointment.isSuccess, setAppointmentDetail, setValue]); 

  const watchFrom = watch("startTime");

  const validateTime = (endTime: string) => {
    const startTime = watchFrom;
    if (!startTime || !endTime) return true;
    return (
      startTime < endTime || "Thời gian kết thúc phải lớn hơn thời gian bắt đầu"
    );
  };

  const onSubmit = () => {
    // Check if there's an existing appointment to update status
    if (futureAppointment && AppointmentStatus.includes(futureAppointment?.status)) {
      const appointmentId = futureAppointment?.id || futureAppointment?.appointmentId;
      
      if (!appointmentId) {
        notification.error({
          title: "Error",
          description: "No appointment ID found"
        });
        return;
      }

      // Update appointment status to PENDING (reschedule request)
      usePutMutationAppointmentId.mutate(
        { appointmentId: String(appointmentId), status: "PENDING" },
        {
          onSuccess(responseData) {
            if (responseData.statusCode === 200) {
              sendRawMessage("appointment", {
                type: "appointment",
                appointmentId: responseData?.data?.id || responseData?.data?.appointmentId,
                conversationId: responseData?.data?.conversationId,
                status: "PENDING",
                targetUserId: userIdTargetUser.toString().trim(),
              });
              setAppointment(false);
              notification.success({
                title: "Success",
                description: "Appointment status updated"
              });
            }
          },
          onError: () => {
            notification.error({
              title: "Error",
              description: "Can't update appointment"
            });
          }
        }
      );
      return;
    }

    // Note: Creating new appointments from doctor portal may require a different endpoint
    // The current API (PATCH /doctors/appointments/:id/status) only supports status updates
    notification.warning({
      title: "Info",
      description: "Please ask the patient to create an appointment from their app"
    });
    setAppointment(false);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" bg-white space-y-4 mt-4"
    >
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          Nội dung buổi hẹn *
        </label>
        <input
          placeholder="hi..."
          id="content"
          {...register("content", {
            required: "Nội dung là bắt buộc",
            minLength: 3,
          })}
          className="mt-1 block w-full border border-regal-green rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
        />
        {errors.content && (
          <p className="text-sm text-red-500">{errors.content.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="appointmentDate"
          className="block text-sm font-medium text-gray-700"
        >
          Ngày *
        </label>
        <input
          type="date"
          id="appointmentDate"
          data-date-format="DD MMMM YYYY"
          {...register("appointmentDate", {
            required: "Ngày là bắt buộc", validate: (value) => {
              const selectedDate = dayjs(value);
              const today = dayjs().startOf("day"); // Get current date without time
              if (selectedDate.isBefore(today)) {
                return "Ngày phải lớn hơn hoặc bằng ngày hiện tại";
              }
              return true;
            }
          },)}
          className="mt-1 block w-full border border-regal-green rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
        />
        {errors.appointmentDate && (
          <p className="text-sm text-red-500">
            {errors.appointmentDate.message}
          </p>
        )}
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <label
            htmlFor="startTime"
            className="block text-sm font-medium text-gray-700"
          >
            Từ *
          </label>
          <input
            type="time"
            id="startTime"
            {...register("startTime", {
              required: "Thời gian là bắt buộc",
            })}
            className="mt-1 block w-full border border-regal-green rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
          />
          {errors.startTime && (
            <p className="text-sm text-red-500">{errors.startTime.message}</p>
          )}
        </div>
        <div className="flex-1">
          <label
            htmlFor="endTime"
            className="block text-sm font-medium text-gray-700"
          >
            Đến *
          </label>
          <input
            type="time"
            id="endTime"
            {...register("endTime", {
              required: "Thời gian là bắt buộc",
              validate: validateTime,
            })}
            className="mt-1 block w-full border border-regal-green rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
          />
          {errors.endTime && (
            <p className="text-sm text-red-500">{errors.endTime.message}</p>
          )}
        </div>
      </div>
      <div>
        <label
          htmlFor="note"
          className="block text-sm font-medium text-gray-700"
        >
          Ghi chú *
        </label>
        <input
          placeholder="hi..."
          id="note"
          {...register("note", { required: "Ghi chú là bắt buộc" })}
          className="mt-1 block w-full border border-regal-green rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
        />
        {errors.note && (
          <p className="text-sm text-red-500">{errors.note.message}</p>
        )}
      </div>

      <div className="flex justify-between">
        <button
          disabled={!isValid}
          type="submit"
          className={cn(
            "py-2 px-4 text-white font-semibold rounded-md shadow-md  focus:outline-none focus:ring-2 focus:ring-opacity-75",
            isValid
              ? "bg-green-500 focus:ring-green-400 hover:bg-green-600"
              : "bg-gray-400 focus:ring-gray-400 hover:bg-gray-600"
          )}
        >
          Đặt lịch
        </button>
        <button
          type="button"
          className="py-2 px-4 bg-gray-300 text-gray-700 font-semibold rounded-md shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
          onClick={() => setAppointment(false)}
        >
          Bỏ qua
        </button>
      </div>
    </form>
  );
}
