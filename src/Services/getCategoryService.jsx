import request from './request';

const getCategoryService = {
  getAll: () => request.get('/getCategory'),
};

export default getCategoryService;
