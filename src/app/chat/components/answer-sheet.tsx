import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useGetSurveyAnswers } from "@/hooks/answer";
import { senderFullNameAtom, userIdTargetUserAtom } from "@/lib/jotai";
import { Table, TableColumnsType, Tag } from "antd";
import { useAtom } from "jotai";

// Interface for survey answer details
interface AnswerDataType {
  questionId: string;
  questionText: string;
  selectedOptions: string[];
  textAnswer: string | null;
  score: number;
}

interface AnswerSheetProps {
  userSurveyId: string;
  surveyTitle?: string;
}

const columns: TableColumnsType<AnswerDataType> = [
  {
    title: "Câu hỏi",
    dataIndex: "questionText",
    width: "40%",
    render: (value) => {
      return <span className="font-medium">{value}</span>;
    }
  },
  {
    title: "Câu trả lời",
    dataIndex: "selectedOptions",
    width: "40%",
    render: (value, record) => {
      if (record.textAnswer) {
        return <span>{record.textAnswer}</span>;
      }
      if (value && value.length > 0) {
        return (
          <div className="flex flex-wrap gap-1">
            {value.map((option: string, idx: number) => (
              <Tag key={idx} color="blue">{option}</Tag>
            ))}
          </div>
        );
      }
      return <span className="text-gray-400">-</span>;
    }
  },
  {
    title: "Điểm",
    dataIndex: "score",
    width: "20%",
    render: (value) => {
      return <span className="font-bold">{value ?? '-'}</span>;
    }
  },
];

export function AnswerSheet({ userSurveyId, surveyTitle }: AnswerSheetProps) {
  const [userIdTargetUser,] = useAtom(userIdTargetUserAtom);
  const [senderFullName,] = useAtom(senderFullNameAtom);

  const {
    data: surveyAnswersResponse,
    isSuccess,
  } = useGetSurveyAnswers(userIdTargetUser!, userSurveyId);
  
  // Try to extract from response - handle both nested and direct response structures
  // Some APIs return: { data: { data: {...}, auditId }, statusCode }
  // Others return: { data: {...}, statusCode }
  const responseData = surveyAnswersResponse?.data as any;
  const surveyAnswers = responseData?.data || responseData;

  // Format the survey answers data for the table
  const formatData = (): AnswerDataType[] => {
    if (!surveyAnswers?.answers || !Array.isArray(surveyAnswers.answers)) {
      return [];
    }
    
    return surveyAnswers.answers.map((answer: any) => ({
      questionId: answer.questionId,
      questionText: answer.questionText,
      selectedOptions: answer.options
        ?.filter((opt: any) => answer.selectedOptionIds?.includes(opt.id))
        ?.map((opt: any) => opt.optionText) || [],
      textAnswer: answer.textAnswer,
      score: answer.score,
    }));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <span
          className="text-md font-bold cursor-pointer underline"
        >
          Xem chi tiết
        </span>
      </SheetTrigger>
      <SheetContent className="min-w-[800px]">
        <SheetHeader>
          <SheetTitle>
            {surveyTitle || surveyAnswers?.surveyTitle || "Chi tiết khảo sát"} - {senderFullName}
          </SheetTitle>
          {isSuccess && surveyAnswers && (
            <div className="text-sm text-gray-500 mt-2">
              <span>Tổng điểm: <b>{surveyAnswers.totalScore}</b> / {surveyAnswers.maxScore}</span>
              {surveyAnswers.resultType && (
                <span className="ml-4">Kết quả: <b>{surveyAnswers.resultType}</b></span>
              )}
            </div>
          )}
        </SheetHeader>
        <div className="w-full h-full mt-3">
          <Table<AnswerDataType>
            columns={columns}
            className="h-full"
            pagination={false}
            scroll={{ y: 600 }}
            dataSource={isSuccess ? formatData() : []}
            rowKey="questionId"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
