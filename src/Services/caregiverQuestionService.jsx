import request from "./request";

const CAREGIVER_QUESTION_URL =
  "http://172.104.206.4:5000/api/familymember/caregiver-question";

const withSilentErrors = (config = {}) => ({
  ...config,
  skipErrorToast: true,
});

const caregiverQuestionService = {
  getQuestions: () => request.get(CAREGIVER_QUESTION_URL, withSilentErrors()),
  getQuestionById: (questionId) =>
    request.get(`${CAREGIVER_QUESTION_URL}/${questionId}`, withSilentErrors()),
  createQuestion: (payload) =>
    request.post(CAREGIVER_QUESTION_URL, payload, withSilentErrors()),
  updateQuestion: (questionId, payload) =>
    request.put(`${CAREGIVER_QUESTION_URL}/${questionId}`, payload, withSilentErrors()),
  deleteQuestion: (questionId) =>
    request.delete(`${CAREGIVER_QUESTION_URL}/${questionId}`, withSilentErrors()),
};

export default caregiverQuestionService;
