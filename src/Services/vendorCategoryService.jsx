import request from './request';

const vendorCategoryService = {
  getAll: (params) => request.get('/fitness/videoCategory', { params }),
};

export default vendorCategoryService;
