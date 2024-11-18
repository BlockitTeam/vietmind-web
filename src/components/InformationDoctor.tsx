import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCurrentUserDoctorHook } from "@/hooks/currentUser";
import { useLogoutHook } from "@/hooks/logout";
import { useResetPassword } from "@/hooks/user";
import { currentUserAtom } from "@/lib/jotai";
import { Button, Divider, Form, Input, notification, Tooltip } from "antd";
import { useAtom } from "jotai";
import { useState } from "react";
import { deleteCookie } from "cookies-next";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";

type FormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
export function InformationDoctor() {
  const { data: doctorData, isSuccess } = useCurrentUserDoctorHook();
  const [form] = Form.useForm();
  const [isDisplayChangePassword, setIsDisplayChangePassword] = useState(false);
  const resetPassword = useResetPassword();
  const useLogout = useLogoutHook();
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const router = useRouter();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="cursor-pointer m-2 hover:bg-gray-200">
          Thông tin tài khoản
        </span>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[725px]"
        popover="auto"
        onCloseAutoFocus={() => {
          setIsDisplayChangePassword(false);
          form.resetFields();
        }}
      >
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
        {isDisplayChangePassword && (
          <Form<FormValues>
            form={form}
            layout="vertical"
            onFinish={(values) => {
              console.log(values);
              type BodyType = Pick<FormValues, "currentPassword" | "newPassword">;
              const body: BodyType = values;
              resetPassword.mutate(body, {
                onSuccess: () => {
                  setIsDisplayChangePassword(false);
                  form.resetFields();
                  useLogout.mutate(undefined, {
                    onSuccess(data, variables, context) {
                      if (data.statusCode === 200) {
                        setCurrentUser(null);
                        Cookies.remove('JSESSIONID');
                        deleteCookie("JSESSIONID", {
                          path: "/",
                          domain: "http://91.108.104.57",
                        });
                        // Remove the cookie
                        // Redirect to the home page or any other page
                        router.push("/");
                        notification.success({
                          message: 'Đổi mật khẩu thành công',
                        })

                      } else {
                        console.error("Logout failed");
                      }
                    },
                    onError: (error) => {
                      console.error("An error occurred:", error);
                    },
                  });
                },
              })
            }}
          >
            <Form.Item
              name="currentPassword"
              label="Mật khẩu hiện tại"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu hiện tại" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
              ]}
            >
              <Input placeholder="Mật khẩu hiện tại" type="password" />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              rules={[
                { required: true, message: "Mật khẩu mới là bắt buộc" },
                { min: 6, message: "Mật khẩu mới phải có ít nhất 6 ký tự" },
              ]}
            >
              <Input placeholder="Mật khẩu mới" type="password" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Nhập lại mật khẩu mới"
              dependencies={["newPassword"]}
              rules={[
                {
                  required: true,
                  message: "Xác nhận mật khẩu mới là bắt buộc",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu xác nhận không khớp")
                    );
                  },
                }),
              ]}
            >
              <Input placeholder="Nhập lại mật khẩu mới" type="password" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-[200px] bg-regal-green hover:bg-regal-green text-black"
              >
                Lưu
              </Button>
            </Form.Item>
          </Form>
        )}

        {!isDisplayChangePassword && (
          <Button
            className="w-[200px] bg-regal-green hover:bg-regal-green text-black"
            onClick={() => setIsDisplayChangePassword(true)}
          >
            Thay đổi mật khẩu
          </Button>
        )}

        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
