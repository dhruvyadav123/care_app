import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import vendorCategoryService from "../../Services/vendorCategoryService";

// Fetch fitness categories
export const fetchFitnessCategories = createAsyncThunk(
  "fitnessCategory/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await vendorCategoryService.get("/fitness/fitnessCategory");
      console.log(" Fetch Success: Fitness Categories Data", response);

      return response?.data?.services || []; // Ensure correct structure
    } catch (error) {
      console.error(" Fetch Failed:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

const fitnessCategorySlice = createSlice({
  name: "fitnessCategory",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFitnessCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFitnessCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload || []; // Ensure payload is correctly assigned
      })
      .addCase(fetchFitnessCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default fitnessCategorySlice.reducer;
