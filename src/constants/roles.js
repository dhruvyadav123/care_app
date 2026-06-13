export const ROLES = {
  ADMIN: "admin",
  EXPERT: "expert",
};

export const ROLE_OPTIONS = [
  { value: "auto", label: "Auto detect" },
  { value: ROLES.ADMIN, label: "Admin" },
  { value: ROLES.EXPERT, label: "Expert" },
];

export const ROLE_REDIRECTS = {
  [ROLES.ADMIN]: "/dashboard/default",
  [ROLES.EXPERT]: "/expert/dashboard",
};

export const ROLE_AUTH_CONFIG = {
  [ROLES.ADMIN]: {
    role: ROLES.ADMIN,
    endpoint: "/admin/login",
    responseUserKeys: ["user", "admin"],
  },
  [ROLES.EXPERT]: {
    role: ROLES.EXPERT,
    endpoint: "/admin/expert/login",
    responseUserKeys: ["expert", "user"],
  },
};

export const DEFAULT_LOGIN_ROLE = ROLE_OPTIONS[0].value;

export const normalizeRole = (value) => {
  const normalized = String(value || "").trim().toLowerCase();

  return Object.values(ROLES).includes(normalized) ? normalized : null;
};

