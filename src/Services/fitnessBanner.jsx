import request from './request';

const fitnessService = {
  getAll: (params) => request.get('/dashBoardBanner1', { params }),
  add: (data) => request.post('/dashBoardBanner1', data),
  edit: (id, data) => request.put(`/dashBoardBanner1/${id}`, data),
  delete: (id) => request.delete(`/dashBoardBanner1/${id}`), 
  getAll1: (params) => request.get('/dashBoardBanner2', { params }),
  add1: (data) => request.post('/dashBoardBanner2', data),
  edit1: (id, data) => request.put(`/dashBoardBanner2/${id}`, data),
  delete1: (id) => request.delete(`/dashBoardBanner2/${id}`), 
  getAll2: (params) => request.get('/dashBoardBanner3', { params }),
  add2: (data) => request.post('/dashBoardBanner3', data),
  edit2: (id, data) => request.put(`/dashBoardBanner3/${id}`, data),
  delete2: (id) => request.delete(`/dashBoardBanner3/${id}`), 
};

export default fitnessService;
