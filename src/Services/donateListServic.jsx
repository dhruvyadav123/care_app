import request from './request';

const DonateService = {
  getAll: (params) => request.get('/donationItems', { params }),
  create: (data) => request.post('/donationCategory', data),
  delete: (id) => request.delete(`/donationItems/${id}`),
  delete2: (id) => request.delete(`/donationCategory/${id}`),
  update: async (id, data) => {
    try {
      return await request.put(`/donationCategory/${id}`, data);
    } catch (error) {
      const status = error?.response?.status;

      if (status === 404 || status === 405) {
        return request.patch(`/donationCategory/${id}`, data);
      }

      throw error;
    }
  },
  getAll2: (params) => request.get('/donationCategory', { params }),
};

export default DonateService;
