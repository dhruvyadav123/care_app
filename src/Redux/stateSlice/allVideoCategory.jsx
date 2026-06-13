import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import service from "../../Services/request";

const normalizeVideoCategories = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.videoCategories)) {
    return response.videoCategories;
  }

  if (Array.isArray(response?.categories)) {
    return response.categories;
  }

  if (Array.isArray(response?.data?.videoCategories)) {
    return response.data.videoCategories;
  }

  if (Array.isArray(response?.data?.categories)) {
    return response.data.categories;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  return [];
};

export const fetchVideoCategories = createAsyncThunk(
  "videoCategory/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await service.get("/fitness/videoCategory");
      return normalizeVideoCategories(response);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.msg ||
          error.message ||
          "Something went wrong"
      );
    }
  }
);

const videoCategorySlice = createSlice({
  name: "videoCategory",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideoCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideoCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchVideoCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default videoCategorySlice.reducer;
