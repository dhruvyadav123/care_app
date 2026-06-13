import axios from "axios";
import { API_URL } from "../Config/AppConstant";
import { DEFAULT_LOGIN_ROLE, normalizeRole, ROLE_AUTH_CONFIG, ROLE_REDIRECTS, ROLES } from "../constants/roles";
import { normalizeApiError } from "../Utils/errorHandler";
import { clearStoredAuth, getStoredToken } from "../Utils/storage";

const REQUEST_TIMEOUT = 16000;
const DEV_API_URL = process.env.REACT_APP_DEV_API_URL || "http://172.104.206.4:5000/api";

const isLocalDevelopmentHost = () => {
  if (typeof window === "undefined") {
    return false;
  }

  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
};

const resolveAuthBaseUrl = () => (isLocalDevelopmentHost() ? DEV_API_URL : API_URL);

export const authApi = axios.create({
  baseURL: resolveAuthBaseUrl(),
  timeout: REQUEST_TIMEOUT,
});

authApi.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    const requestUrl = String(config?.url || "");
    const isLoginRequest = requestUrl.includes("/login");

    if (token && !isLoginRequest) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  (error) => Promise.reject(normalizeApiError(error))
);

authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = normalizeApiError(error);

    if (normalizedError.status === 401) {
      clearStoredAuth();
    }

    return Promise.reject(normalizedError);
  }
);

const getUserFromResponse = (responseData, config) =>
  config.responseUserKeys.reduce((resolvedUser, key) => resolvedUser || responseData?.[key], null);

export const resolveAvatarUrl = (avatar, fallback = "") => {
  if (!avatar) {
    return fallback;
  }

  if (/^https?:\/\//i.test(avatar) || avatar.startsWith("data:")) {
    return avatar;
  }

  const baseUrl = String(API_URL || "").replace(/\/api\/?$/, "");
  return `${baseUrl}${avatar.startsWith("/") ? "" : "/"}${avatar}`;
};

const normalizeAuthPayload = (response, config) => {
  const responseData = response?.data || {};
  const user = getUserFromResponse(responseData, config);
  const role = normalizeRole(responseData?.role || user?.role || config.role) || config.role;
  const token = responseData?.token || responseData?.accessToken;

  if (!user || !token) {
    throw normalizeApiError(
      { response: { data: { message: "Invalid authentication response." }, status: 500 } },
      "Invalid authentication response."
    );
  }

  return {
    token,
    role,
    user,
    avatar: resolveAvatarUrl(user?.avatar || user?.avtar || user?.profileImage || ""),
  };
};

const shouldFallbackToNextRole = (error) => error?.isAuthFailure && !error?.isNetworkError;

const authenticateWithRole = async (credentials, role) => {
  const config = ROLE_AUTH_CONFIG[role];
  const response = await authApi.post(config.endpoint, credentials);
  return normalizeAuthPayload(response, config);
};

const getAttemptOrder = (preferredRole = DEFAULT_LOGIN_ROLE) => {
  if (preferredRole && preferredRole !== DEFAULT_LOGIN_ROLE) {
    return [preferredRole];
  }

  return [ROLES.ADMIN, ROLES.EXPERT];
};

export const getDashboardPath = (role, layout = "Admin") => {
  const normalizedRole = normalizeRole(role) || ROLES.ADMIN;
  const redirectBase = ROLE_REDIRECTS[normalizedRole] || ROLE_REDIRECTS[ROLES.ADMIN];
  const publicBasePath = String(process.env.PUBLIC_URL || "").replace(/\/+$/, "");

  return `${publicBasePath}${redirectBase}`;
};

const login = async ({ email, password, preferredRole = DEFAULT_LOGIN_ROLE }) => {
  const credentials = {
    email: String(email || "").trim(),
    password: String(password || ""),
  };

  const attempts = getAttemptOrder(preferredRole);
  let lastError = null;

  for (const role of attempts) {
    try {
      return await authenticateWithRole(credentials, role);
    } catch (error) {
      lastError = error;

      if (!shouldFallbackToNextRole(error) || role === attempts[attempts.length - 1]) {
        throw error;
      }
    }
  }

  throw lastError || new Error("Login failed.");
};

const logout = async (role) => {
  if (normalizeRole(role) === ROLES.EXPERT) {
    await authApi.post("/admin/expert/logout", {});
  }
};

const authService = {
  login,
  logout,
  getDashboardPath,
  resolveAvatarUrl,
};

export default authService;
