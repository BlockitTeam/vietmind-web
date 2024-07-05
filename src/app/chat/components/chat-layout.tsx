"use client";
import React, { useEffect, useMemo, useState } from "react";
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
import { Calendar, Search } from "lucide-react";
import { Chat } from "@/app/chat/components/chat";
import { appointmentAtom, appointmentDetailAtom, conversationIdAtom, conversationIdContentAtom, currentUserAtom, userIdTargetUserAtom } from "@/lib/jotai";
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
  const [appointment, setAppointment] = useAtom(appointmentAtom);
  const [appointmentDetail, setAppointmentDetail] = useAtom(appointmentDetailAtom);

  const [senderFullName, setSenderFullName] = useState('');
  const [conversationId, setConversationId] = useAtom(conversationIdAtom);
  const [conversationIdContent, setConversationIdContentAtom] = useAtom(conversationIdContentAtom);
  const [userIdTargetUser, setUserIdTargetUser] = useAtom(userIdTargetUserAtom);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

  const { data: user, ...queryUser } = useCurrentUserHook();
  const { data: contentConversationId, ...queryConversationId } = useContentMessageHook(conversationId);
  const { data: conversations, ...queryConversation } = useGetConversation();

  useEffect(() => {
    if (queryUser.isSuccess) {
      setCurrentUser(user?.data);
    }
  }, [user]);

  useEffect(() => {
    if (queryConversationId.isSuccess) {
      setConversationIdContentAtom(contentConversationId?.data);
    }
  }, [contentConversationId]);

  useEffect(() => {
    if (conversationId > 0) {
      queryConversationId.refetch();
    }
  }, [conversationId]);

  return (
    queryUser.isSuccess && (
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
              {tab === "chat" && (
                <>
                  {queryConversation.isSuccess && conversations?.data && Array.isArray(conversations?.data) &&
                    conversations?.data.map(
                      (conversation: any, index: number) => {
                        return (
                          <div
                            className="flex items-center mt-3 justify-between"
                            key={index}
                            onClick={() => {
                              setSenderFullName(conversation?.senderFullName);
                              setConversationId(conversation?.conversation?.conversationId)
                              setUserIdTargetUser(conversation?.conversation?.userId)
                            }}
                          >
                            <div className="flex justify-center items-center gap-2">
                              <Button
                                variant="outline"
                                className="border-regal-green bg-regal-green w-[40px] h-[40px]"
                              >
                                NT
                              </Button>
                              <div className="cursor-pointer">
                                <p className="text-sm text-neutral-primary">
                                  {conversation?.senderFullName}
                                </p>
                                <p className="text-sm text-neutral-ternary">
                                 {
                                  decryptMessageWithKeyAES(conversation?.lastMessage?.encryptedMessage, conversation?.conversation?.conversationKey)
                                 }
                                </p>
                              </div>
                            </div>
                            <div className="items-center">
                              {/* <p className="text-sm text-neutral-ternary">{conversation?.lastMessage.createdAt}</p> */}
                              <p></p>
                            </div>
                          </div>
                        );
                      }
                    )}
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
              <p className="text-md font-bold text-neutral-primary">
                {senderFullName && senderFullName}
              </p>
            </div>
            <div>
              <EndChat />
            </div>
          </div>
          <Separator />
          <Chat isMobile={isMobile} refetchConversation={queryConversation.refetch} />
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
                disabled={appointmentDetail.status !== null}
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
                <ChatInformation />
              </ScrollArea>
            )}

            {appointment && (
              <div className="m-4">
                <p className="font-bold text-2xl">Đặt lịch hẹn</p>
                <Appointment />
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    )
  );
}
