import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import SocialMeetCategoryService from "../../Services/socialMeetCategoryService";

// Async thunk to fetch categories
export const fetchSocialMeetCategories = createAsyncThunk(
  "socialMeetCategories/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const response = await SocialMeetCategoryService.getAll(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

const socialMeetCategoriesSlice = createSlice({
  name: "socialMeetCategories",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSocialMeetCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSocialMeetCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchSocialMeetCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default socialMeetCategoriesSlice.reducer;
