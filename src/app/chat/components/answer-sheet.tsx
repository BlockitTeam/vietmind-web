import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ApiResponse, useAnswerByIdHook } from "@/hooks/answer";
import { senderFullNameAtom, userIdTargetUserAtom } from "@/lib/jotai";
import { Table, TableColumnsType } from "antd";
import { useAtom } from "jotai";
interface DataType {
  question: string;
  answer: string;
  responseFormat: string
}
const columns: TableColumnsType<DataType> = [
  {
    title: "Question",
    dataIndex: "question",
    width: "70%",
    render: (value, record) => {
      return <span className={record?.responseFormat === "parent_question" ? "font-bold text-lg" : ""}>{value}</span>;
    }
  },
  {
    title: "Answer",
    dataIndex: "answer",
    render: (value) => {
      return <span className="font-bold">{value}</span>;
    }
  },
];

export function AnswerSheet() {
  const [userIdTargetUser,] = useAtom(userIdTargetUserAtom);
  const [senderFullName,] = useAtom(senderFullNameAtom);

  const {
    data: answerData,
    isSuccess,
  } = useAnswerByIdHook(userIdTargetUser!);

  const formatData = (data: ApiResponse): any[] => {
    return data.map(({ responseFormat, questionText, answer, options }) => {
      if (responseFormat === "single_choice") {
        const answerText =
          options.find((option) => option.optionId === answer)?.optionText || "";
        return { responseFormat, question: questionText, answer: answerText };
      }
      if (responseFormat === "text_input") {
        return { responseFormat, question: questionText, answer: answer };
      }
      if (responseFormat === "parent_question") {
        return { responseFormat, question: questionText, answer: answer };
      }
    });
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
      <SheetContent className="min-w-[1000px]">
        <SheetHeader>
          <SheetTitle>Kết quả sàng lọc của {senderFullName}</SheetTitle>
        </SheetHeader>
        <div className="w-full h-full mt-3">
          <Table<DataType>
            columns={columns}
            className="h-full"
            pagination={false}
            scroll={{ y: 1000 }}
            dataSource={isSuccess ? formatData(answerData.data) : []}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
