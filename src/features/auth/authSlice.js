import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../../Services/authService";
import { normalizeApiError } from "../../Utils/errorHandler";
import { clearStoredAuth, getStoredAuth, persistAuth, syncLegacySessionKeys } from "../../Utils/storage";

const persistedSession = getStoredAuth();

const initialState = {
  user: persistedSession?.user || null,
  token: persistedSession?.token || null,
  role: persistedSession?.role || null,
  avatar: persistedSession?.avatar || "",
  isAuthenticated: Boolean(persistedSession?.token),
  status: "idle",
  error: null,
  successMessage: null,
  initialized: true,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      return await authService.login(credentials);
    } catch (error) {
      return rejectWithValue(normalizeApiError(error));
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { getState }) => {
    const role = getState()?.auth?.role;

    try {
      await authService.logout(role);
    } catch (error) {
      // We still clear the local session even if the server logout fails.
    }

    clearStoredAuth();
    syncLegacySessionKeys(null);
    return true;
  }
);

const persistSession = (state) => {
  const session = {
    user: state.user,
    token: state.token,
    role: state.role,
    avatar: state.avatar,
  };

  persistAuth(session);
  syncLegacySessionKeys(session);
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      const payload = action.payload || {};

      state.user = payload.user || null;
      state.token = payload.token || null;
      state.role = payload.role || null;
      state.avatar = payload.avatar || payload.user?.avatar || payload.user?.avtar || "";
      state.isAuthenticated = Boolean(payload.token);
      state.status = "succeeded";
      state.error = null;
      state.successMessage = null;
      state.initialized = true;
      persistSession(state);
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    clearAuthSuccess: (state) => {
      state.successMessage = null;
    },
    hydrateSession: (state) => {
      const session = getStoredAuth();

      state.user = session?.user || null;
      state.token = session?.token || null;
      state.role = session?.role || null;
      state.avatar = session?.avatar || "";
      state.isAuthenticated = Boolean(session?.token);
      state.initialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.successMessage = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.avatar = action.payload.avatar || "";
        state.isAuthenticated = true;
        state.error = null;
        state.successMessage = "Login successful.";
        persistSession(state);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || { message: "Login failed." };
        state.successMessage = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.role = null;
        state.avatar = "";
        state.isAuthenticated = false;
        state.status = "idle";
        state.error = null;
        state.successMessage = null;
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.role = null;
        state.avatar = "";
        state.isAuthenticated = false;
        state.status = "idle";
      });
  },
});

export const { setLogin, clearAuthError, clearAuthSuccess, hydrateSession } = authSlice.actions;
export default authSlice.reducer;
