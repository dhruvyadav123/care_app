import axios from "axios";
import { API_URL } from "../../Config/AppConstant";

const initialState = {
  loading: false,
  vendors: [],
  error: null,
  deleteLoading: false,
  editLoading: false,
  pagination: {},
};

// Action types
const FETCH_VENDORS_REQUEST = "FETCH_VENDORS_REQUEST";
const FETCH_VENDORS_SUCCESS = "FETCH_VENDORS_SUCCESS";
const FETCH_VENDORS_FAILURE = "FETCH_VENDORS_FAILURE";
const DELETE_VENDOR_REQUEST = "DELETE_VENDOR_REQUEST";
const DELETE_VENDOR_SUCCESS = "DELETE_VENDOR_SUCCESS";
const DELETE_VENDOR_FAILURE = "DELETE_VENDOR_FAILURE";
const EDIT_VENDOR_REQUEST = "EDIT_VENDOR_REQUEST";
const EDIT_VENDOR_SUCCESS = "EDIT_VENDOR_SUCCESS";
const EDIT_VENDOR_FAILURE = "EDIT_VENDOR_FAILURE";
const STATUS_VENDOR_REQUEST = "STATUS_VENDOR_REQUEST";
const STATUS_VENDOR_SUCCESS = "STATUS_VENDOR_SUCCESS";
const STATUS_VENDOR_FAILURE = "STATUS_VENDOR_FAILURE";

const SEARCH_VENDOR_REQUEST = "SEARCH_VENDOR_REQUEST";
const SEARCH_VENDOR_SUCCESS = "SEARCH_VENDOR_SUCCESS";
const SEARCH_VENDOR_FAILURE = "SEARCH_VENDOR_FAILURE";

// Action: Search users
export const searchVendor = (query) => async (dispatch) => {
  dispatch({ type: SEARCH_VENDOR_REQUEST });

  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${API_URL}/fitness/fitnessExpert/search?query=${query}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    dispatch({ type: SEARCH_VENDOR_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: SEARCH_VENDOR_FAILURE, payload: error.message });
  }
};

// Fetch vendors - FIXED VERSION
export const fetchVendors = (page = 1, limit = 10, filters = null) => async (dispatch) => {
  dispatch({ type: FETCH_VENDORS_REQUEST });
  try {
    const token1 = localStorage.getItem("token");
    if (!token1) {
      throw new Error("No token found. Please log in again.");
    }
    
    // Build query parameters
    let url = `${API_URL}/fitness/fitnessExpert?page=${page}&limit=${limit}`;
    
    // Add category filter if provided
    if (filters && filters.category) {
      url += `&category=${filters.category}`;
    }
    
    const { data } = await axios.get(url, {
      headers: { Authorization: `Bearer ${token1}` },
    });
    
    dispatch({ type: FETCH_VENDORS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_VENDORS_FAILURE, payload: error.message });
  }
};

// Delete vendor
export const deleteVendor = (id) => async (dispatch) => {
  dispatch({ type: DELETE_VENDOR_REQUEST });
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`${API_URL}/fitness/fitnessExpert/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    dispatch({ type: DELETE_VENDOR_SUCCESS, payload: id });
  } catch (error) {
    dispatch({ type: DELETE_VENDOR_FAILURE, payload: error.message });
  }
};

// Edit vendor
export const editVendor = (id, updatedData) => async (dispatch) => {
  dispatch({ type: EDIT_VENDOR_REQUEST });
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.patch(`${API_URL}/fitness/fitnessExpert/${id}`, updatedData, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    dispatch({ type: EDIT_VENDOR_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: EDIT_VENDOR_FAILURE, payload: error.message });
  }
};

// changeFitnessExpertsStatus by admin
export const changeVendorStatus = (status, id) => async (dispatch) => {
  dispatch({ type: STATUS_VENDOR_REQUEST });
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.patch(`${API_URL}/fitness/fitnessExpertStatus/${id}`, {status}, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    dispatch({ type: STATUS_VENDOR_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: STATUS_VENDOR_FAILURE, payload: error.message });
  }
};

// Reducer
export const vendorReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch vendors
    case FETCH_VENDORS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_VENDORS_SUCCESS:
      return {
        ...state,
        loading: false,
        vendors: Array.isArray(action.payload.experts)
          ? action.payload.experts
          : [],
        pagination: action.payload.pagination || {},
        error: null,
      };
    case FETCH_VENDORS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Delete vendor
    case DELETE_VENDOR_REQUEST:
      return { ...state, deleteLoading: true };
    case DELETE_VENDOR_SUCCESS:
      return {
        ...state,
        deleteLoading: false,
        vendors: Array.isArray(state.vendors)
          ? state.vendors.filter((vendor) => vendor._id !== action.payload)
          : [],
      };
    case DELETE_VENDOR_FAILURE:
      return { ...state, deleteLoading: false, error: action.payload };

    // Edit vendor
    case EDIT_VENDOR_REQUEST:
      return { ...state, editLoading: true };
    case EDIT_VENDOR_SUCCESS:
      return {
        ...state,
        editLoading: false,
        vendors: Array.isArray(action.payload.experts)
          ? action.payload.experts
          : [],
        pagination: action.payload.pagination || {},
      };
    case EDIT_VENDOR_FAILURE:
      return { ...state, editLoading: false, error: action.payload };
    
    // Search users
    case SEARCH_VENDOR_REQUEST:
      return { ...state, loading: true, error: null };
    case SEARCH_VENDOR_SUCCESS:
      return {
        ...state,
        loading: false,
        vendors: action.payload.data,
        pagination: action.payload.pagination || {},
        error: null,
      };
    case SEARCH_VENDOR_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
