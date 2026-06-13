import request from './request';

const buildFreshParams = (params = {}) => ({
  ...params,
  _ts: Date.now(),
});

const logEventsApiRequest = () => {
  if (typeof window === "undefined") {
    return;
  }

  const role = window.localStorage.getItem("userRole") || "unknown";
  console.info("[Events API] GET /api/admin/expert/my-events", { role });
};

const EventService = {
  getAll: (params) => {
    logEventsApiRequest();

    return request.get('/admin/expert/my-events', {
      params: buildFreshParams(params),
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  },
  create: (data) => request.post('/admin/expert/createEvent', data),
  update: (id, data) => request.put(`/admin/expert/update/${id}`, data),
  delete: (id) => request.delete(`/admin/expert/delete/${id}`)

};

export default EventService;
