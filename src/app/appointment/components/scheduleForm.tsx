import React, { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { TimePicker, Button, Space, message, Flex } from "antd";
import dayjs from "dayjs";
import { useScheduleAppointment } from "@/hooks/appointment";

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

const ScheduleForm: React.FC<{
  visible: boolean;
  scheduleAppointment: any;
}> = ({ visible, scheduleAppointment }) => {
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      shifts: daysOfWeek.flatMap((_, index) => [
        { dayOfWeek: index + 1, shiftNumber: 1, startTime: "", endTime: "" },
      ]),
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "shifts" });
  const executeScheduleAppointment = useScheduleAppointment();

  // Set data from the passed scheduleAppointment
  useEffect(() => {
    if (visible && scheduleAppointment) {
      const formData = scheduleAppointment.map((item: Shift) => ({
        dayOfWeek: item.dayOfWeek,
        shiftNumber: item.shiftNumber,
        startTime: item.startTime.substring(0, 5),
        endTime: item.endTime.substring(0, 5),
      }));

      // Ensure each day has at least one shift (shift 1 by default)
      const updatedShifts = daysOfWeek.flatMap((_, index) => {
        const dayShifts = formData.filter(
          (shift: Shift) => shift.dayOfWeek === index + 1
        );
        return dayShifts.length > 0
          ? dayShifts
          : [
              {
                dayOfWeek: index + 1,
                shiftNumber: 1,
                startTime: "",
                endTime: "",
              },
            ];
      });

      reset({ shifts: updatedShifts });
    }
  }, [visible, scheduleAppointment, reset]);

  const validateShifts = (data: FormValues) => {
    let isValid = true;

    data.shifts.forEach((shift, index) => {
      const startTime = dayjs(shift.startTime, "HH:mm");
      const endTime = dayjs(shift.endTime, "HH:mm");

      if (!startTime.isValid() || !endTime.isValid()) {
        // Skip if time is not set
        return;
      }

      // Check if endTime is before startTime
      if (endTime.isBefore(startTime)) {
        setError(`shifts.${index}.endTime`, {
          message: "Thời gian kết thúc phải sau thời gian bắt đầu",
        });
        isValid = false;
        return;
      } else {
        clearErrors(`shifts.${index}.endTime`);
      }

      // Check if startTime is after endTime
      if (startTime.isAfter(endTime)) {
        setError(`shifts.${index}.startTime`, {
          message: "Thời gian bắt đầu phải trước thời gian kết thúc",
        });
        isValid = false;
        return;
      } else {
        clearErrors(`shifts.${index}.startTime`);
      }

      // Ensure shifts do not overlap within the same day
      const sameDayShifts = data.shifts.filter(
        (s) => s.dayOfWeek === shift.dayOfWeek
      );
      if (
        sameDayShifts.length === 2 &&
        ((shift.shiftNumber === 1 &&
          startTime.isAfter(dayjs(sameDayShifts[1].startTime))) ||
          (shift.shiftNumber === 2 &&
            endTime.isBefore(dayjs(sameDayShifts[0].endTime))))
      ) {
        setError(`shifts.${index}.startTime`, { message: "Shifts overlap" });
        isValid = false;
      }
    });

    return isValid;
  };

  const onSubmit = (data: FormValues) => {
    if (!validateShifts(data)) {
      return;
    }

    const cleanedShifts = data.shifts.filter(
      (shift) => shift.startTime && shift.endTime
    );
    executeScheduleAppointment.mutate(cleanedShifts, {
      onSuccess: () => message.success("Lịch làm việc đã được đặt thành công!"),
      onError: () => message.error("Có lỗi xảy ra."),
    });
  };

  const removeSecondShift = (dayOfWeek: number) => {
    const secondShiftIndex = fields.findIndex(
      (field) => field.dayOfWeek === dayOfWeek && field.shiftNumber === 2
    );
    if (secondShiftIndex !== -1) remove(secondShiftIndex);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-6">
      {daysOfWeek.map((day, index) => (
        <div key={index} className="mb-4">
          <Flex align="center" justify="start" className="pb-3 border-b-[1px]">
            <div className="w-[100px]">
              <h3>{day}</h3>
            </div>
            <Flex justify="center" vertical gap={8} className="mr-3">
              {fields
                .filter((field) => {
                  return field.dayOfWeek === index + 1;
                })
                .sort((a, b) => a.shiftNumber - b.shiftNumber)
                .map((field, fieldIndex) => (
                  <Space key={field.id} direction="vertical" align="start">
                    <Space key={field.id} align="center">
                      <Controller
                        control={control}
                        name={`shifts.${fields.findIndex(
                          (f) => f.id === field.id
                        )}.startTime`}
                        render={({ field }) => (
                          <TimePicker
                            {...field}
                            format="HH:mm"
                            minuteStep={30}
                            value={
                              field.value ? dayjs(field.value, "HH:mm") : null
                            }
                            onChange={(time, timeString) =>
                              field.onChange(timeString)
                            }
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name={`shifts.${fields.findIndex(
                          (f) => f.id === field.id
                        )}.endTime`}
                        render={({ field }) => (
                          <TimePicker
                            {...field}
                            format="HH:mm"
                            minuteStep={30}
                            value={
                              field.value ? dayjs(field.value, "HH:mm") : null
                            }
                            onChange={(time, timeString) =>
                              field.onChange(timeString)
                            }
                          />
                        )}
                      />
                      {field.shiftNumber === 2 && (
                        <Button
                          type="dashed"
                          danger
                          onClick={() => removeSecondShift(index + 1)}
                        >
                          Xóa
                        </Button>
                      )}
                    </Space>
                    {/* Display errors for start and end times */}
                    <div style={{ color: "red" }}>
                      {
                        errors?.shifts?.[
                          fields.findIndex((f) => f.id === field.id)
                        ]?.startTime?.message
                      }
                      {
                        errors?.shifts?.[
                          fields.findIndex((f) => f.id === field.id)
                        ]?.endTime?.message
                      }
                    </div>
                  </Space>
                ))}
            </Flex>
            {fields.filter((field) => field.dayOfWeek === index + 1).length <
              2 && (
              <Button
                type="primary"
                onClick={() =>
                  append({
                    dayOfWeek: index + 1,
                    shiftNumber: 2,
                    startTime: "",
                    endTime: "",
                  })
                }
              >
                Thêm ca thứ 2
              </Button>
            )}
          </Flex>
        </div>
      ))}
      <Button type="primary" htmlType="submit" className="mt-4">
        Đặt lịch làm việc
      </Button>
    </form>
  );
};

export default ScheduleForm;
