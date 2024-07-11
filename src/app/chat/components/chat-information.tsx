"use client";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import { useAtom } from "jotai";
import {
  appointmentDetailAtom,
  conversationIdAtom,
  userConversationIdAtom,
  userIdTargetUserAtom,
} from "@/lib/jotai";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { WatchDetail } from "./watch-detail";
import { useGetUserBasicHook } from "@/hooks/user";
import { useGetScreeningTestUserIdHook } from "@/hooks/screeningTest";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import { useAppointmentIdHook } from "@/hooks/appointment";
import { displayStatusAppointment } from "@/helper";
import { useWebSocketContext } from "./webSocketContext";

export function ChatInformation() {
  const [appointmentDetail, setAppointmentDetail] = useAtom(
    appointmentDetailAtom
  );
  const [userIdTargetUser, setUserIdTargetUser] = useAtom(userIdTargetUserAtom);
  const [conversationId, setConversationId] = useAtom(conversationIdAtom);
  const [userConversationId, setUserConversationId] = useAtom(
    userConversationIdAtom
  );
  const { sendMessageWS, updateUrl, lastMessage } = useWebSocketContext();

  const { data: userBasic, ...queryUserBasic } =
    useGetUserBasicHook(userIdTargetUser);
  const { data: screeningTest, ...queryScreeningTest } =
    useGetScreeningTestUserIdHook(userIdTargetUser);

  const { data: appointments, ...queryAppointment } =
    useAppointmentIdHook(conversationId);

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Heading.configure({
        levels: [1, 2, 3],
      }),
    ],
    editorProps: {
      attributes: {
        class: "focus:outline-none",
      },
    },
    content: "<p>Hello World! 🌎️</p>",
  });
  return (
    <div className="m-4 mb-3">
      {appointments && appointments.data && (
        <>
          <Card className="bg-regal-green-light mb-3">
            <CardContent className="flex gap-3 flex-col p-2">
              <p className="bg-neutral-ternary text-white w-fit rounded-md text-xs p-1">
                {displayStatusAppointment(appointments?.data.status)}
              </p>

              <p className="font-bold text-sm">
                Lịch hẹn : {userConversationId?.senderFullName}
              </p>
              <p className="text-sm text-neutral-secondary">
                {appointments?.data?.appointmentDate}{" "}
                {appointments?.data?.startTime}-{appointments?.data?.endTime}
              </p>

              <p className="text-sm text-neutral-secondary">
                Ghi chú: {appointments?.data?.content}
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

      {userIdTargetUser &&
        userBasic !== undefined &&
        queryUserBasic.isSuccess && (
          <>
            <div className="m-4">
              <p className="font-bold text-md mb-4">Thông tin người dùng</p>
              <div className="flex gap-2 flex-col">
                <div className="flex gap-4">
                  <p className="text-neutral-ternary text-sm">Ngày sinh</p>
                  <p className="text-neutral-primary text-sm font-bold">
                    {userBasic.data.birthYear}
                  </p>
                </div>
                <div className="flex gap-4">
                  <p className="text-neutral-ternary text-sm">Tuổi</p>
                  <p className="text-neutral-primary text-sm font-bold">
                    {userBasic.data.age}
                  </p>
                </div>
                <div className="flex gap-4">
                  <p className="text-neutral-ternary text-sm">Giới tính</p>
                  <p className="text-neutral-primary text-sm font-bold">
                    {userBasic.data.gender}
                  </p>
                </div>
              </div>
            </div>
            <Separator />
          </>
        )}

      {userIdTargetUser &&
        screeningTest !== undefined &&
        queryScreeningTest.isSuccess && (
          <>
            <div className="m-4">
              <div className="flex justify-between cursor-pointer ">
                <p className="font-bold text-md mb-4">Kết quả sàng lọc</p>
                {/* <WatchDetail /> */}
              </div>
              <div className="flex gap-2 flex-col">
                {Object.entries(screeningTest.data).map(([key, value]) => (
                  <div className="flex gap-4">
                    <p className="text-neutral-ternary text-sm">{key}:</p>
                    <p className="text-neutral-primary text-sm ">
                      {value as any}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <Separator />
          </>
        )}

      <div className="m-4">
        <div className="flex justify-between items-center cursor-pointer">
          <p className="font-bold text-lg mb-4">Ghi chú</p>
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
          <div className="border-spacing-2 border-l-yellow-300 border p-2 rounded-md	">
            <EditorContent editor={editor} style={{ padding: "10px" }} />
          </div>
          <Button variant={"outline"} className="border-regal-green mt-4">
            <PlusCircleIcon size={15} className="mr-2" /> Thêm ghi chú
          </Button>
        </div>
      </div>
    </div>
  );
}
