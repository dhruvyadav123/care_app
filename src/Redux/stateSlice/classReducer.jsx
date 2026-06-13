import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ClassServices from "../../Services/classService";

// Fetch all classes
export const fetchClasses = createAsyncThunk(
  "class/fetchClasses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ClassServices.getAll();
      console.log("Fetched Classes:", response);
      return response || [];
    } catch (error) {
      console.error("Error fetching classes:", error);
      return rejectWithValue(error.response?.data || "Error fetching classes");
    }
  }
);

const classSlice = createSlice({
  name: "class",
  initialState: {
    classes: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default classSlice.reducer;
