import { MAP_API_KEY } from '../../../Config/AppConstant';

const getMapApiKey = () => { 
  const envMapApiKey = MAP_API_KEY;
  return envMapApiKey;
};

export default getMapApiKey;
