"use client";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import {
  appointmentAtom,
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
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import {
  useAppointmentIdHook,
  useGetCurrentAppointment,
  useGetFutureAppointment,
  usePutMutationAppointmentIdHook,
} from "@/hooks/appointment";
import { displayStatusAppointment } from "@/helper";
import { useWebSocketContext } from "./webSocketContext";
import { useEffect } from "react";
import { AnswerSheet } from "./answer-sheet";
import TiptapInput from "./tiptap";

export function ChatInformation() {
  const [appointmentDetail, setAppointmentDetail] = useAtom(
    appointmentDetailAtom
  );

  const [appointment, setAppointment] = useAtom(appointmentAtom);
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
  const {
    data: currentAppointments,
    refetch: refetchAppointment,
    ...queryAppointment
  } = useGetCurrentAppointment(userIdTargetUser!);

  const {
    data: futureAppointments,
    refetch: refetchFutureAppointment,
    ...queryFutureAppointment
  } = useGetFutureAppointment(userIdTargetUser!);

  const usePutMutationAppointmentId = usePutMutationAppointmentIdHook(
    currentAppointments?.data.conversationId
  );

  useEffect(() => {
    if (lastMessage !== null) {
      const newMessage = JSON.parse(lastMessage.data);
      if (newMessage?.type === "appointment") {
        refetchAppointment().then((res) => {
          if (
            res.data?.data.status === "CANCELLED" ||
            res.data?.data.status === "CONFIRMED"
          )
            prompt(
              `${res.data?.data.userId} đã ${res.data?.data.status === "CANCELLED" ? "hủy" : "xác nhận"
              } cuộc hẹn!`
            );
        });
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    if (queryAppointment.isSuccess && currentAppointments?.data) {
      setAppointmentDetail({
        status: currentAppointments?.data.status,
        data: currentAppointments?.data,
      });
    }
  }, [currentAppointments]);

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

  const cancelAppointment = () => {
    const bodyCancel = {
      ...currentAppointments?.data,
      status: "CANCELLED",
    };

    usePutMutationAppointmentId.mutate(bodyCancel, {
      onSuccess(data, variables, context) {
        if (data.statusCode === 200) {
          setAppointmentDetail({
            status: data?.data?.status,
            data: data?.data,
          });
          sendMessageWS(
            JSON.stringify({
              type: "appointment",
              appointmentId: data?.data?.appointmentId,
              conversationId: data?.data?.conversationId,
              status: "CANCELLED",
            })
          );
          setAppointment(false);
        }
      },
    });
  };
  return (
    <div className="m-4 mb-3">
      {currentAppointments && currentAppointments.data && queryAppointment.isSuccess && (
        <>
          <Card className="bg-regal-green-light mb-3 border border-slate-300	">
            <CardContent className="flex gap-3 flex-col p-2">
              <p className="bg-neutral-ternary text-white w-fit rounded-md text-xs p-1">
                {displayStatusAppointment(currentAppointments?.data.status)}
              </p>

              <p className="font-bold text-sm">
                Lịch hẹn : {userConversationId?.senderFullName}
              </p>
              <p className="text-sm text-neutral-secondary">
                Giờ bắt đầu : <b>{currentAppointments?.data?.startTime}</b> <br />
                Giờ kết thúc : <b>{currentAppointments?.data?.endTime}</b> <br />
                Ngày : <b>{currentAppointments?.data?.appointmentDate}</b>
              </p>

              <p className="text-sm text-neutral-secondary">
                Ghi chú: {currentAppointments?.data?.content}
              </p>
            </CardContent>
            <CardFooter className="grid grid-flow-col gap-3 p-2 items-center justify-stretch w-full">
              <Button
                disabled={currentAppointments.data?.status === "CANCELLED"}
                variant="outline"
                className="border-regal-green"
                onClick={() => setAppointment(true)}
              >
                Dời lịch hẹn
              </Button>
              {/* <Button
                disabled={appointments.data?.status === "CANCELLED"}
                variant="outline"
                className="border-regal-green"
                onClick={cancelAppointment}
              >
                Huỷ lịch hẹn
              </Button> */}
            </CardFooter>
          </Card>
          <Separator />
        </>
      )}

      {futureAppointments && futureAppointments.data && queryFutureAppointment.isSuccess && (
        <>
          <Card className="bg-regal-green-light mb-3 border border-slate-300	">
            <CardContent className="flex gap-3 flex-col p-2">
              <p className="bg-neutral-ternary text-white w-fit rounded-md text-xs p-1">
                {displayStatusAppointment(futureAppointments?.data.status)}
              </p>

              <p className="font-bold text-sm">
                Lịch hẹn : {userConversationId?.senderFullName}
              </p>
              <p className="text-sm text-neutral-secondary">
                Giờ bắt đầu : <b>{futureAppointments?.data?.startTime}</b> <br />
                Giờ kết thúc : <b>{futureAppointments?.data?.endTime}</b> <br />
                Ngày : <b>{futureAppointments?.data?.appointmentDate}</b>
              </p>

              <p className="text-sm text-neutral-secondary">
                Ghi chú: {futureAppointments?.data?.content}
              </p>
            </CardContent>
            <CardFooter className="grid grid-flow-col gap-3 p-2 items-center justify-stretch w-full">
              <Button
                disabled={futureAppointments.data?.status === "CANCELLED"}
                variant="outline"
                className="border-regal-green"
                onClick={() => setAppointment(true)}
              >
                Dời lịch hẹn
              </Button>
              {/* <Button
                disabled={appointments.data?.status === "CANCELLED"}
                variant="outline"
                className="border-regal-green"
                onClick={cancelAppointment}
              >
                Huỷ lịch hẹn
              </Button> */}
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
                <AnswerSheet />
              </div>
            </div>
            <Separator />
          </>
        )}

      <div className="m-4">
        <div className="flex justify-between items-center cursor-pointer">
          <p className="font-bold text-lg mb-4">Ghi chú</p>
        </div>
        <div className="flex gap-4 flex-col justify-between">
          <div className="w-full break-words">
            <TiptapInput />
          </div>
        </div>
      </div>
    </div>
  );
}
