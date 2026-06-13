import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../Config/AppConstant";

const DEV_API_URL = process.env.REACT_APP_DEV_API_URL || "http://172.104.206.4:5000/api";

const resolveProductApiBase = () => {
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

const getProductCollection = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.products)) {
    return payload.products;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.data?.products)) {
    return payload.data.products;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  return [];
};

const getPaginationMeta = (payload, fallbackLength) => {
  const pagination = payload?.pagination || payload?.meta || payload?.data?.pagination || payload?.data?.meta;

  if (pagination) {
    return pagination;
  }

  return {
    totalProducts: fallbackLength,
    currentPage: 1,
    totalPages: 1,
  };
};

const getProductEntity = (payload) =>
  payload?.product || payload?.data?.product || payload?.data || payload;

const getProductErrorMessage = (error, fallbackMessage) =>
  error?.response?.data?.msg ||
  error?.response?.data?.message ||
  error?.message ||
  fallbackMessage;

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${resolveProductApiBase()}/service/products?page=${page}&limit=${limit}`, {
        headers: getAuthHeader(),
      });

      const products = getProductCollection(response.data);

      return {
        products,
        pagination: getPaginationMeta(response.data, products.length),
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Unable to fetch products");
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${resolveProductApiBase()}/service/createProduct`, payload, {
        headers: getAuthHeader(),
      });

      return getProductEntity(response.data);
    } catch (error) {
      return rejectWithValue(getProductErrorMessage(error, "Unable to create product"));
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ productId, payload }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${resolveProductApiBase()}/service/product/${productId}`, payload, {
        headers: getAuthHeader(),
      });

      return {
        productId,
        product: getProductEntity(response.data),
      };
    } catch (error) {
      return rejectWithValue(getProductErrorMessage(error, "Unable to update product"));
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await axios.delete(`${resolveProductApiBase()}/service/product/${productId}`, {
        headers: getAuthHeader(),
      });

      return productId;
    } catch (error) {
      return rejectWithValue(getProductErrorMessage(error, "Unable to delete product"));
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    pagination: null,
    loading: false,
    submitting: false,
    error: null,
  },
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to fetch products";
      })
      .addCase(createProduct.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.submitting = false;
        state.products = action.payload?._id ? [action.payload, ...state.products] : state.products;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || "Unable to create product";
      })
      .addCase(updateProduct.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.submitting = false;
        state.products = state.products.map((product) =>
          product?._id === action.payload.productId
            ? { ...product, ...(action.payload.product || {}) }
            : product
        );
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || "Unable to update product";
      })
      .addCase(deleteProduct.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.submitting = false;
        state.products = state.products.filter((product) => product?._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || "Unable to delete product";
      });
  },
});

export const { clearProductError } = productSlice.actions;
export const productReducer = productSlice.reducer;
export default productSlice.reducer;
