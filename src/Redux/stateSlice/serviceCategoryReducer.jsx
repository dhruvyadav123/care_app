import axios from "axios";
import { API_URL } from "../../Config/AppConstant";

const DEV_API_URL = process.env.REACT_APP_DEV_API_URL || "http://172.104.206.4:5000/api";

const resolveCategoryApiBase = () => {
  if (typeof window === "undefined") {
    return API_URL;
  }

  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1" ? DEV_API_URL : API_URL;
};

const initialState = {
  loading: false,
  serviceCategories: [],
  error: null,
  deleteLoading: false,
  editLoading: false,
  addLoading: false,
  pagination: {},
  activeType: "product",
};

const FETCH_SERVICE_CATEGORIES_REQUEST = "FETCH_SERVICE_CATEGORIES_REQUEST";
const FETCH_SERVICE_CATEGORIES_SUCCESS = "FETCH_SERVICE_CATEGORIES_SUCCESS";
const FETCH_SERVICE_CATEGORIES_FAILURE = "FETCH_SERVICE_CATEGORIES_FAILURE";
const DELETE_SERVICE_CATEGORY_REQUEST = "DELETE_SERVICE_CATEGORY_REQUEST";
const DELETE_SERVICE_CATEGORY_SUCCESS = "DELETE_SERVICE_CATEGORY_SUCCESS";
const DELETE_SERVICE_CATEGORY_FAILURE = "DELETE_SERVICE_CATEGORY_FAILURE";
const EDIT_SERVICE_CATEGORY_REQUEST = "EDIT_SERVICE_CATEGORY_REQUEST";
const EDIT_SERVICE_CATEGORY_SUCCESS = "EDIT_SERVICE_CATEGORY_SUCCESS";
const EDIT_SERVICE_CATEGORY_FAILURE = "EDIT_SERVICE_CATEGORY_FAILURE";
const ADD_SERVICE_CATEGORY_REQUEST = "ADD_SERVICE_CATEGORY_REQUEST";
const ADD_SERVICE_CATEGORY_SUCCESS = "ADD_SERVICE_CATEGORY_SUCCESS";
const ADD_SERVICE_CATEGORY_FAILURE = "ADD_SERVICE_CATEGORY_FAILURE";
const SET_SERVICE_CATEGORY_TYPE = "SET_SERVICE_CATEGORY_TYPE";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const normalizeCategoryCollection = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.categories)) {
    return payload.categories;
  }

  if (Array.isArray(payload?.data?.categories)) {
    return payload.data.categories;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.services)) {
    return payload.services;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  return [];
};

const normalizePagination = (payload, fallbackLength) =>
  payload?.pagination ||
  payload?.meta ||
  payload?.data?.pagination ||
  payload?.data?.meta || {
    total: fallbackLength,
    totalPages: 1,
    currentPage: 1,
  };

const normalizeCategoryEntity = (payload) =>
  payload?.category || payload?.data?.category || payload?.data || payload;

const normalizeCategoryType = (category) => {
  const rawType = String(category?.type || "").trim().toLowerCase();

  if (rawType) {
    return rawType;
  }

  // Older backend records may not have a type persisted.
  // Treat them as product categories so admin/mobile counts stay aligned.
  return "product";
};

const buildCategoryPayload = ({ name, type, isActive, categoryId, file }) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("type", type);
  formData.append("isActive", String(Boolean(isActive)));

  if (categoryId) {
    formData.append("categoryId", categoryId);
  }

  if (file) {
    formData.append("icon", file);
  }

  return formData;
};

export const setServiceCategoryType = (categoryType) => ({
  type: SET_SERVICE_CATEGORY_TYPE,
  payload: categoryType || "product",
});

export const fetchServiceCategories =
  (page = 1, limit = 10, filters = {}) =>
  async (dispatch) => {
    const requestedType = filters?.type || "product";

    dispatch({ type: FETCH_SERVICE_CATEGORIES_REQUEST });
    dispatch(setServiceCategoryType(requestedType));

    try {
      const { data } = await axios.get(`${resolveCategoryApiBase()}/service/getAllCategories`, {
        headers: getAuthHeaders(),
        params: { page, limit },
      });

      const allCategories = normalizeCategoryCollection(data).map((category) => ({
        ...category,
        type: normalizeCategoryType(category),
      }));
      const filteredCategories = requestedType === "all"
        ? allCategories
        : allCategories.filter(
            (category) => normalizeCategoryType(category) === String(requestedType).toLowerCase()
          );

      dispatch({
        type: FETCH_SERVICE_CATEGORIES_SUCCESS,
        payload: {
          categories: filteredCategories,
          pagination: normalizePagination(data, filteredCategories.length),
        },
      });
    } catch (error) {
      dispatch({
        type: FETCH_SERVICE_CATEGORIES_FAILURE,
        payload: error.response?.data?.msg || error.response?.data?.message || "Failed to fetch categories",
      });
    }
  };

