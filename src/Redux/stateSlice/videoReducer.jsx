import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import VideoService from "../../Services/videoService";

// Async Thunk for fetching fitness videos
export const fetchFitnessVideos = createAsyncThunk(
  "fitnessVideos/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const response = await VideoService.getAll(params);
      console.log("This is full response data of fitness:", response);

      // Ensure videoCategories is correctly extracted
      return response.videoCategories || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const fitnessVideoSlice = createSlice({
  name: "fitnessVideos",
  initialState: {
    videos: [], // This should hold the videoCategories array
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFitnessVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFitnessVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload; // Now correctly storing videoCategories
      })
      .addCase(fetchFitnessVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default fitnessVideoSlice.reducer;
