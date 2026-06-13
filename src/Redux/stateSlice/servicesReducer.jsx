import axios from "axios";
import { API_URL } from "../../Config/AppConstant";

const initialState = {
  loading: false,
  services: [], // Renamed from `categories` for clarity
  error: null,
  deleteLoading: false,
  editLoading: false,
  addLoading: false,
  pagination: {}, // Stores pagination info
};

// Action types
const FETCH_SERVICES_REQUEST = "FETCH_SERVICES_REQUEST";
const FETCH_SERVICES_SUCCESS = "FETCH_SERVICES_SUCCESS";
const FETCH_SERVICES_FAILURE = "FETCH_SERVICES_FAILURE";
const DELETE_SERVICE_REQUEST = "DELETE_SERVICE_REQUEST";
const DELETE_SERVICE_SUCCESS = "DELETE_SERVICE_SUCCESS";
const DELETE_SERVICE_FAILURE = "DELETE_SERVICE_FAILURE";
const EDIT_SERVICE_REQUEST = "EDIT_SERVICE_REQUEST";
const EDIT_SERVICE_SUCCESS = "EDIT_SERVICE_SUCCESS";
const EDIT_SERVICE_FAILURE = "EDIT_SERVICE_FAILURE";
const ADD_SERVICE_REQUEST = "ADD_SERVICE_REQUEST";
const ADD_SERVICE_SUCCESS = "ADD_SERVICE_SUCCESS";
const ADD_SERVICE_FAILURE = "ADD_SERVICE_FAILURE";

// Fetch services
export const fetchServices =
  (page = 1, limit = 10) =>
  async (dispatch) => {
    dispatch({ type: FETCH_SERVICES_REQUEST });
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${API_URL}/service/getService?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch({ type: FETCH_SERVICES_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: FETCH_SERVICES_FAILURE,
        payload: error.response?.data?.message || "Failed to fetch services",
      });
    }
  };

// Delete service
export const deleteService = (id) => async (dispatch) => {
  dispatch({ type: DELETE_SERVICE_REQUEST });
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`${API_URL}/service/deleteService/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch({ type: DELETE_SERVICE_SUCCESS, payload: id });
  } catch (error) {
    dispatch({
      type: DELETE_SERVICE_FAILURE,
      payload: error.response?.data?.message || "Failed to delete service",
    });
  }
};

// Edit service
export const editService = (id, updatedData) => async (dispatch) => {
  dispatch({ type: EDIT_SERVICE_REQUEST });
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.patch(
      `${API_URL}/service/editService/${id}`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch({ type: EDIT_SERVICE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: EDIT_SERVICE_FAILURE,
      payload: error.response?.data?.message || "Failed to edit service",
    });
  }
};

// Add service
export const addService = (newService) => async (dispatch) => {
  dispatch({ type: ADD_SERVICE_REQUEST });
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.post(
      `${API_URL}/service/createService`,
      newService,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch({ type: ADD_SERVICE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ADD_SERVICE_FAILURE,
      payload: error.response?.data?.message || "Failed to add service",
    });
  }
};

// Services reducer
export const servicesReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch services
    case FETCH_SERVICES_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_SERVICES_SUCCESS:
      return {
        ...state,
        loading: false,
        services: action.payload.services,
        pagination: action.payload.pagination,
        error: null,
      };
    case FETCH_SERVICES_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Delete service
    case DELETE_SERVICE_REQUEST:
      return { ...state, deleteLoading: true };
    case DELETE_SERVICE_SUCCESS:
      return {
        ...state,
        deleteLoading: false,
        services: state.services.filter(
          (service) => service._id !== action.payload
        ),
      };
    case DELETE_SERVICE_FAILURE:
      return { ...state, deleteLoading: false, error: action.payload };

    // Edit service
    case EDIT_SERVICE_REQUEST:
      return { ...state, editLoading: true };
    case EDIT_SERVICE_SUCCESS:
      return {
        ...state,
        editLoading: false,
        services: state.services.map((service) =>
          service._id === action.payload._id ? action.payload : service
        ),
      };
    case EDIT_SERVICE_FAILURE:
      return { ...state, editLoading: false, error: action.payload };

    // Add service
    case ADD_SERVICE_REQUEST:
      return { ...state, addLoading: true };
    case ADD_SERVICE_SUCCESS:
      return {
        ...state,
        addLoading: false,
        services: [action.payload, ...state.services],
      };
    case ADD_SERVICE_FAILURE:
      return { ...state, addLoading: false, error: action.payload };

    default:
      return state;
  }
};
