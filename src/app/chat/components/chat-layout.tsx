"use client";
import React, { useEffect, useState } from "react";
import { userData } from "../data";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, PlusCircleIcon, Search } from "lucide-react";
import { Chat } from "@/app/chat/components/chat";
import { appointmentAtom } from "@/lib/jotai";
import { useAtom } from "jotai";
import { IconArrowLeft } from "@tabler/icons-react";
import { Form, useForm } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EndChat } from "./chat-modal-end";
interface ChatLayoutProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}
export function ChatLayout({
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
}: ChatLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [selectedUser, setSelectedUser] = React.useState(userData[0]);
  const [isMobile, setIsMobile] = useState(false);
  const [tab, setTab] = React.useState("chat");
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
    console.log(data);
  };
  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(
          sizes
        )}`;
      }}
      className="h-full items-stretch"
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        collapsedSize={navCollapsedSize}
        collapsible={true}
        minSize={15}
        maxSize={20}
        onCollapse={(collapsed?: any) => {
          setIsCollapsed(collapsed);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            collapsed
          )}`;
        }}
        className={cn(
          isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out"
        )}
      >
        <div
          className={cn(
            "flex h-[56px] items-center justify-center",
            isCollapsed ? "h-[56px]" : "px-2"
          )}
        >
          <Tabs
            defaultValue={tab}
            value={tab}
            onValueChange={(value) => setTab(value)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat" className="focus:border-b-regal-green">
                Đang chat
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="focus:border-b-regal-green"
              >
                Lịch sử
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <Separator />
        <div className="w-full">
          <div className="m-2">
            <div className="relative ">
              <Input
                className="pr-9 border-regal-green"
                placeholder="Tìm tên"
              />
              <Search className="absolute right-0 top-0 m-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="m-2 mt-6">
            {tab === "chat" && (
              <>
                <div className="flex items-center mt-3 justify-between">
                  <div className="flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      className="border-regal-green bg-regal-green w-[40px] h-[40px]"
                    >
                      VT
                    </Button>
                    <div className="cursor-pointer">
                      <p className="text-sm text-neutral-primary">Việt Trinh</p>
                      <p className="text-sm text-neutral-ternary">
                        Bắt đầu kết nối
                      </p>
                    </div>
                  </div>
                  <div className="items-center">
                    <p className="text-sm text-neutral-ternary">08/12</p>
                    <p></p>
                  </div>
                </div>
                <div className="flex items-center mt-3 justify-between">
                  <div className="flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      className="border-regal-green bg-regal-green w-[40px] h-[40px]"
                    >
                      HH
                    </Button>
                    <div className="cursor-pointer">
                      <p className="text-sm text-neutral-primary">Huy Hoang</p>
                      <p className="text-sm text-neutral-ternary">
                        Cháu bị lo âu
                      </p>
                    </div>
                  </div>
                  <div className="items-center justify-end">
                    <p className="text-sm text-neutral-ternary">08/12</p>
                    <p className="text-sm text-neutral-ternary h-[25px] w-[25px] rounded-full bg-regal-green border-regal-green border-2 text-center">
                      2
                    </p>
                    <p></p>
                  </div>
                </div>
                <div className="flex items-center mt-3 justify-between">
                  <div className="flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      className="border-regal-green bg-regal-green w-[40px] h-[40px]"
                    >
                      TTL
                    </Button>
                    <div className="cursor-pointer">
                      <p className="text-sm text-neutral-primary">
                        Trần Thuỳ Linh
                      </p>
                      <p className="text-sm text-neutral-ternary">
                        Cháu bị trầm cảm
                      </p>
                    </div>
                  </div>
                  <div className="items-center justify-end">
                    <p className="text-sm text-neutral-ternary">08/12</p>
                    <p className="text-sm text-neutral-ternary h-[25px] w-[25px] rounded-full bg-regal-green border-regal-green border-2 text-center">
                      3
                    </p>
                    <p></p>
                  </div>
                </div>
              </>
            )}

            {tab === "history" && (
              <>
                <div className="flex items-center mt-3 justify-between">
                  <div className="flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      className="border-regal-green bg-regal-green w-[40px] h-[40px]"
                    >
                      VT
                    </Button>
                    <div className="cursor-pointer">
                      <p className="text-sm text-neutral-primary">Việt Trinh</p>
                      <p className="text-sm text-neutral-ternary">
                        Đã kết thúc
                      </p>
                    </div>
                  </div>
                  <div className="items-center">
                    <p className="text-sm text-neutral-ternary">08/12</p>
                    <p></p>
                  </div>
                </div>
                <div className="flex items-center mt-3 justify-between">
                  <div className="flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      className="border-regal-green bg-regal-green w-[40px] h-[40px]"
                    >
                      HH
                    </Button>
                    <div className="cursor-pointer">
                      <p className="text-sm text-neutral-primary">Huy Hoang</p>
                      <p className="text-sm text-neutral-ternary">
                        Đã kết thúc
                      </p>
                    </div>
                  </div>
                  <div className="items-center justify-end">
                    <p className="text-sm text-neutral-ternary">08/12</p>
                    <p></p>
                  </div>
                </div>
                <div className="flex items-center mt-3 justify-between">
                  <div className="flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      className="border-regal-green bg-regal-green w-[40px] h-[40px]"
                    >
                      TTL
                    </Button>
                    <div className="cursor-pointer">
                      <p className="text-sm text-neutral-primary">
                        Trần Thuỳ Linh
                      </p>
                      <p className="text-sm text-neutral-ternary">
                        Đã kết thúc
                      </p>
                    </div>
                  </div>
                  <div className="items-center justify-end">
                    <p className="text-sm text-neutral-ternary">08/12</p>
                  </div>
                </div>
                <div className="flex items-center mt-3 justify-between">
                  <div className="flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      className="border-regal-green bg-regal-green w-[40px] h-[40px]"
                    >
                      TTL
                    </Button>
                    <div className="cursor-pointer">
                      <p className="text-sm text-neutral-primary">Nhã Trang</p>
                      <p className="text-sm text-neutral-ternary">
                        Đã kết thúc
                      </p>
                    </div>
                  </div>
                  <div className="items-center justify-end">
                    <p className="text-sm text-neutral-ternary">08/12</p>
                  </div>
                </div>
                <div className="flex items-center mt-3 justify-between">
                  <div className="flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      className="border-regal-green bg-regal-green w-[40px] h-[40px]"
                    >
                      TTL
                    </Button>
                    <div className="cursor-pointer">
                      <p className="text-sm text-neutral-primary">Nhã Trang</p>
                      <p className="text-sm text-neutral-ternary">
                        Đã kết thúc
                      </p>
                    </div>
                  </div>
                  <div className="items-center justify-end">
                    <p className="text-sm text-neutral-ternary">08/12</p>
                  </div>
                </div>
                <div className="flex items-center mt-3 justify-between">
                  <div className="flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      className="border-regal-green bg-regal-green w-[40px] h-[40px]"
                    >
                      TTL
                    </Button>
                    <div className="cursor-pointer">
                      <p className="text-sm text-neutral-primary">Nhã Trang</p>
                      <p className="text-sm text-neutral-ternary">
                        Đã kết thúc
                      </p>
                    </div>
                  </div>
                  <div className="items-center justify-end">
                    <p className="text-sm text-neutral-ternary">08/12</p>
                  </div>
                </div>
                <div className="flex items-center mt-3 justify-between">
                  <div className="flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      className="border-regal-green bg-regal-green w-[40px] h-[40px]"
                    >
                      TTL
                    </Button>
                    <div className="cursor-pointer">
                      <p className="text-sm text-neutral-primary">Nhã Trang</p>
                      <p className="text-sm text-neutral-ternary">
                        Đã kết thúc
                      </p>
                    </div>
                  </div>
                  <div className="items-center justify-end">
                    <p className="text-sm text-neutral-ternary">08/12</p>
                  </div>
                </div>
                <div className="flex items-center mt-3 justify-between">
                  <div className="flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      className="border-regal-green bg-regal-green w-[40px] h-[40px]"
                    >
                      TTL
                    </Button>
                    <div className="cursor-pointer">
                      <p className="text-sm text-neutral-primary">Nhã Trang</p>
                      <p className="text-sm text-neutral-ternary">
                        Đã kết thúc
                      </p>
                    </div>
                  </div>
                  <div className="items-center justify-end">
                    <p className="text-sm text-neutral-ternary">08/12</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[1]}>
        <div
          className={cn(
            "flex h-[56px] items-center justify-between",
            isCollapsed ? "h-[56px]" : "px-2"
          )}
        >
          <div className="flex items-center gap-2">
            <Button className="text-neutral-primary border-regal-green bg-regal-green w-[45px] h-[45px] hover:bg-regal-green">
              VT
            </Button>
            <p className="text-md font-bold text-neutral-primary">Việt Trinh</p>
          </div>
          <div>
            <EndChat />
          </div>
        </div>
        <Separator />
        <Chat
          messages={selectedUser.messages}
          selectedUser={selectedUser}
          isMobile={isMobile}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[2]}>
        <div
          className={cn(
            "flex h-[56px] items-center ",
            isCollapsed ? "h-[56px]" : "px-2",
            !appointment ? "justify-start" : "justify-center"
          )}
        >
          {!appointment ? (
            <Button
              className="text-neutral-primary border-regal-green bg-regal-green hover:bg-regal-green h-[30px] w-full"
              onClick={() => setAppointment(true)}
            >
              Đặt lịch hẹn
              <Calendar className="ml-2" size={20} />
            </Button>
          ) : (
            <div
              className="font-bold flex items-center w-full cursor-pointer"
              onClick={() => setAppointment(false)}
            >
              <IconArrowLeft size={20} className="mr-2" /> Quay lại
            </div>
          )}
        </div>
        <Separator />
        <div className="w-full h-full">
          {!appointment && (
            <ScrollArea className="w-full h-full">
              <div className="m-4">
                <p className="font-bold text-md mb-4">Thông tin người dùng</p>
                <div className="flex gap-2 flex-col">
                  <div className="flex gap-4">
                    <p className="text-neutral-ternary text-sm">Ngày sinh</p>
                    <p className="text-neutral-primary text-sm font-bold">
                      20/06/2000
                    </p>
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
                  <a className="font-bold text-md mb-4 underline">
                    Xem chi tiết
                  </a>
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
                    <p className="text-neutral-primary text-md font-bold">
                      17/06/2023
                    </p>
                    <ul className="list-disc ml-4">
                      <li>Stress nhẹ do áp lực công việc quá nhiều. </li>
                      <li>
                        Hiện tại đang ở một mình, không có người thân bên cạnh{" "}
                      </li>
                      <li>Khó ngủ, giờ ngủ không cố định </li>
                    </ul>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-neutral-primary text-md font-bold">
                      17/06/2023
                    </p>
                    <ul className="list-disc ml-4">
                      <li>Stress nhẹ do áp lực công việc quá nhiều. </li>
                      <li>
                        Hiện tại đang ở một mình, không có người thân bên cạnh{" "}
                      </li>
                      <li>Khó ngủ, giờ ngủ không cố định </li>
                    </ul>
                  </div>
                  <Button
                    variant={"outline"}
                    className="border-regal-green mt-4"
                  >
                    {" "}
                    <PlusCircleIcon size={15} className="mr-2" /> Thêm ghi chú
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}

          {appointment && (
            <div className="m-4">
              <p className="font-bold text-2xl">Đặt lịch hẹn</p>
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
                    <p className="text-sm text-red-500">
                      {errors.date.message}
                    </p>
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
                      <p className="text-sm text-red-500">
                        {errors.from.message}
                      </p>
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
                      <p className="text-sm text-red-500">
                        {errors.to.message}
                      </p>
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
                    <p className="text-sm text-red-500">
                      {errors.notes.message}
                    </p>
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
                    <p className="text-sm text-red-500">
                      {errors.user.message}
                    </p>
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
            </div>
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
