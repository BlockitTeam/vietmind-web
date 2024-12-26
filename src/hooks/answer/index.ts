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


export const getDetailSurveyById = (id: string | number) => {
  const url = `response/resultDetailByUserId/${id}`;
  return getData<IResponse<ApiResponse>>(url);
};

export const getNameOfSurveyDetailByUserId = (id: string | number) => {
  const url = `response/getNameOfSurveyDetailByUserId/${id}`;
  return getData<IResponse<{surveyName: string, date: string}>>(url);
};


export const useAnswerByIdHook = (id: string | number) => {
  return useQuery<IResponse<ApiResponse>>({
    queryKey: ["answerById", id],
    queryFn: () => getAnswerById(id!),
    enabled: !!id,
    retry: false
  });
};


export const useGetDetailSurveyById = (id: string | number) => {
  return useQuery<IResponse<ApiResponse>>({
    queryKey: ["DetailSurveyById", id],
    queryFn: () => getDetailSurveyById(id!),
    enabled: !!id,
    retry: false
  });
};

export const useGetNameOfSurveyDetailByUserId = (id: string | number) => {
  return useQuery<IResponse<{surveyName: string, date: string}>>({
    queryKey: ["GetNameOfSurveyDetail", id],
    queryFn: () => getNameOfSurveyDetailByUserId(id!),
    enabled: !!id,
    retry: false
  });
};
