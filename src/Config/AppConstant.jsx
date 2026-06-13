export const PROJECT_NAME = 'Care App';

const trimEnvValue = (value) => (typeof value === 'string' ? value.trim() : '');
const rawApiUrl = trimEnvValue(process.env.REACT_APP_API_URL);
const rawDevApiUrl =
  trimEnvValue(process.env.REACT_APP_DEV_API_URL) ||
  rawApiUrl ||
  'http://172.104.206.4:5000/api';
const normalizedApiUrl = rawApiUrl.replace(/\/+$/, '');
const normalizedDevApiUrl = rawDevApiUrl.replace(/\/+$/, '');
const derivedBaseUrl = normalizedApiUrl.endsWith('/api')
  ? normalizedApiUrl.replace(/\/api$/, '')
  : normalizedApiUrl;
const resolvedApiUrl = normalizedApiUrl
  ? normalizedApiUrl.endsWith('/api')
    ? normalizedApiUrl
    : `${normalizedApiUrl}/api`
  : `${derivedBaseUrl}/api`;

export const isLocalDevelopmentHost = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1';
};

export const DEV_API_URL = normalizedDevApiUrl.endsWith('/api')
  ? normalizedDevApiUrl
  : `${normalizedDevApiUrl}/api`;

export const resolveApiUrl = () => (isLocalDevelopmentHost() ? DEV_API_URL : resolvedApiUrl);

export const resolveBaseUrl = () => {
  const activeApiUrl = resolveApiUrl();
  return activeApiUrl.endsWith('/api') ? activeApiUrl.replace(/\/api$/, '') : activeApiUrl;
};

export const BASE_URL = derivedBaseUrl;
export const API_URL = resolvedApiUrl;
export const IMG_URL = BASE_URL;
export const MAP_API_KEY = trimEnvValue(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
export const COUNTRY_CODE = 'IN';
export const LOCAL_PATH = BASE_URL;
export const LOCAL_URL = API_URL;
