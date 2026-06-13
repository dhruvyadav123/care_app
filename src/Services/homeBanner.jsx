// src/Services/homeBannersService.js

import service from "./request"; // This is your axios instance (already defined)

const homeBannersService = {
  getAll: (params) => service.get('/dashBoardBanner1', { params }),
  add: (data) => service.post('/dashBoardBanner1', data),
  delete: (id) => service.delete(`/dashBoardBanner1/${id}`),
  edit: (id, data) => service.put(`/dashBoardBanner1/${id}`, data),
};

export default homeBannersService;