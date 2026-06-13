

import service from "./request";
const SocialMeetCategoryService = {
  getAll: (params) => service.get('/getCategory', { params }),
};

export default SocialMeetCategoryService;