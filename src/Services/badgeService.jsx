import request from "./request";

const badgeService = {
  getAll: (params) => request.get("/admin/badges", { params }),
  add: (data) =>
    request.post("/admin/badge/create", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

export default badgeService;
