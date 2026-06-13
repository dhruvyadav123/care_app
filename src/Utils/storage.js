const AUTH_STORAGE_KEY = "care-app-auth";

const isBrowser = typeof window !== "undefined";

export const storageKeys = {
  auth: AUTH_STORAGE_KEY,
};

export const getStoredAuth = () => {
  if (!isBrowser) {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch (error) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export const persistAuth = (authState) => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
};

export const clearStoredAuth = () => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const getStoredToken = () => getStoredAuth()?.token || null;

export const syncLegacySessionKeys = (session) => {
  if (!isBrowser) {
    return;
  }

  if (!session?.token) {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("authenticated");
    window.localStorage.removeItem("login");
    window.localStorage.removeItem("profileURL");
    window.localStorage.removeItem("Name");
    window.localStorage.removeItem("userRole");
    return;
  }

  window.localStorage.setItem("token", session.token);
  window.localStorage.setItem("authenticated", "true");
  window.localStorage.setItem("login", "true");
  window.localStorage.setItem("profileURL", session.avatar || "");
  window.localStorage.setItem("Name", session.user?.name || "");
  window.localStorage.setItem("userRole", session.role || "");
};

