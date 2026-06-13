import axios from "axios";
import { API_URL } from "../../Config/AppConstant";

const initialState = {
  loading: false,
  users: [],
  error: null,
};

// Action types
const FETCH_SUBADMIN_REQUEST = "FETCH_SUBADMIN_REQUEST";
const FETCH_SUBADMIN_SUCCESS = "FETCH_SUBADMIN_SUCCESS";
const FETCH_SUBADMIN_FAILURE = "FETCH_SUBADMIN_FAILURE";
const ADD_SUBADMIN_REQUEST = "ADD_SUBADMIN_REQUEST";
const ADD_SUBADMIN_SUCCESS = "ADD_SUBADMIN_SUCCESS";
const ADD_SUBADMIN_FAILURE = "ADD_SUBADMIN_FAILURE";
const UPDATE_SUBADMIN_REQUEST = "UPDATE_SUBADMIN_REQUEST";
const UPDATE_SUBADMIN_SUCCESS = "UPDATE_SUBADMIN_SUCCESS";
const UPDATE_SUBADMIN_FAILURE = "UPDATE_SUBADMIN_FAILURE";
const FETCH_SINGLE_SUBADMIN_REQUEST = "FETCH_SINGLE_SUBADMIN_REQUEST";
const FETCH_SINGLE_SUBADMIN_SUCCESS = "FETCH_SINGLE_SUBADMIN_SUCCESS";
const FETCH_SINGLE_SUBADMIN_FAILURE = "FETCH_SINGLE_SUBADMIN_FAILURE";
const DELETE_SUBADMIN_REQUEST = "DELETE_SUBADMIN_REQUEST";
const DELETE_SUBADMIN_SUCCESS = "DELETE_SUBADMIN_SUCCESS";
const DELETE_SUBADMIN_FAILURE = "DELETE_SUBADMIN_REQUEST";


export const fetchSubAdmins = () =>
  async (dispatch) => {
    dispatch({ type: FETCH_SUBADMIN_REQUEST });
    try {
      const token = localStorage.getItem("token");
      console.log("token::", token);
      const { data } = await axios.get(
        `${API_URL}/subAdmin/fetchAllSubAdmins`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch({ type: FETCH_SUBADMIN_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: FETCH_SUBADMIN_FAILURE, payload: error.message });
    }
  };

export const addSubAdmin = (formData) => async (dispatch) => {
  dispatch({ type: ADD_SUBADMIN_REQUEST });

  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/subAdmin/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      dispatch({ type: ADD_SUBADMIN_SUCCESS, payload: response.data });
    }
  } catch (error) {
    dispatch({ type: ADD_SUBADMIN_FAILURE, payload: error.message });
  }
};

export const fetchSingleSubAdmin = (id) => async (dispatch) => {
  dispatch({ type: FETCH_SINGLE_SUBADMIN_REQUEST });

  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(`${API_URL}/subAdmin/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch({ type: FETCH_SINGLE_SUBADMIN_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_SINGLE_SUBADMIN_FAILURE, payload: error.message });
  }
};

export const updateSubAdmin = (id, formData, setEditModal) => async (dispatch) => {
  dispatch({ type: UPDATE_SUBADMIN_REQUEST });

  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/subAdmin/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      dispatch({ type: UPDATE_SUBADMIN_SUCCESS, payload: response.data });
      setEditModal(false)
    }
  } catch (error) {
    dispatch({ type: UPDATE_SUBADMIN_FAILURE, payload: error.message });
  }
};

export const deleteSubAdmin = (id) => async (dispatch) => {
  dispatch({ type: DELETE_SUBADMIN_REQUEST });
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`${API_URL}/subAdmin/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch({ type: DELETE_SUBADMIN_SUCCESS, payload: id });
  } catch (error) {
    dispatch({ type: DELETE_SUBADMIN_FAILURE, payload: error.message });
  }
};
// Reducer
export const subAdminReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch users
    case FETCH_SUBADMIN_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_SUBADMIN_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload.data,
        error: null,
      };
    case FETCH_SUBADMIN_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case FETCH_SINGLE_SUBADMIN_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_SINGLE_SUBADMIN_SUCCESS:
      return {
        ...state,
        loading: false,
        singleSubAdmin: action.payload.data,
        error: null,
      };
    case FETCH_SINGLE_SUBADMIN_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case ADD_SUBADMIN_REQUEST:
      return { ...state, loading: true, successMessage: null, error: null };
    case ADD_SUBADMIN_SUCCESS:
      return {
        ...state,
        loading: false,
        users: [...state.users, action.payload],
        error: null,
      };
    case ADD_SUBADMIN_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case UPDATE_SUBADMIN_REQUEST:
      return { ...state, loading: true, error: null };
    case UPDATE_SUBADMIN_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload.data,
        error: null,
      };
    case UPDATE_SUBADMIN_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case DELETE_SUBADMIN_REQUEST:
      return { ...state, deleteLoading: true };
    case DELETE_SUBADMIN_SUCCESS:
      return {
        ...state,
        deleteLoading: false,
        users: Array.isArray(state.users)
          ? state.users.filter((user) => user._id !== action.payload)
          : [],
      };
    case DELETE_SUBADMIN_FAILURE:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};