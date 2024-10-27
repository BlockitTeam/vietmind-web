import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCurrentUserDoctorHook } from "@/hooks/currentUser";
import { Divider, Tooltip } from "antd";
export function InformationDoctor() {
  const { data: doctorData, isSuccess } = useCurrentUserDoctorHook();
  console.log("🚀 ~ InformationDoctor ~ doctorData:", doctorData);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="cursor-pointer m-2 hover:bg-gray-200">Thông tin tài khoản</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]" popover="auto">
        <DialogHeader>
          <DialogTitle className="text-xxl">Tài khoản</DialogTitle>
        </DialogHeader>
        {isSuccess && (
          <div className="w-full">
            <div className="flex flex-col gap-4 mt-3">
              <div className="flex">
                <span className="w-[150px]">Tên</span>
                <span className="font-bold">
                  {doctorData?.data?.lastName} {doctorData?.data?.firstName}
                </span>
              </div>
              <div className="flex">
                <span className="w-[150px]">Giới tính</span>
                <span className="font-bold">
                  {doctorData?.data?.gender === "FEMALE" ? "Nữ" : "Nam"}
                </span>
              </div>
              <div className="flex">
                <span className="w-[150px]">Nơi công tác</span>
                <span className="font-bold">{doctorData?.data?.workplace}</span>
              </div>
              <div className="flex">
                <span className="w-[150px]">Bằng cấp</span>
                <span className="font-bold">{doctorData?.data?.degree}</span>
              </div>
              <div className="flex">
                <span className="w-[150px]">Chuyên ngành</span>
                <span className="font-bold">
                  {doctorData?.data?.specializations}
                </span>
              </div>
            </div>
          </div>
        )}
        <Divider />

        <Button className="w-[200px] bg-regal-green hover:bg-regal-green" variant={"outline"} disabled>
          Thay đổi mật khẩu
        </Button>
        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
