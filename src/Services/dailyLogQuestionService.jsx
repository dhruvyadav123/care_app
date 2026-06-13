import request from "./request";

const DAILY_LOG_QUESTION_URL =
  "http://172.104.206.4:5000/api/familymember/daily-log-question";

const withSilentErrors = (config = {}) => ({
  ...config,
  skipErrorToast: true,
});

const dailyLogQuestionService = {
  getQuestions: (logType) =>
    request.get(`${DAILY_LOG_QUESTION_URL}/${logType}`, withSilentErrors()),
  getQuestionById: (questionId) =>
    request.get(`${DAILY_LOG_QUESTION_URL}/details/${questionId}`, withSilentErrors()),
  createQuestion: (payload) =>
    request.post(DAILY_LOG_QUESTION_URL, payload, withSilentErrors()),
  updateQuestion: (questionId, payload) =>
    request.put(`${DAILY_LOG_QUESTION_URL}/${questionId}`, payload, withSilentErrors()),
  deleteQuestion: (questionId) =>
    request.delete(`${DAILY_LOG_QUESTION_URL}/${questionId}`, withSilentErrors()),
};

export default dailyLogQuestionService;
