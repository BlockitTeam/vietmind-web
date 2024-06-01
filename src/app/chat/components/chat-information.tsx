import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import { useAtom } from "jotai";
import { appointmentDetailAtom } from "@/lib/jotai";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function ChatInformation() {
  const [appointmentDetail, setAppointmentDetail] = useAtom(
    appointmentDetailAtom
  );
  return (
    <div className="m-4">
      {appointmentDetail.status !== null && (
        <>
          <Card className="bg-regal-green-light mb-3">
            <CardContent className="flex gap-3 flex-col p-2">
              <p className="bg-neutral-ternary text-white w-fit rounded-md text-xs p-1">
                Đang đợi xác nhận
              </p>

              <p className="font-bold text-sm">Lịch hẹn : Trần Thuỷ</p>
              <p className="text-sm text-neutral-secondary">
                10/12/2023 09:00 - 10:00
              </p>

              <p className="text-sm text-neutral-secondary">
                Ghi chú: Buổi tư vấn thứ 2
              </p>
            </CardContent>
            <CardFooter className="grid grid-flow-col gap-3 p-2 items-center justify-stretch w-full">
              <Button variant="outline" className="border-regal-green">
                Dời lịch hẹn
              </Button>
              <Button variant="outline" className="border-regal-green">
                Huỷ lịch hẹn
              </Button>
            </CardFooter>
          </Card>
          <Separator />
        </>
      )}

      <div className="m-4">
        <p className="font-bold text-md mb-4">Thông tin người dùng</p>
        <div className="flex gap-2 flex-col">
          <div className="flex gap-4">
            <p className="text-neutral-ternary text-sm">Ngày sinh</p>
            <p className="text-neutral-primary text-sm font-bold">20/06/2000</p>
          </div>
          <div className="flex gap-4">
            <p className="text-neutral-ternary text-sm">Tuổi</p>
            <p className="text-neutral-primary text-sm font-bold">23</p>
          </div>
          <div className="flex gap-4">
            <p className="text-neutral-ternary text-sm">Giới tính</p>
            <p className="text-neutral-primary text-sm font-bold">Nữ</p>
          </div>
        </div>
      </div>
      <Separator />
      <div className="m-4">
        <div className="flex justify-between items-center cursor-pointer">
          <p className="font-bold text-md mb-4">Kết quả sàng lọc</p>
          <a className="font-bold text-md mb-4 underline">Xem chi tiết</a>
        </div>
        <div className="flex gap-2 flex-col">
          <div className="flex gap-4">
            <p className="text-neutral-ternary text-sm">Stress:</p>
            <p className="text-neutral-primary text-sm">5/10</p>
          </div>
          <div className="flex gap-4">
            <p className="text-neutral-ternary text-sm">Lo âu:</p>
            <p className="text-neutral-primary text-sm">6/10</p>
          </div>
          <div className="flex gap-4">
            <p className="text-neutral-ternary text-sm">Trầm cảm:</p>
            <p className="text-neutral-primary text-sm ">7/10</p>
          </div>
          <div className="flex gap-4">
            <p className="text-neutral-ternary text-sm">Tự hại:</p>
            <p className="text-neutral-primary text-sm ">2/10</p>
          </div>
        </div>
      </div>
      <Separator />
      <div className="m-4">
        <div className="flex justify-between items-center cursor-pointer">
          <p className="font-bold text-md mb-4">Ghi chú</p>
          {/* <a className="font-bold text-md mb-4 underline">Xem chi tiết</a> */}
        </div>
        <div className="flex gap-4 flex-col">
          <div className="flex flex-col gap-2">
            <p className="text-neutral-primary text-md font-bold">17/06/2023</p>
            <ul className="list-disc ml-4">
              <li>Stress nhẹ do áp lực công việc quá nhiều. </li>
              <li>Hiện tại đang ở một mình, không có người thân bên cạnh </li>
              <li>Khó ngủ, giờ ngủ không cố định </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-neutral-primary text-md font-bold">17/06/2023</p>
            <ul className="list-disc ml-4">
              <li>Stress nhẹ do áp lực công việc quá nhiều. </li>
              <li>Hiện tại đang ở một mình, không có người thân bên cạnh </li>
              <li>Khó ngủ, giờ ngủ không cố định </li>
            </ul>
          </div>
          <Button variant={"outline"} className="border-regal-green mt-4">
            <PlusCircleIcon size={15} className="mr-2" /> Thêm ghi chú
          </Button>
        </div>
      </div>
    </div>
  );
}
