// import request from "./request";

// const usersService = {
//   getAll: (params) => request.get("/admin/getAllUsers", { params }),
//   updateStatus: (id, status) => request.put(`/admin/updateUserStatus/${id}`, status),
//   searchUsers: (query) => request.get(`/admin/search?query=${query}`)
// };

// export default usersService;

import request from "./request";

const usersService = {
  // Get all users with optional filters
  getAllUsers: (params) => request.get('/admin/getAllUsers', { params }),
  
  // Update user status by ID
  updateUserStatus: (id, data) => request.put(`/admin/updateUserStatus/${id}`, data),

  // Search users by query
  searchUsers: (query) => request.get(`/admin/search?query=${query}`),
};

export default usersService;