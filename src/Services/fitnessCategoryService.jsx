import service from './request';

const fitnessCategoryService = {
  getAll: (params = {}) => service.get('/fitness/fitnessCategory', { params }),
};

export default fitnessCategoryService;
