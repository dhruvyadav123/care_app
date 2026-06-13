import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import usersService from "../../Services/users";

const initialState = {
  loading: false,
  allUsers: [],
  error: "",
  params: {
    page: 1,
    limit: 10,
  },
  pagination: {},
  meta: {},
  searchQuery: "",
};

export const fetchUsersNew = createAsyncThunk("user/fetchUsers", async (params = {}) => {
  try {
    const response = await usersService.getAll({ ...initialState.params, ...params });
    return response;
  } catch (error) {
    throw error;
  }
});

export const searchUsers = createAsyncThunk("user/searchUsers", async (query) => {
  try {
    const response = await usersService.searchUsers(query);
    return response;
  } catch (error) {
    throw error;
  }
});

// Async thunk to toggle user status
export const toggleUserStatus = createAsyncThunk(
  "user/toggleUserStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      await usersService.updateStatus(id, { status });
      return { id, status };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const userSliceNew = createSlice({
  name: "user",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersNew.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsersNew.fulfilled, (state, action) => {
        const { payload } = action;
        state.loading = false;
        state.allUsers = payload.users;
        state.pagination = payload.pagination;
        state.params.page = payload.pagination.currentPage;
        state.params.limit = payload.pagination.limit;
        state.error = "";
      })
      .addCase(fetchUsersNew.rejected, (state, action) => {
        state.loading = false;
        state.allUsers = [];
        state.error = action.error.message;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        const { payload } = action;
        state.loading = false;
        state.allUsers = payload.users;
        state.pagination = payload.pagination;
        state.error = "";
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.allUsers = [];
        state.error = action.error.message;
      })
      .addCase(toggleUserStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const userIndex = state.allUsers.findIndex((user) => user._id === action.payload.id);
        if (userIndex !== -1) {
          state.allUsers[userIndex].status = action.payload.status;
        }
        state.loading = false;
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default userSliceNew.reducer;
