import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import expertService from "../../Services/expertService";

const getExpertCollection = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.experts)) {
    return payload.experts;
  }

  if (Array.isArray(payload?.yogaExperts)) {
    return payload.yogaExperts;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.data?.experts)) {
    return payload.data.experts;
  }

  if (Array.isArray(payload?.data?.yogaExperts)) {
    return payload.data.yogaExperts;
  }

  if (Array.isArray(payload?.data?.data)) {
    return payload.data.data;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  return [];
};

const getPaginationMeta = (payload, fallbackLength) => {
  const source = payload?.pagination || payload?.meta || payload?.data?.pagination || payload?.data?.meta;

  if (source) {
    return source;
  }

  return {
    totalExperts: fallbackLength,
    currentPage: 1,
    totalPages: 1,
  };
};

export const fetchExperts = createAsyncThunk(
  "experts/fetchExperts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await expertService.getAllExperts(params);
      const experts = getExpertCollection(response);

      return {
        experts,
        pagination: getPaginationMeta(response, experts.length),
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Unable to fetch experts");
    }
  }
);

export const createExpert = createAsyncThunk(
  "experts/createExpert",
  async (payload, { rejectWithValue }) => {
    try {
      return await expertService.createExpert(payload);
    } catch (error) {
      return rejectWithValue(error.response?.data || "Unable to create expert");
    }
  }
);

export const updateExpert = createAsyncThunk(
  "experts/updateExpert",
  async ({ expertId, payload }, { rejectWithValue }) => {
    try {
      const response = await expertService.updateExpert(expertId, payload);
      return { expertId, response, payload };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Unable to update expert");
    }
  }
);

export const updateExpertStatus = createAsyncThunk(
  "experts/updateExpertStatus",
  async ({ expertId, status }, { rejectWithValue }) => {
    try {
      const response = await expertService.updateExpert(expertId, { status });
      return { expertId, response, status };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Unable to update expert status");
    }
  }
);

export const deleteExpert = createAsyncThunk(
  "experts/deleteExpert",
  async (expertId, { rejectWithValue }) => {
    try {
      await expertService.deleteExpert(expertId);
      return expertId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Unable to delete expert");
    }
  }
);

const expertSlice = createSlice({
  name: "experts",
  initialState: {
    experts: [],
    pagination: null,
    loading: false,
    submitting: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExperts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExperts.fulfilled, (state, action) => {
        state.loading = false;
        state.experts = action.payload.experts;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchExperts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to fetch experts";
      })
      .addCase(createExpert.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createExpert.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(createExpert.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || "Unable to create expert";
      })
      .addCase(updateExpert.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateExpert.fulfilled, (state, action) => {
        state.submitting = false;
        state.experts = state.experts.map((expert) => {
          if (expert?._id !== action.payload.expertId) {
            return expert;
          }

          return {
            ...expert,
            ...action.payload.payload,
            ...(action.payload.response?.expert || action.payload.response?.data || {}),
          };
        });
      })
      .addCase(updateExpert.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || "Unable to update expert";
      })
      .addCase(updateExpertStatus.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateExpertStatus.fulfilled, (state, action) => {
        state.submitting = false;
        state.experts = state.experts.map((expert) =>
          expert?._id === action.payload.expertId
            ? {
                ...expert,
                status: action.payload.response?.expert?.status || action.payload.response?.data?.status || action.payload.status,
              }
            : expert
        );
      })
      .addCase(updateExpertStatus.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || "Unable to update expert status";
      })
      .addCase(deleteExpert.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(deleteExpert.fulfilled, (state, action) => {
        state.submitting = false;
        state.experts = state.experts.filter((expert) => expert?._id !== action.payload);
      })
      .addCase(deleteExpert.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || "Unable to delete expert";
      });
  },
});

export const expertReducer = expertSlice.reducer;
export default expertSlice.reducer;
