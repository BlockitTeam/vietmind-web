import { IResponse, getData } from "@/config/api";
import { useQuery } from "@tanstack/react-query";

// GET /doctors/patients/:userId/surveys/result - Get patient's general survey result (scores by category)
export const fetchScreeningTestUserId = (id: string | number) => {
  const url = `doctors/patients/${id}/surveys/result`;
  return getData<IResponse<any>>(url);
};

export const useGetScreeningTestUserIdHook = (id: string | number) => {
  return useQuery<IResponse<any>>({
    queryKey: ["screening-testUserId", id],
    queryFn: () => fetchScreeningTestUserId(id),
    enabled: !!id
  });
};

// GET /doctors/patients/:userId/surveys/:userSurveyId/answers - Get specific survey answers
export const fetchSurveyAnswers = (userId: string | number, userSurveyId: string | number) => {
  const url = `doctors/patients/${userId}/surveys/${userSurveyId}/answers`;
  return getData<IResponse<any>>(url);
};

export const useGetSurveyAnswersHook = (userId: string | number, userSurveyId: string | number) => {
  return useQuery<IResponse<any>>({
    queryKey: ["survey-answers", userId, userSurveyId],
    queryFn: () => fetchSurveyAnswers(userId, userSurveyId),
    enabled: !!userId && !!userSurveyId
  });
};
