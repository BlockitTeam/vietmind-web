import { IResponse, getData } from "@/config/api";
import { useQuery } from "@tanstack/react-query";

interface Option {
  optionId: number;
  questionId: number;
  optionText: string;
  score: number;
  createdAt: string;  // Use `Date` if you plan to convert to Date objects
  updatedAt: string;  // Use `Date` if you plan to convert to Date objects
}

interface Question {
  questionId: number;
  surveyId: number;
  questionText: string;
  questionTypeId: number | null;
  responseFormat: "single_choice" | "multiple_choice" | "text" | string; // Adjust to include other possible formats
  parentQuestionId: number | null;
  options: Option[];
  answer: number; // Represents the `optionId` of the selected answer
}

export type ApiResponse = Question[];

export const getAnswerById = (id: string | number) => {
  const url = `specialized-responses/latestResultDetailByUserId?userId=${id}`;
  return getData<IResponse<ApiResponse>>(url);
};


export const useAnswerByIdHook = (id: string | number) => {
  const url = "user/current-user";
  return useQuery<IResponse<ApiResponse>>({
    queryKey: ["answerById", id],
    queryFn: () => getAnswerById(id!),
    enabled: !!id
  });
};
