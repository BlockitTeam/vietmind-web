"use client";
import React, { useEffect, useMemo, useState } from "react";
import { userData } from "../data";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Search } from "lucide-react";
import { Chat } from "@/app/chat/components/chat";
import {
  appointmentAtom,
  appointmentDetailAtom,
  conversationIdAtom,
  conversationIdContentAtom,
  currentUserAtom,
  senderFullNameAtom,
  userConversationIdAtom,
  userIdTargetUserAtom,
} from "@/lib/jotai";
import { useAtom } from "jotai";
import { IconArrowLeft } from "@tabler/icons-react";
import { Form, useForm } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EndChat } from "./chat-modal-end";
import { Appointment } from "./appointment";
import { ChatInformation } from "./chat-information";
import { useCurrentUserHook } from "@/hooks/currentUser";
import { useContentMessageHook } from "@/hooks/getContentMessage";
import { useGetConversation } from "@/hooks/conversation";
import CryptoJS from "crypto-js";
import { decryptMessageWithKeyAES } from "@/servers/message";
import { WebSocketProvider } from "./webSocketContext";
import { Conversation } from "./conversation";
import { displayAvatar } from "@/helper";

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
  const [isMobile, setIsMobile] = useState(false);
  const [tab, setTab] = React.useState("chat");

  // atom
  const [appointment, setAppointment] = useAtom(appointmentAtom);
  const [appointmentDetail, setAppointmentDetail] = useAtom(
    appointmentDetailAtom
  );
  const [senderFullName, setSenderFullName] = useAtom(senderFullNameAtom);
  const [conversationId, setConversationId] = useAtom(conversationIdAtom);

  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const { data: user, ...queryUser } = useCurrentUserHook();

  const { data: conversations, ...queryConversation } = useGetConversation();

  useEffect(() => {
    if (queryUser.isSuccess) {
      setCurrentUser(user?.data);
    }
  }, [user]);

  return (
    queryUser.isSuccess && (
      <WebSocketProvider>
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
            collapsible={false}
            minSize={15}
            maxSize={20}
            onCollapse={(collapsed?: any) => {
              setIsCollapsed(collapsed);
              document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                collapsed
              )}`;
            }}
            className={cn(
              isCollapsed &&
                "min-w-[50px] transition-all duration-300 ease-in-out"
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
                  <TabsTrigger
                    value="chat"
                    className="focus:border-b-regal-green"
                  >
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
                {tab === "chat" && <Conversation />}

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
                          <p className="text-sm text-neutral-primary">
                            Việt Trinh
                          </p>
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
                          <p className="text-sm text-neutral-primary">
                            Huy Hoang
                          </p>
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
                          <p className="text-sm text-neutral-primary">
                            Nhã Trang
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
                          <p className="text-sm text-neutral-primary">
                            Nhã Trang
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
                          <p className="text-sm text-neutral-primary">
                            Nhã Trang
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
                          <p className="text-sm text-neutral-primary">
                            Nhã Trang
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
                          <p className="text-sm text-neutral-primary">
                            Nhã Trang
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
                  </>
                )}
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={defaultLayout[1]} collapsible={false}>
            {conversationId > 0 && (
              <>
                <div
                  className={cn(
                    "flex h-[56px] items-center justify-between",
                    isCollapsed ? "h-[56px]" : "px-2"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Button className="text-neutral-primary border-regal-green bg-regal-green w-[45px] h-[45px] hover:bg-regal-green">
                      {senderFullName && displayAvatar(senderFullName)}
                    </Button>
                    <p className="text-md font-bold text-neutral-primary">
                      {senderFullName && senderFullName}
                    </p>
                  </div>
                  <div>
                    <EndChat />
                  </div>
                </div>
                <Separator />
                <Chat
                  isMobile={isMobile}
                  refetchConversation={queryConversation.refetch}
                />
              </>
            )}
            {!conversationId && (
              <div className="flex flex-col align-middle items-center h-full justify-center">
                <Image
                  src="/NoData.png"
                  width={500}
                  height={500}
                  alt="Picture of the author"
                />
                <p>Hãy chọn người bệnh nhận để trò chuyện</p>
              </div>
            )}
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            defaultSize={defaultLayout[2]}
            collapsible={false}
            minSize={30}
            maxSize={35}
          >
            {conversationId > 0 && (
              <>
                <div
                  className={cn(
                    "flex h-[56px] items-center",
                    isCollapsed ? "h-[56px]" : "px-2",
                    !appointment ? "justify-start" : "justify-center"
                  )}
                >
                  {!appointment ? (
                    <Button
                      className="text-neutral-primary border-regal-green bg-regal-green hover:bg-regal-green h-[30px] w-full"
                      onClick={() => setAppointment(true)}
                      disabled={
                        appointmentDetail.status &&
                        appointmentDetail.status !== null &&
                        appointmentDetail.status !== "CANCELLED"
                          ? true
                          : false
                      }
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

                <ScrollArea className="w-full h-full">
                  {!appointment && <ChatInformation />}

                  {appointment && (
                    <div className="m-4">
                      <p className="font-bold text-2xl">Đặt lịch hẹn</p>
                      <Appointment />
                    </div>
                  )}
                </ScrollArea>
              </>
            )}

            {!conversationId && (
              <div className="flex flex-col align-middle items-center h-full justify-center">
                <Image
                  src="/NoData.png"
                  width={500}
                  height={500}
                  alt="Picture of the author"
                />
                <p>Hãy chọn người bệnh nhận để trò chuyện</p>
              </div>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </WebSocketProvider>
    )
  );
}
