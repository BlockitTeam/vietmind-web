import React, { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { TimePicker, Button, Space, Row, Col, message, Flex } from "antd";
import dayjs from "dayjs";
import {
  useGetScheduleAppointment,
  useScheduleAppointment,
} from "@/hooks/appointment";

type Shift = {
  dayOfWeek: number;
  shiftNumber: number;
  startTime: string;
  endTime: string;
};

type FormValues = {
  shifts: Shift[];
};

const daysOfWeek = [
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
  "Chủ nhật",
];

const ScheduleForm: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
  const { control, handleSubmit, setError, clearErrors, formState, reset } =
    useForm<FormValues>({
      mode: "onChange",
      defaultValues: {
        shifts: daysOfWeek.flatMap((_, index) => [
          { dayOfWeek: index + 1, shiftNumber: 1, startTime: "", endTime: "" },
        ]),
      },
    });

  const { data: scheduleAppointment, isSuccess, refetch } = useGetScheduleAppointment();

  const convertDataToForm = (data: any[]) => {
    return data.map((item) => ({
      dayOfWeek: item.dayOfWeek,
      shiftNumber: item.shiftNumber,
      startTime: item.startTime.substring(0, 5), // Chỉ lấy phần giờ và phút
      endTime: item.endTime.substring(0, 5),
    }));
  };

  const resetWithFieldArray = (data: Shift[]) => {
    // Reset lại form ban đầu
    reset({
      shifts: daysOfWeek.flatMap((_, index) => [
        { dayOfWeek: index + 1, shiftNumber: 1, startTime: "", endTime: "" },
      ]),
    });

    // Xử lý các ca làm việc từ dữ liệu API
    data.forEach((shift) => {
      if (shift.shiftNumber === 2) {
        // Nếu là ca 2, append vào ngày tương ứng
        append(shift);
      } else {
        // Nếu là ca 1, reset vào form chính
        reset((prevState) => ({
          shifts: prevState.shifts.map((s) =>
            s.dayOfWeek === shift.dayOfWeek && s.shiftNumber === 1
              ? { ...shift }
              : s
          ),
        }));
      }
    });
  };
  useEffect(() => {
    if (visible) {
      // Khi Sheet mở, refetch lại dữ liệu
      refetch();
    }
  }, [visible, refetch]);
  

  useEffect(() => {
    if (isSuccess && scheduleAppointment?.data) {
      const formData = convertDataToForm(scheduleAppointment.data);
  
      // Debugging: Log the form data to ensure second shifts are being processed
      console.log("Resetting form with data:", formData);
  
      // Lặp qua các ngày trong tuần và đảm bảo rằng mỗi ngày có tối đa 2 ca
      const updatedShifts = daysOfWeek.flatMap((_, dayIndex) => {
        const dayShifts = formData.filter((shift) => shift.dayOfWeek === dayIndex + 1);
  
        // Nếu chưa có ca nào, thêm ca mặc định cho ngày đó
        if (dayShifts.length === 0) {
          return [{ dayOfWeek: dayIndex + 1, shiftNumber: 1, startTime: "", endTime: "" }];
        }
  
        // Trả về các ca làm việc cho ngày đó (1 hoặc 2 ca)
        return dayShifts;
      });
  
      // Log updated shifts to verify if second shifts exist
      console.log("Updated shifts:", updatedShifts);
  
      // Reset lại form với dữ liệu mới
      reset({ shifts: updatedShifts });
    }
  }, [scheduleAppointment, isSuccess, reset]);

  const executeScheduleAppointment = useScheduleAppointment();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "shifts",
  });

  const validateShifts = (data: FormValues) => {
    const errors = [];

    // Kiểm tra giờ kết thúc phải lớn hơn giờ bắt đầu
    data.shifts.forEach((shift, index) => {
      const startTime = dayjs(shift.startTime, "HH:mm");
      const endTime = dayjs(shift.endTime, "HH:mm");

      if (endTime.isBefore(startTime)) {
        errors.push(
          `Giờ kết thúc phải lớn hơn giờ bắt đầu cho ngày ${shift.dayOfWeek}, ca ${shift.shiftNumber}`
        );
        setError(`shifts.${index}.endTime`, {
          type: "manual",
          message: "Giờ kết thúc phải lớn hơn giờ bắt đầu",
        });
      } else {
        clearErrors(`shifts.${index}.endTime`);
      }
    });

    // Kiểm tra 2 ca làm việc trong cùng một ngày không được trùng giờ
    daysOfWeek.forEach((_, dayIndex) => {
      const shiftsInDay = data.shifts.filter(
        (shift) => shift.dayOfWeek === dayIndex + 1
      );
      if (shiftsInDay.length === 2) {
        const [shift1, shift2] = shiftsInDay;
        const startTime1 = dayjs(shift1.startTime, "HH:mm");
        const endTime1 = dayjs(shift1.endTime, "HH:mm");
        const startTime2 = dayjs(shift2.startTime, "HH:mm");
        const endTime2 = dayjs(shift2.endTime, "HH:mm");

        if (
          (startTime1.isSame(startTime2) && endTime1.isSame(endTime2)) || // Giờ cả hai ca trùng nhau
          (startTime1.isBefore(endTime2) && startTime2.isBefore(endTime1)) // Giờ của hai ca chồng lên nhau
        ) {
          errors.push(
            `Giờ làm việc của 2 ca trong ngày ${shift1.dayOfWeek} không được trùng nhau`
          );
          setError(
            `shifts.${data.shifts.findIndex(
              (shift) =>
                shift.dayOfWeek === shift2.dayOfWeek &&
                shift.shiftNumber === shift2.shiftNumber
            )}.startTime`,
            {
              type: "manual",
              message: "Giờ làm việc của 2 ca không được trùng nhau",
            }
          );
        }
      }
    });

    return errors.length === 0;
  };

  const onSubmit = (data: FormValues) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
    if (formState.isValid) {
      executeScheduleAppointment.mutate([...data.shifts], {
        onSuccess(data, variables, context) {
          message.success("Lịch làm việc đã được đặt thành công!");
        },
        onError(error, variables, context) {
          message.error("Có lỗi xảy ra. Vui lòng kiểm tra lại lịch làm việc.");
        },
      });
    } else {
      message.error("Có lỗi xảy ra. Vui lòng kiểm tra lại lịch làm việc.");
    }
  };

  const removeSecondShift = (dayOfWeek: number) => {
    const indexToRemove = fields.findIndex(
      (field) => field.dayOfWeek === dayOfWeek && field.shiftNumber === 2
    );
    if (indexToRemove !== -1) {
      remove(indexToRemove);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-7">
      {daysOfWeek.map((day, dayIndex) => (
        <div key={dayIndex} style={{ marginBottom: "20px" }}>
          <Flex align="center" justify="space-between">
            <div className="w-[70px]">
              <h3>{day}</h3>
            </div>
            <Flex  justify="center" vertical gap={8}>
              {fields
                .filter((field) => field.dayOfWeek === dayIndex + 1)
                .map((field, index) => (
                  <Space
                    key={field.id}
                    align="center"
                    className="flex gap-2"
                  >
                    <Controller
                      name={`shifts.${fields.findIndex(
                        (f) => f.id === field.id
                      )}.startTime`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <TimePicker
                            required
                            {...field}
                            placeholder="Giờ bắt đầu"
                            format="HH:mm"
                            value={
                              field.value ? dayjs(field.value, "HH:mm") : null
                            }
                            onChange={(time, timeString) =>
                              field.onChange(timeString)
                            }
                          />
                          {fieldState.error && (
                            <p style={{ color: "red" }}>
                              {fieldState.error.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                    <Controller
                      name={`shifts.${fields.findIndex(
                        (f) => f.id === field.id
                      )}.endTime`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <TimePicker
                            required
                            {...field}
                            placeholder="Giờ kết thúc"
                            format="HH:mm"
                            value={
                              field.value ? dayjs(field.value, "HH:mm") : null
                            }
                            onChange={(time, timeString) =>
                              field.onChange(timeString)
                            }
                          />
                          {fieldState.error && (
                            <p style={{ color: "red" }}>
                              {fieldState.error.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                    {field.shiftNumber === 2 && (
                      <Button onClick={() => removeSecondShift(dayIndex + 1)}>
                        Xóa
                      </Button>
                    )}
                  </Space>
                ))}
            </Flex>
            <div>
              {fields.filter((field) => field.dayOfWeek === dayIndex + 1)
                .length < 2 && (
                <Button
                  type="dashed"
                  onClick={() =>
                    append({
                      dayOfWeek: dayIndex + 1,
                      shiftNumber: 2,
                      startTime: "",
                      endTime: "",
                    })
                  }
                >
                  Thêm ca thứ 2
                </Button>
              )}
            </div>
          </Flex>
        </div>
      ))}
      <div className="mt-6">
        <Button
          type="primary"
          htmlType="submit"
          style={{ marginRight: "10px" }}
          className="bg-regal-green text-black"
          disabled={!formState.isValid}
        >
          Đặt lịch làm việc
        </Button>
      </div>
    </form>
  );
};

export default ScheduleForm;
