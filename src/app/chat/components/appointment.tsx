"use client";
import { useForm } from "react-hook-form";
import {
  appointmentAtom,
  appointmentDetailAtom,
  conversationIdAtom,
  currentUserAtom,
  userConversationIdAtom,
  userIdTargetUserAtom,
} from "@/lib/jotai";
import { useAtom } from "jotai";
import { cn } from "@/lib/utils";
import { useGetFutureAppointment, useMutationAppointment, usePutMutationAppointmentIdHook } from "@/hooks/appointment";
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
  const [currentUser,] = useAtom(currentUserAtom);
  const [conversationId,] = useAtom(conversationIdAtom);
  const [, setAppointmentDetail] = useAtom(
    appointmentDetailAtom
  );
  const { sendMessageWS } = useWebSocketContext();
  const mutationAppointment = useMutationAppointment();
  const {
    data: futureAppointments,
    ...queryFutureAppointment
  } = useGetFutureAppointment(userIdTargetUser!);
  const usePutMutationAppointmentId = usePutMutationAppointmentIdHook(
    futureAppointments?.data?.userId
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
    if (futureAppointments?.data && queryFutureAppointment.isSuccess) {
      setAppointmentDetail({
        status: futureAppointments?.data.status,
        data: futureAppointments?.data
      });
      setValue(
        "content",
        futureAppointments?.data.status === "PENDING" ? futureAppointments?.data.content : ""
      );
      setValue(
        "appointmentDate",
        futureAppointments?.data.status === "PENDING" &&
        futureAppointments?.data.appointmentDate
      );
      setValue(
        "startTime",
        futureAppointments?.data.status === "PENDING" && futureAppointments?.data.startTime
      );
      setValue(
        "endTime",
        futureAppointments?.data.status === "PENDING" && futureAppointments?.data.endTime
      );
      setValue(
        "note",
        futureAppointments?.data.status === "PENDING" ? futureAppointments?.data.note : ""
      );
    }
  }, [futureAppointments]);

  const watchFrom = watch("startTime");

  const validateTime = (endTime: string) => {
    const startTime = watchFrom;
    if (!startTime || !endTime) return true;
    return (
      startTime < endTime || "Thời gian kết thúc phải lớn hơn thời gian bắt đầu"
    );
  };

  const onSubmit = (data: any) => {
    const body = {
      ...data,
      conversationId,
      doctorId: currentUser?.id,

      userId: userIdTargetUser,
      status: "PENDING"
    };

    if (futureAppointments?.data && AppointmentStatus.includes(futureAppointments?.data?.status)) {
      const bodyUpdate = {
        ...futureAppointments.data,
        ...data,
        status: "PENDING",
      };

      usePutMutationAppointmentId.mutate(bodyUpdate, {
        onSuccess(data) {
          if (data.statusCode === 200) {
            sendMessageWS(
              JSON.stringify({
                type: "appointment",
                appointmentId: data?.data?.appointmentId,
                conversationId: data?.data?.conversationId,
                status: "PENDING",
                targetUserId: userIdTargetUser.toString().trim(),
              })
            );
            setAppointment(false);
          }
        },
      });
      return;
    }

    mutationAppointment.mutate(body, {
      onSuccess(data) {
        if (data.statusCode === 200) {
          sendMessageWS(
            JSON.stringify({
              type: "appointment",
              appointmentId: data?.data?.appointmentId,
              conversationId: data?.data?.conversationId,
              status: "PENDING",
              targetUserId: userIdTargetUser.toString().trim(),
            })
          );
          setAppointment(false);
        }
      },
      onError: () => {
        notification.error({
          message: "Error",
          description: "Can't create appointment"
        });
      }
    });
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
