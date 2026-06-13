import request from "./request";

const expertAuthService = {
  logout: () => request.post("/admin/expert/logout", {}),
};

export default expertAuthService;
