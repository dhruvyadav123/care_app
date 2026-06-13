import request from "./request";

const buildFreshParams = (params = {}) => ({
  ...params,
  _ts: Date.now(),
});

const expertEventService = {
  getMyEvents: (params) =>
    request.get("/admin/expert/my-events", {
      params: buildFreshParams(params),
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }),
  createMyEvent: (data) => request.post("/admin/expert/createEvent", data),
  updateMyEvent: (eventId, data) => request.put(`/admin/expert/update/${eventId}`, data),
  deleteMyEvent: (eventId) => request.delete(`/admin/expert/delete/${eventId}`),
  goLiveMyEvent: (eventId, data) => request.put(`/admin/expert/update/${eventId}`, data),
};

export default expertEventService;
