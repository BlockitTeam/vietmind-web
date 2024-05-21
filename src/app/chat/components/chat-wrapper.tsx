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
import { Calendar, Search } from "lucide-react";
import { Chat } from "@/app/chat/components/chat";
interface ChatLayoutProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}
export function ChatWrapper({
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
}: ChatLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [selectedUser, setSelectedUser] = React.useState(userData[0]);
  const [isMobile, setIsMobile] = useState(false);
  const [tab, setTab] = React.useState("chat");

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
            <Button className="text-neutral-primary border-regal-green bg-regal-green w-[45px] h-[45px]">
              VT
            </Button>
            <p className="text-md font-bold text-neutral-primary">Việt Trinh</p>
          </div>
          <div>
            <Button className="text-neutral-primary border-regal-green bg-regal-green hover:bg-regal-green h-[30px]">
              Kết thúc tư vấn
            </Button>
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
            "flex h-[56px] items-center justify-center",
            isCollapsed ? "h-[56px]" : "px-2"
          )}
        >
          <Button className="text-neutral-primary border-regal-green bg-regal-green hover:bg-regal-green h-[30px] w-full">
            Đặt lịch hẹn
            <Calendar className="ml-2" size={20} />
          </Button>
        </div>
        <Separator />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
