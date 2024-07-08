"use client";
import { Form, useForm } from "react-hook-form";
import {
  appointmentAtom,
  appointmentDetailAtom,
  conversationIdAtom,
  currentUserAtom,
  userIdTargetUserAtom,
} from "@/lib/jotai";
import { useAtom } from "jotai";
import { cn } from "@/lib/utils";
import { useMutationAppointment } from "@/hooks/appointment";

export function Appointment() {
  const [appointmentDetail, setAppointmentDetail] = useAtom(
    appointmentDetailAtom
  );
  const [appointment, setAppointment] = useAtom(appointmentAtom);
  const [userIdTargetUser, setUserIdTargetUser] = useAtom(userIdTargetUserAtom);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [conversationId, setConversationId] = useAtom(conversationIdAtom);

  const mutationAppointment = useMutationAppointment();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      content: "",
      appointmentDate: "",
      startTime: "",
      endTime: "",
      note: "",
      userId: "",
    },
  });

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
      status: "PENDING",
      userId: userIdTargetUser,
    };
    // console.log("🚀 ~ onSubmit ~ body:", body);

    mutationAppointment.mutate(body, {
      onSuccess(data, variables, context) {
        if (data.statusCode === 200) {
          console.log(data.data, "hello");
          setAppointmentDetail({
            status: data.data.status,
            data: data.data,
          });
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
          value={"Trần thuỷ"}
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
        >
          Bỏ qua
        </button>
      </div>
    </form>
  );
}
