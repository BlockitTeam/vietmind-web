import { useAnswerByIdHook } from "@/hooks/answer";
import { Table, TableColumnsType } from "antd";
import React from "react";

interface DataType {
  key: React.Key;
  question: string;
  answer: string;
}

export default function ResultTable() {
  const { data: tableResult, isSuccess } = useAnswerByIdHook(
    "5d69bb54-59b8-42fa-8c90-32d37ad09377"
  );
  console.log("🚀 ~ ResultTable ~ tableResult:", tableResult);
  const columns: TableColumnsType<DataType> = [
    {
      title: "Question",
      dataIndex: "question",
      width: "70%",
    },
    {
      title: "Answer",
      dataIndex: "answer",
    },
  ];
  const data: DataType[] = [
    {
      key: "1",
      question: "John Brown",
      answer: "New York No. 1 Lake Park",
    },
    {
      key: "2",
      question: "John Brown",
      answer: "New York No. 1 Lake Park",
    },
    {
      key: "3",
      question: "John Brown",
      answer: "New York No. 1 Lake Park",
    },
    {
      key: "4",
      question: "John Brown",
      answer: "New York No. 1 Lake Park",
    },
  ];
  return (
    <Table<DataType> columns={columns} dataSource={isSuccess ? data : []} />
  );
}
