import request from './request';

const MemberListService = {
  getAll: (params) => request.get('/dashBoardBanner2', { params }),

};

export default MemberListService;
