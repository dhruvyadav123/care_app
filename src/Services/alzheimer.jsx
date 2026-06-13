import request from "./request";

const QUESTION_CATEGORY_BASES = [
  "/assesment/alzheimer/questionCategory",
  "/assesment/alzheimer/categories",
  "/assesment/alzheimer/category",
];
const QUESTION_BASE = "/assesment/alzheimer/question";

const requestWithFallback = async (method, paths, data) => {
  let lastError;

  for (const path of paths) {
    try {
      switch (method) {
        case "get":
          return await request.get(path, { skipErrorToast: true });
        case "post":
          return await request.post(path, data, { skipErrorToast: true });
        case "put":
          return await request.put(path, data, { skipErrorToast: true });
        case "delete":
          return await request.delete(path, { skipErrorToast: true });
        default:
          throw new Error(`Unsupported request method: ${method}`);
      }
    } catch (error) {
      const status = error?.response?.status;

      if (status !== 404) {
        throw error;
      }

      lastError = error;
    }
  }

  throw lastError || new Error("Alzheimer category endpoint not found");
};

const alzheimerService = {
  createAdminGame: (data) =>
    request.post("/assesment/admin/game/alzheimer/create", data),
  getAdminGames: (params) =>
    request.get("/assesment/admin/game/alzheimer", { params }),
  getAdminGameById: (id) =>
    request.get(`/assesment/admin/game/alzheimer/${id}`),
  updateAdminGame: (id, data) =>
    request.put(`/assesment/admin/game/alzheimer/${id}`, data),
  deleteAdminGame: (id) =>
    request.delete(`/assesment/admin/game/alzheimer/${id}`),
  // -------------------------------
  // 🧠 Alzheimer Questions
  // -------------------------------
  createQuestion: (data) => request.post(`${QUESTION_BASE}/create`, data),
  getAllQuestions: () => request.get(`${QUESTION_BASE}/list`),
  getQuestionById: (id) => request.get(`${QUESTION_BASE}/${id}`),
  updateQuestion: (id, data) => request.put(`${QUESTION_BASE}/${id}`, data),
  deleteQuestion: (id) => request.delete(`${QUESTION_BASE}/${id}`),

  // -------------------------------
  // 📂 Question Categories
  // -------------------------------
  createQuestionCategory: (data) =>
    requestWithFallback("post", QUESTION_CATEGORY_BASES, data),
  getAllQuestionCategorys: () =>
    requestWithFallback("get", QUESTION_CATEGORY_BASES),
  getQuestionCategoryById: (id) =>
    requestWithFallback(
      "get",
      QUESTION_CATEGORY_BASES.map((base) => `${base}/${id}`)
    ),
  updateQuestionCategory: (id, data) =>
    requestWithFallback(
      "put",
      QUESTION_CATEGORY_BASES.map((base) => `${base}/${id}`),
      data
    ),
  deleteQuestionCategory: (id) =>
    requestWithFallback(
      "delete",
      QUESTION_CATEGORY_BASES.map((base) => `${base}/${id}`)
    ),
  deleteAssessmentCategory: (id) =>
    requestWithFallback(
      "delete",
      QUESTION_CATEGORY_BASES.map((base) => `${base}/${id}`)
    ),

  // -------------------------------
  // 🎥 Videos
  // -------------------------------
  createVideo: (data) => request.post("/assesment/alzheimer/videos", data),
  getAllVideos: () => request.get("/assesment/alzheimer/videos?sort=old"),
  deleteVideo: (id) => request.delete(`/${id}`),

  // -------------------------------
  // 🧘 Meditation
  // -------------------------------
  createMeditation: (data) => request.post("/", data),
  getAllMeditations: () => request.get("/"),
  getMeditationById: (id) => request.get(`/${id}`),
  deleteMeditation: (id) => request.delete(`/${id}`),

  // -------------------------------
  // ✅ Tasks
  // -------------------------------
  createTask: (data) => request.post("/", data),
  getAllTasks: () => request.get("/"),
  getTaskById: (id) => request.get(`/${id}`),
  updateTask: (id, data) => request.put(`/${id}`, data),
  deleteTask: (id) => request.delete(`/${id}`),

  // -------------------------------
  // 🎨 Activities
  // -------------------------------
  createActivity: (data) => request.post("/", data),
  getAllActivities: () => request.get("/"),
  getActivityById: (id) => request.get(`/${id}`),
  updateActivity: (id, data) => request.put(`/${id}`, data),
  deleteActivity: (id) => request.delete(`/${id}`),

  // -------------------------------
  // 🎮 Games
  // -------------------------------
  createGame: (data) => request.post("/", data),
  getAllGames: () => request.get("/"),
  getGameById: (id) => request.get(`/${id}`),
  updateGame: (id, data) => request.put(`/${id}`, data),
  deleteGame: (id) => request.delete(`/${id}`),

  // -------------------------------
  // 👨‍⚕️ Doctors
  // -------------------------------
  createDoctor: (data) => request.post("/assesment/alzheimer/doctors", data),
  getAllDoctors: () => request.get("/admin/getAllDoctors"),
  getDoctorById: (id) => request.get(`/${id}`),
  updateDoctor: (id, data) => request.put(`/${id}`, data),
  deleteDoctor: (id) => request.delete(`/${id}`),

  // -------------------------------
  // 🧍‍♂️ Caregivers
  // -------------------------------
  getAllCaregivers: () => request.get("/assesment/alzheimer/caregivers/list"),
  createCaregiver: (data) => request.post("/assesment/alzheimer/caregiver", data),
  updateCaregiver: (id, data) => request.patch(`/assesment/alzheimer/caregiver/${id}`, data),
  deleteCaregiver: (id) => request.delete(`/assesment/alzheimer/caregiver/${id}`),

  // -------------------------------
  // 🧍‍♂️ Caregivers
  // -------------------------------
  getAppointments: () => request.post("/assesment/alzheimer/doctors/getAppointments"),
  appointment: (data) => request.post("/assesment/alzheimer/doctors/appointment", data),

};

export default alzheimerService;
