import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
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
}
const columns: TableColumnsType<DataType> = [
  {
    title: "Question",
    dataIndex: "question",
    width: "70%",
  },
  {
    title: "Answer",
    dataIndex: "answer",
    render: (answer) => {
        return <span className="font-bold">{answer}</span>;
    }
  },
];
interface FormattedQuestion {
  question: string;
  answer: string;
}

export function AnswerSheet() {
  const [userIdTargetUser, setUserIdTargetUser] = useAtom(userIdTargetUserAtom);
  const [senderFullName, setSenderFullName] = useAtom(senderFullNameAtom);

  const {
    data: answerData,
    isSuccess,
    isError,
  } = useAnswerByIdHook(userIdTargetUser!);

  const formatData = (data: ApiResponse): FormattedQuestion[] => {
    return data.map(({ questionText, answer, options }) => {
      const answerText =
        options.find((option) => option.optionId === answer)?.optionText || "";
      return { question: questionText, answer: answerText };
    });
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="text-neutral-primary border-regal-green  hover:bg-regal-green h-[30px]"
          variant="outline"
        >
          Kết quả sàng lọc
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-[1000px]">
        <SheetHeader>
          <SheetTitle>Kết quả sàng lọc của {senderFullName}</SheetTitle>
          {/* <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription> */}
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
