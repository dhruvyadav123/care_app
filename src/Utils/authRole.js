import authService from "../Services/authService";
import { normalizeRole, ROLES } from "../constants/roles";
import { getStoredAuth } from "../Utils/storage";

export const USER_ROLES = ROLES;

export { normalizeRole };

export const getStoredUserRole = () => normalizeRole(getStoredAuth()?.role || localStorage.getItem("userRole")) || ROLES.ADMIN;

export const getDashboardPath = (role, layout = "Admin") => authService.getDashboardPath(role, layout);

export const resolveAvatarUrl = (avatar, fallback = "") => authService.resolveAvatarUrl(avatar, fallback);
