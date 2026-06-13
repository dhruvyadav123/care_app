import request from "./request";

const expertService = {
  getAllExperts: (params) => request.get("/admin/experts", { params }),
  createExpert: (data) => request.post("/admin/expert/create", data),
  updateExpert: (expertId, data) => request.put(`/admin/expert/${expertId}`, data),
  deleteExpert: (expertId) => request.delete(`/admin/expert/${expertId}`),
};

export default expertService;
