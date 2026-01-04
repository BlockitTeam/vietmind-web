import { IResponse, getData } from "@/config/api";
import { useQuery } from "@tanstack/react-query";

// Types for survey answers
interface SurveyAnswersResponse {
  userSurveyId: string;
  surveyId: string;
  surveyTitle: string;
  status: string;
  startedAt: string;
  completedAt: string;
  totalScore: number;
  maxScore: number;
  resultType: string;
  answers: any[];
}

interface UserSurvey {
  id: string;
  userId: string;
  surveyId: string;
  surveyVersion: number;
  status: string;
  startedAt: string;
  completedAt: string;
  totalScore: number;
}

// GET /doctors/patients/:userId/surveys - Get patient survey list
const getNameOfSurveyDetailByUserId = (id: string | number) => {
  const url = `doctors/patients/${id}/surveys`;
  return getData<IResponse<UserSurvey[]>>(url);
};

// GET /doctors/patients/:userId/surveys/:userSurveyId/answers - Get specific survey answers
const getSurveyAnswersByUserSurveyId = (userId: string | number, userSurveyId: string | number) => {
  const url = `doctors/patients/${userId}/surveys/${userSurveyId}/answers`;
  return getData<IResponse<SurveyAnswersResponse>>(url);
};

export const useGetNameOfSurveyDetailByUserId = (id: string | number) => {
  return useQuery<IResponse<UserSurvey[]>>({
    queryKey: ["GetNameOfSurveyDetail", id],
    queryFn: () => getNameOfSurveyDetailByUserId(id!),
    enabled: !!id,
    retry: false
  });
};

export const useGetSurveyAnswers = (userId: string | number, userSurveyId: string | number) => {
  return useQuery<IResponse<SurveyAnswersResponse>>({
    queryKey: ["surveyAnswers", userId, userSurveyId],
    queryFn: () => getSurveyAnswersByUserSurveyId(userId, userSurveyId),
    enabled: !!userId && !!userSurveyId,
    retry: false
  });
};
