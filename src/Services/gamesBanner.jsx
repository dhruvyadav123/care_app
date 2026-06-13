// gameService.js
import request from './request';

const gameService = {
  getAll: (params) => request.get('/admin/getAllGames', { params }),
  delete: (id) => request.delete(`/admin/deleteGame/${id}`),
  edit: (id, updatedData) => request.put(`/admin/updateGame/${id}`, updatedData),
  add: (newGame) => request.post('/admin/createGame', newGame),
};

export default gameService;
