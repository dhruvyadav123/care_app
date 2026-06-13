 // Import the configured Axios instance
 import request from './request';

const ClassServices = {
  getAll: (params) => request.get("/onlineClass", { params }),
};

export default ClassServices;
