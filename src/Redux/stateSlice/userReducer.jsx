import axios from "axios";
import { resolveApiUrl, resolveBaseUrl } from "../../Config/AppConstant";

const initialState = {
  loading: false,
  users: [],
  error: null,
  deleteLoading: false,
  editLoading: false,
  pagination: {},
};

// Action types
const FETCH_USERS_REQUEST = "FETCH_USERS_REQUEST";
const FETCH_USERS_SUCCESS = "FETCH_USERS_SUCCESS";
const FETCH_USERS_FAILURE = "FETCH_USERS_FAILURE";
const DELETE_USER_REQUEST = "DELETE_USER_REQUEST";
const DELETE_USER_SUCCESS = "DELETE_USER_SUCCESS";
const DELETE_USER_FAILURE = "DELETE_USER_FAILURE";
const EDIT_USER_REQUEST = "EDIT_USER_REQUEST";
const EDIT_USER_SUCCESS = "EDIT_USER_SUCCESS";
const EDIT_USER_FAILURE = "EDIT_USER_FAILURE";
const SEARCH_USERS_REQUEST = "SEARCH_USERS_REQUEST";
const SEARCH_USERS_SUCCESS = "SEARCH_USERS_SUCCESS";
const SEARCH_USERS_FAILURE = "SEARCH_USERS_FAILURE";
const STATUS_USER_REQUEST = "STATUS_USER_REQUEST";
const STATUS_USER_SUCCESS = "STATUS_USER_SUCCESS";
const STATUS_USER_FAILURE = "STATUS_USER_FAILURE";

// Action: Search users
export const searchUsers = (query) => async (dispatch) => {
  dispatch({ type: SEARCH_USERS_REQUEST });
  try {
    const token = localStorage.getItem("token");
    const apiUrl = resolveApiUrl();
    const data = await axios.get(
      `${apiUrl}/admin/search?query=${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch({ type: SEARCH_USERS_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({ type: SEARCH_USERS_FAILURE, payload: error.message });
  }
};

// Action: Fetch users
export const fetchUsers =
  (page = 1, limit = 10) =>
    async (dispatch) => {
      dispatch({ type: FETCH_USERS_REQUEST });

      try {
        const token1 = await localStorage.getItem("token")
        const apiUrl = resolveApiUrl();
        const { data } = await axios.get(
          `${apiUrl}/admin/getAllUsers?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token1}`,
            },
          }
        );
        dispatch({ type: FETCH_USERS_SUCCESS, payload: data });
      } catch (error) {
        dispatch({ type: FETCH_USERS_FAILURE, payload: error.message });
      }
    };

// Action: Delete user
export const deleteUser = (id) => async (dispatch) => {
  dispatch({ type: DELETE_USER_REQUEST });
  try {
    const token = localStorage.getItem("token");
    const apiUrl = resolveApiUrl();
    await axios.delete(`${apiUrl}/admin/deleteUser/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch({ type: DELETE_USER_SUCCESS, payload: id });
  } catch (error) {
    dispatch({ type: DELETE_USER_FAILURE, payload: error.message });
  }
};

// Action: Edit user
export const editUser = (id, updatedData) => async (dispatch) => {
  dispatch({ type: EDIT_USER_REQUEST });
  try {
    const token = localStorage.getItem("token");
    const apiUrl = resolveApiUrl();
    const { data } = await axios.put(`${apiUrl}/admin/editUser/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch({ type: EDIT_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: EDIT_USER_FAILURE, payload: error.message });
  }
};


export const changUserStatus = (id, status) => async (dispatch) => {
  dispatch({ type: STATUS_USER_REQUEST });
  // dispatch({ type: STATUS_USER_SUCCESS, payload: data });

  try {
    const token = localStorage.getItem("token");
    const baseUrl = resolveBaseUrl();
    const { data } = await axios.put(`${baseUrl}/api/admin/updateUserStatus/${id}`, { status }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("status::", data)

    dispatch({ type: STATUS_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: STATUS_USER_FAILURE, payload: error.message });
    console.log(error);
  }
};

// Reducer: User reducer
export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch users
    case FETCH_USERS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: Array.isArray(action.payload.users) ? action.payload.users : [],
        pagination: action.payload.pagination || {},
        error: null,
      };
    case FETCH_USERS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Delete user
    case DELETE_USER_REQUEST:
      return { ...state, deleteLoading: true };
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        deleteLoading: false,
        users: Array.isArray(state.users)
          ? state.users.filter((user) => user._id !== action.payload)
          : [],
      };
    case DELETE_USER_FAILURE:
      return { ...state, deleteLoading: false, error: action.payload };

    // Edit user
    case EDIT_USER_REQUEST:
      return { ...state, editLoading: true };
    case EDIT_USER_SUCCESS:
      return {
        ...state,
        editLoading: false,
        users: Array.isArray(state.users)
          ? state.users.map((user) =>
            user._id === action.payload._id ? action.payload : user
          )
          : [],
      };
    case EDIT_USER_FAILURE:
      return { ...state, editLoading: false, error: action.payload };

    // Search users
    case SEARCH_USERS_REQUEST:
      return { ...state, loading: true, error: null };
    case SEARCH_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload.data,
        pagination: action.payload.pagination || {},
        error: null,
      };
    case SEARCH_USERS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Change user status
    case STATUS_USER_REQUEST:
      return { ...state, loading: true, error: null };
    case STATUS_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        users: state.users.map((user) =>
          user._id === action.payload._id ? { ...user, status: action.payload.status } : user
        ),
        error: null,
      };
    case STATUS_USER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
