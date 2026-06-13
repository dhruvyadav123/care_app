import request from "./request";

const STORY_BASE = "/admin/story";
const multipartConfig = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

const storyService = {
  getAll: (params) => request.get(STORY_BASE, { params }),
  add: (data) => request.post(STORY_BASE, data, multipartConfig),
  edit: async (id, data) => {
    try {
      return await request.put(`${STORY_BASE}/${id}`, data, multipartConfig);
    } catch (error) {
      const status = error?.response?.status;

      if (status === 404 || status === 405) {
        return request.patch(`${STORY_BASE}/${id}`, data, multipartConfig);
      }

      throw error;
    }
  },
  delete: (id) => request.delete(`${STORY_BASE}/${id}`),
};

export default storyService;
