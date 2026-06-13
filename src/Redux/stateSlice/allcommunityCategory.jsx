import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import getCategoryService from "../../Services/getCategoryService";

export const fetchCommunityCategories = createAsyncThunk(
  "getCategory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCategoryService.getAll();

      return {
        categories: response?.categories || [],
        notificationCount: response?.notificationCount || 0,
      };
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue("Unauthorized - please login again");
      }

      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.msg ||
          error.message ||
          "Failed to load categories"
      );
    }
  }
);

const communityCategorySlice = createSlice({
  name: "getCategory",
  initialState: {
    categories: [],
    notificationCount: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommunityCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommunityCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload?.categories || [];
        state.notificationCount = action.payload?.notificationCount || 0;
      })
      .addCase(fetchCommunityCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default communityCategorySlice.reducer;
