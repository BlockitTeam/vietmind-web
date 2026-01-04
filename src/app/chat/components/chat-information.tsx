"use client";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import {
  appointmentAtom,
  appointmentDetailAtom,
  userConversationIdAtom,
  userIdTargetUserAtom,
} from "@/lib/jotai";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useGetUserBasicHook } from "@/hooks/user";
import {
  useGetCurrentAppointment,
  useGetFutureAppointment,
  usePutMutationAppointmentIdHook,
} from "@/hooks/appointment";
import { displayStatusAppointment, displayGender } from "@/helper";
import { useWebSocketContext } from "./webSocketContext";
import { useEffect } from "react";
import { AnswerSheet } from "./answer-sheet";
import TiptapInput from "./tiptap";
import { useGetNameOfSurveyDetailByUserId } from "@/hooks/answer";
import dayjs from "dayjs";

export function ChatInformation() {
  const [, setAppointmentDetail] = useAtom(
    appointmentDetailAtom
  );

  const [, setAppointment] = useAtom(appointmentAtom);
  const [userIdTargetUser, ] = useAtom(userIdTargetUserAtom);
  const [userConversationId, ] = useAtom(
    userConversationIdAtom
  );
  const { sendRawMessage, lastMessage } = useWebSocketContext();

  const { data: userBasicResponse, ...queryUserBasic } =
    useGetUserBasicHook(userIdTargetUser!);
  
  // These endpoints return data directly in 'data' (not nested data.data)
  const userBasic = userBasicResponse?.data;
  const {
    data: currentAppointmentsResponse,
    refetch: refetchAppointment,
    ...queryCurrenrAppointment
  } = useGetCurrentAppointment(userIdTargetUser!);

  // Extract the first current appointment from the nested response structure
  const currentAppointment = (currentAppointmentsResponse?.data as any)?.data?.[0];

  const {
    data: futureAppointmentsResponse,
    refetch: refetchFutureAppointment,
    ...queryFutureAppointment
  } = useGetFutureAppointment(userIdTargetUser!);

  // Extract the first future appointment from the nested response structure
  // API returns: { data: { data: [...], auditId }, statusCode }
  const futureAppointment = (futureAppointmentsResponse?.data as any)?.data?.[0];

  const usePutMutationAppointmentId = usePutMutationAppointmentIdHook(
    futureAppointment?.userId
  );

  const {data: informationSurveyByIdResponse, ...NameOfSurveyDetailByUserId} = useGetNameOfSurveyDetailByUserId(userIdTargetUser!);
  
  // Extract survey info from nested response (this endpoint uses data.data)
  const informationSurveyById = (informationSurveyByIdResponse?.data as any)?.data;

  useEffect(() => {
    if (userIdTargetUser) {
      refetchAppointment();
      refetchFutureAppointment();
    }
  }, [userIdTargetUser, refetchFutureAppointment, refetchAppointment]);

  useEffect(() => {
    if (lastMessage !== null) {
      // Socket.IO sends parsed messages directly, check the type
      if (lastMessage?.type === "appointment") {
        refetchAppointment();
        refetchFutureAppointment();
      }
    }
  }, [lastMessage, refetchAppointment, refetchFutureAppointment]);

  const cancelAppointment = () => {
    const appointmentId = futureAppointment?.id || futureAppointment?.appointmentId;
    
    if (!appointmentId) {
      return;
    }

    usePutMutationAppointmentId.mutate(
      { appointmentId: String(appointmentId), status: "CANCELLED" },
      {
        onSuccess(data) {
          if (data.statusCode === 200) {
            setAppointmentDetail({
              status: data?.data?.status,
              data: data?.data,
            });
            sendRawMessage("appointment", {
              type: "appointment",
              targerUserId: userIdTargetUser,
              appointmentId: data?.data?.id || data?.data?.appointmentId,
              conversationId: data?.data?.conversationId,
              status: "CANCELLED",
            });
            setAppointment(false);
          }
        },
      }
    );
  };
  return (
    <div className="m-4 mb-3">
      {currentAppointment && queryCurrenrAppointment.isSuccess && (
        <>
          <Card className="bg-regal-green-light mb-3 border border-slate-300	">
            <CardContent className="flex gap-3 flex-col p-2">
              <p className="bg-neutral-ternary text-white w-fit rounded-md text-xs p-1">
                {displayStatusAppointment(currentAppointment?.status)}
              </p>

              <p className="font-bold text-sm">
                Lịch hẹn : {userConversationId?.senderFullName}
              </p>
              <p className="text-sm text-neutral-secondary">
                Giờ bắt đầu : <b>{currentAppointment?.startTime}</b> <br />
                Giờ kết thúc : <b>{currentAppointment?.endTime}</b> <br />
                Ngày : <b>{currentAppointment?.appointmentDate}</b>
              </p>

              <p className="text-sm text-neutral-secondary">
                Ghi chú: {currentAppointment?.content}
              </p>
            </CardContent>
          </Card>
          <Separator />
        </>
      )}

      {futureAppointment && queryFutureAppointment.isSuccess && (
        <>
          <Card className="bg-regal-green-light mb-3 border border-slate-300	">
            <CardContent className="flex gap-3 flex-col p-2">
              <p className="bg-neutral-ternary text-white w-fit rounded-md text-xs p-1">
                {displayStatusAppointment(futureAppointment?.status)}
              </p>

              <p className="font-bold text-sm">
                Lịch hẹn : {userConversationId?.senderFullName}
              </p>
              <p className="text-sm text-neutral-secondary">
                Giờ bắt đầu : <b>{futureAppointment?.startTime}</b> <br />
                Giờ kết thúc : <b>{futureAppointment?.endTime}</b> <br />
                Ngày : <b>{dayjs(futureAppointment?.appointmentDate).format("DD/MM/YYYY")}</b>
              </p>

              <p className="text-sm text-neutral-secondary">
                Ghi chú: {futureAppointment?.content}
              </p>
            </CardContent>
           {
            futureAppointment?.status === "PENDING" && (
              <CardFooter className="grid grid-flow-col gap-3 p-2 items-center justify-stretch w-full">
              <Button
                disabled={futureAppointment?.status === "CANCELLED"}
                variant="outline"
                className="border-regal-green"
                onClick={() => setAppointment(true)}
              >
                Dời lịch hẹn
              </Button>
              <Button
                disabled={futureAppointment?.status === "CANCELLED"}
                variant="outline"
                className="border-regal-green"
                onClick={cancelAppointment}
              >
                Huỷ lịch hẹn
              </Button>
            </CardFooter>
            )
           }
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
                    {userBasic?.birthYear}
                  </p>
                </div>
                <div className="flex gap-4">
                  <p className="text-neutral-ternary text-sm">Tuổi</p>
                  <p className="text-neutral-primary text-sm font-bold">
                    {userBasic?.age ? userBasic?.age : "Không có"}
                  </p>
                </div>
                <div className="flex gap-4">
                  <p className="text-neutral-ternary text-sm">Giới tính</p>
                  <p className="text-neutral-primary text-sm font-bold">
                    {displayGender(userBasic?.gender)}
                  </p>
                </div>
              </div>
            </div>
            <Separator />
          </>
        )}

      {userIdTargetUser &&
        NameOfSurveyDetailByUserId.isSuccess && 
        informationSurveyById && 
        Array.isArray(informationSurveyById) && 
        informationSurveyById.length > 0 && (
          <>
            <div className="m-4">
              <div className="flex justify-between cursor-pointer ">
                <p className="font-bold text-lg mb-4">Kết quả sàng lọc</p>
              </div>
             <div className="flex flex-col gap-4">
              {/* First survey = Sàn lọc chung */}
              <div className="flex gap-2 justify-between items-center">
                <div className="flex flex-col">
                  <b>Sàn lọc chung</b>
                  <span className="text-xs text-gray-500">
                    {informationSurveyById[0].status === 'completed' ? 'Hoàn thành' : informationSurveyById[0].status === 'in_progress' ? 'Đang làm' : informationSurveyById[0].status}
                    {informationSurveyById[0].totalScore !== undefined && ` - Điểm: ${informationSurveyById[0].totalScore}`}
                  </span>
                </div>
                <AnswerSheet userSurveyId={informationSurveyById[0].id} surveyTitle="Sàn lọc chung" />
              </div>

              {/* Remaining surveys = Khảo sát chuyên sâu */}
              {informationSurveyById.length > 1 && (
                <div className="flex flex-col gap-3">
                  <b>Khảo sát chuyên sâu ({informationSurveyById.length - 1})</b>
                  {informationSurveyById.slice(1).map((survey: any) => (
                    <div key={survey.id} className="flex gap-2 justify-between items-center border-b pb-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Khảo sát #{survey.surveyId?.substring(0, 8)}...</span>
                        <span className="text-xs text-gray-500">
                          {survey.status === 'completed' ? 'Hoàn thành' : survey.status === 'in_progress' ? 'Đang làm' : survey.status}
                          {survey.totalScore !== undefined && ` - Điểm: ${survey.totalScore}`}
                        </span>
                      </div>
                      <AnswerSheet userSurveyId={survey.id} />
                    </div>
                  ))}
                </div>
              )}
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
