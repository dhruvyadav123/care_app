import { MAP_API_KEY } from './AppConstant';

export const GOOGLE_MAP_LIBRARIES = ['drawing', 'geometry', 'places'];

export const GOOGLE_MAP_LOADER_OPTIONS = {
  id: 'google-map-script',
  googleMapsApiKey: MAP_API_KEY,
  libraries: GOOGLE_MAP_LIBRARIES,
};
