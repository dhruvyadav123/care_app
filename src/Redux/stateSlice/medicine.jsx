import axios from "axios";
import { API_URL } from "../../Config/AppConstant";

const initialState = {
  loading: false,
  medicines: [],
  error: null,
  pagination: {}
};

// Action types
const FETCH_MEDICINE_REQUEST = "FETCH_MEDICINE_REQUEST";
const FETCH_MEDICINE_SUCCESS = "FETCH_MEDICINE_SUCCESS";
const FETCH_MEDICINE_FAILURE = "FETCH_MEDICINE_FAILURE";
const ADD_MEDICINE_REQUEST = "ADD_MEDICINE_REQUEST";
const ADD_MEDICINE_SUCCESS = "ADD_MEDICINE_SUCCESS";
const ADD_MEDICINE_FAILURE = "ADD_MEDICINE_FAILURE";
const UPDATE_MEDICINE_REQUEST = "UPDATE_MEDICINE_REQUEST";
const UPDATE_MEDICINE_SUCCESS = "UPDATE_MEDICINE_SUCCESS";
const UPDATE_MEDICINE_FAILURE = "UPDATE_MEDICINE_FAILURE";
const DELETE_MEDICINE_REQUEST = "DELETE_MEDICINE_REQUEST";
const DELETE_MEDICINE_SUCCESS = "DELETE_MEDICINE_SUCCESS";
const DELETE_MEDICINE_FAILURE = "DELETE_MEDICINE_REQUEST";
const SEARCH_MEDICINE_REQUEST = "SEARCH_MEDICINE_REQUEST";
const SEARCH_MEDICINE_SUCCESS = "SEARCH_MEDICINE_SUCCESS";
const SEARCH_MEDICINE_FAILURE = "SEARCH_MEDICINE_FAILURE";

export const searchMedicines = (query) => async (dispatch) => {
  dispatch({ type: SEARCH_MEDICINE_REQUEST });

  try {
    const token1 = localStorage.getItem("token");
    const { data } = await axios.get(
      `${API_URL}/medicine/list/search?name=${query}`,
      {
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    dispatch({ type: SEARCH_MEDICINE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: SEARCH_MEDICINE_FAILURE, payload: error.message });
  }
};

export const fetchMedicines = () =>
  async (dispatch) => {
    dispatch({ type: FETCH_MEDICINE_REQUEST });
    try {
      
    const token1= await localStorage.getItem("token")
      const { data } = await axios.get(
        `${API_URL}/medicine/list`,
        {
          headers: {
            Authorization: `Bearer ${token1}`,
          },
        }
      );
      dispatch({ type: FETCH_MEDICINE_SUCCESS, payload: data });
    } catch (error) {
      const errorMessage = error.response?.status === 403 
        ? "Forbidden - please check your permissions or login again" 
        : error.message;
      dispatch({ type: FETCH_MEDICINE_FAILURE, payload: errorMessage });
    }
  };

export const createMedicine = (formData) => async (dispatch) => {
  dispatch({ type: ADD_MEDICINE_REQUEST });

  try {
    const token1 = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/medicine/create`, formData, {
      headers: {
        Authorization: `Bearer ${token1}`,
      },
    });

    if (response.status === 200) {
      dispatch({ type: ADD_MEDICINE_SUCCESS, payload: response.data });
    }
  } catch (error) {
    dispatch({ type: ADD_MEDICINE_FAILURE, payload: error.message });
  }
};


export const updateMedicine = (id, formData, setEditModal) => async (dispatch) => {
  dispatch({ type: UPDATE_MEDICINE_REQUEST });

  try {
    const token1 = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/medicine/update/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token1}`,
      },
    });

    if (response.status === 200) {
      dispatch({ type: UPDATE_MEDICINE_SUCCESS, payload: response.data });
      setEditModal(false)
    }
  } catch (error) {
    dispatch({ type: UPDATE_MEDICINE_FAILURE, payload: error.message });
  }
};

export const deleteMedicine = (id) => async (dispatch) => {
  dispatch({ type: DELETE_MEDICINE_REQUEST });
  try {
    const token1 = localStorage.getItem("token");
    await axios.delete(`${API_URL}/medicine/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token1}`,
      },
    });
    dispatch({ type: DELETE_MEDICINE_SUCCESS, payload: id });
  } catch (error) {
    dispatch({ type: DELETE_MEDICINE_FAILURE, payload: error.message });
  }
};

// Reducer
export const medicineReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch medicines
    case FETCH_MEDICINE_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_MEDICINE_SUCCESS:
      return {
        ...state,
        loading: false,
        medicines: action.payload.data,
        pagination: action.payload.pagination || {},
        error: null,
      };
    case FETCH_MEDICINE_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case ADD_MEDICINE_REQUEST:
      return { ...state, loading: true, successMessage: null, error: null };
    case ADD_MEDICINE_SUCCESS:
      return {
        ...state,
        loading: false,
        medicines: [...state.medicines, action.payload],
        error: null,
      };
    case ADD_MEDICINE_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case UPDATE_MEDICINE_REQUEST:
      return { ...state, loading: true, error: null };
    case UPDATE_MEDICINE_SUCCESS:
      return {
        ...state,
        loading: false,
        medicines: action.payload.data,
        error: null,
      };
    case UPDATE_MEDICINE_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case DELETE_MEDICINE_REQUEST:
      return { ...state, deleteLoading: true };
    case DELETE_MEDICINE_SUCCESS:
      return {
        ...state,
        loading: false,
        medicines: Array.isArray(state.medicines)
          ? state.medicines.filter((user) => user._id !== action.payload)
          : [],
      };
    case DELETE_MEDICINE_FAILURE:
      return { ...state, error: action.payload };
    case SEARCH_MEDICINE_REQUEST:
      return { ...state, loading: true, error: null };
    case SEARCH_MEDICINE_SUCCESS:
      return {
        ...state,
        loading: false,
        medicines: action.payload.data,
        pagination: action.payload.pagination || {},
        error: null,
      };
    case SEARCH_MEDICINE_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
