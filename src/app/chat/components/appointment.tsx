"use client";
import { Form, useForm } from "react-hook-form";
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
import { useAppointmentIdHook, useMutationAppointment, usePutMutationAppointmentIdHook } from "@/hooks/appointment";
import { useWebSocketContext } from "./webSocketContext";
import { useEffect } from "react";

export function Appointment() {
  const [userConversationId, setUserConversationId] = useAtom(
    userConversationIdAtom
  );

  const [appointment, setAppointment] = useAtom(appointmentAtom);
  const [userIdTargetUser, setUserIdTargetUser] = useAtom(userIdTargetUserAtom);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [conversationId, setConversationId] = useAtom(conversationIdAtom);
  const [appointmentDetail, setAppointmentDetail] = useAtom(
    appointmentDetailAtom
  );
  //socket
  const { sendMessageWS, updateUrl, lastMessage } = useWebSocketContext();
  //HOOK
  const {
    data: appointments,
    refetch: refetchAppointment,
    ...queryAppointment
  } = useAppointmentIdHook(conversationId);
  const mutationAppointment = useMutationAppointment();
  const usePutMutationAppointmentId = usePutMutationAppointmentIdHook(
    appointments?.data.conversationId
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
      userId: userConversationId && userConversationId.senderFullName,
    },
  });

  //Start: Todo setup websocket
  useEffect(() => {
    if (lastMessage !== null) {
      const newMessage = JSON.parse(lastMessage.data);
      if (newMessage?.type === "appointment") {
        refetchAppointment().then((res) => {
          setAppointment(res.data?.data);
        });
      }
    }
  }, [lastMessage]);

  //End: Todo setup websocket

  useEffect(() => {
    if (appointments?.data) {
      setAppointmentDetail({
        status: appointments?.data.status,
        data: appointments?.data
      })
      setValue(
        "content",
        appointments?.data.status === "PENDING" && appointments?.data.content
      );
      setValue(
        "appointmentDate",
        appointments?.data.status === "PENDING" &&
          appointments?.data.appointmentDate
      );
      setValue(
        "startTime",
        appointments?.data.status === "PENDING" && appointments?.data.startTime
      );
      setValue(
        "endTime",
        appointments?.data.status === "PENDING" && appointments?.data.endTime
      );
      setValue(
        "note",
        appointments?.data.status === "PENDING" && appointments?.data.note
      );
    }
  }, [appointments]);

  const watchFrom = watch("startTime");
  const watchTo = watch("endTime");

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
    };

    if (appointments?.data) {
      const bodyUpdate = {
        ...appointments.data,
        ...data,
        status: "PENDING",
      };

      usePutMutationAppointmentId.mutate(bodyUpdate, {
        onSuccess(data, variables, context) {
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
      onSuccess(data, variables, context) {
        if (data.statusCode === 200) {
          console.log('2222     type:"appointment",');
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
          {...register("appointmentDate", { required: "Ngày là bắt buộc" })}
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
      <div>
        <label
          htmlFor="userId"
          className="block text-sm font-medium text-gray-700"
        >
          Người dùng *
        </label>
        <input
          id="userId"
          disabled
          placeholder="Trần thuỷ"
          {...register("userId")}
          className="mt-1 block w-full border border-regal-green rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
        />
        {errors.userId && (
          <p className="text-sm text-red-500">{errors.userId.message}</p>
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
