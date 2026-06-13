import request from './request';

const videoCategoryService = {
  getAll: (params) => request.get('/fitness/videoCategory', { params }),
};

export default videoCategoryService;
