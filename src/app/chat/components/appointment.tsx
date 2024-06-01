"use client"
import { Form, useForm } from "react-hook-form";
import { appointmentAtom, appointmentDetailAtom } from "@/lib/jotai";
import { useAtom } from "jotai";
import { cn } from "@/lib/utils";

export function Appointment() {
  const [appointmentDetail, setAppointmentDetail] = useAtom(
    appointmentDetailAtom
  );
  const [appointment, setAppointment] = useAtom(appointmentAtom);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      appointmentContent: "",
      date: "",
      from: "",
      to: "",
      notes: "",
      user: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
    setAppointmentDetail({
      status: "waitingForAccept",
      data,
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
          htmlFor="appointmentContent"
          className="block text-sm font-medium text-gray-700"
        >
          Nội dung buổi hẹn *
        </label>
        <input
          placeholder="hi..."
          id="appointmentContent"
          {...register("appointmentContent", {
            required: "Nội dung là bắt buộc",
            minLength: 3,
          })}
          className="mt-1 block w-full border border-regal-green rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
        />
        {errors.appointmentContent && (
          <p className="text-sm text-red-500">
            {errors.appointmentContent.message}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700"
        >
          Ngày *
        </label>
        <input
          type="date"
          id="date"
          {...register("date", { required: "Ngày là bắt buộc" })}
          className="mt-1 block w-full border border-regal-green rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
        />
        {errors.date && (
          <p className="text-sm text-red-500">{errors.date.message}</p>
        )}
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <label
            htmlFor="from"
            className="block text-sm font-medium text-gray-700"
          >
            Từ *
          </label>
          <input
            type="time"
            id="from"
            {...register("from", {
              required: "Thời gian là bắt buộc",
            })}
            className="mt-1 block w-full border border-regal-green rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
          />
          {errors.from && (
            <p className="text-sm text-red-500">{errors.from.message}</p>
          )}
        </div>
        <div className="flex-1">
          <label
            htmlFor="to"
            className="block text-sm font-medium text-gray-700"
          >
            Đến *
          </label>
          <input
            type="time"
            id="to"
            {...register("to", { required: "Thời gian là bắt buộc" })}
            className="mt-1 block w-full border border-regal-green rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
          />
          {errors.to && (
            <p className="text-sm text-red-500">{errors.to.message}</p>
          )}
        </div>
      </div>
      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700"
        >
          Ghi chú *
        </label>
        <input
          placeholder="hi..."
          id="notes"
          {...register("notes", { required: "Ghi chú là bắt buộc" })}
          className="mt-1 block w-full border border-regal-green rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
        />
        {errors.notes && (
          <p className="text-sm text-red-500">{errors.notes.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="user"
          className="block text-sm font-medium text-gray-700"
        >
          Người dùng *
        </label>
        <input
          id="user"
          placeholder="Trần thuỷ"
          {...register("user", {
            required: "Nguời dùng là bắt buộc",
          })}
          className="mt-1 block w-full border border-regal-green rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
        />
        {errors.user && (
          <p className="text-sm text-red-500">{errors.user.message}</p>
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
