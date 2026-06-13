import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../Config/AppConstant";

const DEV_API_URL = process.env.REACT_APP_DEV_API_URL || "http://172.104.206.4:5000/api";

const resolveOrderApiBase = () => {
  if (typeof window === "undefined") {
    return API_URL;
  }

  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1" ? DEV_API_URL : API_URL;
};

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getOrdersCollection = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.orders)) {
    return payload.orders;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  return [];
};

const getPaginationMeta = (payload, fallbackLength) => ({
  total: payload?.total || payload?.pagination?.total || fallbackLength,
  page: payload?.page || payload?.pagination?.page || 1,
  totalPages: payload?.totalPages || payload?.pagination?.totalPages || 1,
});

const getOrderErrorMessage = (error, fallbackMessage) =>
  error?.response?.data?.message || error?.response?.data?.msg || error?.message || fallbackMessage;

export const fetchOrderStatuses = createAsyncThunk(
  "orderStatuses/fetchOrderStatuses",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${resolveOrderApiBase()}/admin/service/orders?page=${page}&limit=${limit}`, {
        headers: getAuthHeader(),
      });

      const orders = getOrdersCollection(response.data);

      return {
        orders,
        pagination: getPaginationMeta(response.data, orders.length),
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.response?.data?.msg || "Unable to fetch order status"
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orderStatuses/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${resolveOrderApiBase()}/service/order/${orderId}`,
        { status },
        {
          headers: {
            ...getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );

      return {
        orderId,
        status,
        order: response?.data?.order || response?.data?.data || response?.data,
      };
    } catch (error) {
      return rejectWithValue(getOrderErrorMessage(error, "Unable to update order status"));
    }
  }
);

const orderStatusSlice = createSlice({
  name: "orderStatuses",
  initialState: {
    orders: [],
    pagination: null,
    loading: false,
    submitting: false,
    error: null,
  },
  reducers: {
    clearOrderStatusError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderStatuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderStatuses.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchOrderStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to fetch order status";
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.submitting = false;
        state.orders = state.orders.map((order) =>
          order?._id === action.payload.orderId
            ? {
                ...order,
                ...(action.payload.order && typeof action.payload.order === "object" ? action.payload.order : {}),
                status: action.payload.order?.status || action.payload.status,
              }
            : order
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || "Unable to update order status";
      });
  },
});

export const { clearOrderStatusError } = orderStatusSlice.actions;
export const orderStatusReducer = orderStatusSlice.reducer;
export default orderStatusSlice.reducer;