export const deleteServiceCategory =
  (id) =>
  async (dispatch) => {
    dispatch({ type: DELETE_SERVICE_CATEGORY_REQUEST });
    try {
      await axios.delete(`${resolveCategoryApiBase()}/service/category/${id}`, {
        headers: getAuthHeaders(),
      });
      dispatch({ type: DELETE_SERVICE_CATEGORY_SUCCESS, payload: id });
      return { success: true, id };
    } catch (error) {
      const message = error.response?.data?.msg || error.response?.data?.message || "Failed to delete category";
      dispatch({
        type: DELETE_SERVICE_CATEGORY_FAILURE,
        payload: message,
      });
      return { success: false, message };
    }
  };

export const editServiceCategory =
  (id, updatedData) =>
  async (dispatch) => {
    dispatch({ type: EDIT_SERVICE_CATEGORY_REQUEST });
    try {
      const payload = buildCategoryPayload(updatedData);
      const { data } = await axios.put(`${resolveCategoryApiBase()}/service/updateCategory/${id}`, payload, {
        headers: getAuthHeaders(),
      });

      const category = normalizeCategoryEntity(data);
      dispatch({
        type: EDIT_SERVICE_CATEGORY_SUCCESS,
        payload: category,
      });
      return { success: true, category };
    } catch (error) {
      const message = error.response?.data?.msg || error.response?.data?.message || "Failed to edit category";
      dispatch({
        type: EDIT_SERVICE_CATEGORY_FAILURE,
        payload: message,
      });
      return { success: false, message };
    }
  };

export const addServiceCategory =
  (newCategory) =>
  async (dispatch) => {
    dispatch({ type: ADD_SERVICE_CATEGORY_REQUEST });
    try {
      const payload = buildCategoryPayload(newCategory);
      const { data } = await axios.post(`${resolveCategoryApiBase()}/service/category`, payload, {
        headers: getAuthHeaders(),
      });

      const category = normalizeCategoryEntity(data);
      dispatch({
        type: ADD_SERVICE_CATEGORY_SUCCESS,
        payload: category,
      });
      return { success: true, category };
    } catch (error) {
      const message = error.response?.data?.msg || error.response?.data?.message || "Failed to add category";
      dispatch({
        type: ADD_SERVICE_CATEGORY_FAILURE,
        payload: message,
      });
      return { success: false, message };
    }
  };

export const serviceCategoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SERVICE_CATEGORY_TYPE:
      return {
        ...state,
        activeType: action.payload,
      };
    case FETCH_SERVICE_CATEGORIES_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_SERVICE_CATEGORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        serviceCategories: action.payload.categories,
        pagination: action.payload.pagination,
        error: null,
      };
    case FETCH_SERVICE_CATEGORIES_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case DELETE_SERVICE_CATEGORY_REQUEST:
      return { ...state, deleteLoading: true, error: null };
    case DELETE_SERVICE_CATEGORY_SUCCESS:
      return {
        ...state,
        deleteLoading: false,
        serviceCategories: state.serviceCategories.filter((category) => category._id !== action.payload),
      };
    case DELETE_SERVICE_CATEGORY_FAILURE:
      return { ...state, deleteLoading: false, error: action.payload };
    case EDIT_SERVICE_CATEGORY_REQUEST:
      return { ...state, editLoading: true, error: null };
    case EDIT_SERVICE_CATEGORY_SUCCESS:
      return {
        ...state,
        editLoading: false,
        serviceCategories: state.serviceCategories.map((category) =>
          category._id === action.payload?._id ? { ...category, ...action.payload } : category
        ),
      };
    case EDIT_SERVICE_CATEGORY_FAILURE:
      return { ...state, editLoading: false, error: action.payload };
    case ADD_SERVICE_CATEGORY_REQUEST:
      return { ...state, addLoading: true, error: null };
    case ADD_SERVICE_CATEGORY_SUCCESS:
      return {
        ...state,
        addLoading: false,
        serviceCategories: action.payload?._id
          ? [action.payload, ...state.serviceCategories]
          : state.serviceCategories,
      };
    case ADD_SERVICE_CATEGORY_FAILURE:
      return { ...state, addLoading: false, error: action.payload };
    default:
      return state;
  }
};
