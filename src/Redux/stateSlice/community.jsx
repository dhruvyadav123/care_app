import axios from "axios";
import { API_URL } from "../../Config/AppConstant";

const initialState = {
    loading: false,
    communities: [],
    error: null,
    pagination: {}
};

// Action types
const FETCH_COMMUNITY_REQUEST = "FETCH_COMMUNITY_REQUEST";
const FETCH_COMMUNITY_SUCCESS = "FETCH_COMMUNITY_SUCCESS";
const FETCH_COMMUNITY_FAILURE = "FETCH_COMMUNITY_FAILURE";
const ADD_COMMUNITY_REQUEST = "ADD_COMMUNITY_REQUEST";
const ADD_COMMUNITY_SUCCESS = "ADD_COMMUNITY_SUCCESS";
const ADD_COMMUNITY_FAILURE = "ADD_COMMUNITY_FAILURE";
const UPDATE_COMMUNITY_REQUEST = "UPDATE_COMMUNITY_REQUEST";
const UPDATE_COMMUNITY_SUCCESS = "UPDATE_COMMUNITY_SUCCESS";
const UPDATE_COMMUNITY_FAILURE = "UPDATE_COMMUNITY_FAILURE";
const DELETE_COMMUNITY_REQUEST = "DELETE_COMMUNITY_REQUEST";
const DELETE_COMMUNITY_SUCCESS = "DELETE_COMMUNITY_SUCCESS";
const DELETE_COMMUNITY_FAILURE = "DELETE_COMMUNITY_REQUEST";


export const fetchCommunity = () =>
    async (dispatch) => {
        dispatch({ type: FETCH_COMMUNITY_REQUEST });
        try {
            const token1= await localStorage.getItem("token")
            const { data } = await axios.get(
                `${API_URL}/admin/getAllCommunity`,
                {
                    headers: {
                        Authorization: `Bearer ${token1}`,
                    },
                }
            );
            dispatch({ type: FETCH_COMMUNITY_SUCCESS, payload: data });
        } catch (error) {
            dispatch({ type: FETCH_COMMUNITY_FAILURE, payload: error.message });
        }
    };

export const createCommunity = (formDataToSend) => async (dispatch) => {
    dispatch({ type: ADD_COMMUNITY_REQUEST });

    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${API_URL}/communities`, formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            dispatch({ type: ADD_COMMUNITY_SUCCESS, payload: response.data });
        }
    } catch (error) {
        dispatch({ type: ADD_COMMUNITY_FAILURE, payload: error.message });
    }
};


export const updateCommunity = (id, formData, setEditModal) => async (dispatch) => {
    dispatch({ type: UPDATE_COMMUNITY_REQUEST });

    try {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${API_URL}/communities/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            dispatch({ type: UPDATE_COMMUNITY_SUCCESS, payload: response.data });
            setEditModal(false)
        }
    } catch (error) {
        dispatch({ type: UPDATE_COMMUNITY_FAILURE, payload: error.message });
    }
};

export const deleteCommunity = (communityId) => async (dispatch) => {
    dispatch({ type: DELETE_COMMUNITY_REQUEST });
    try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_URL}/admin/deleteCommunity/${communityId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        dispatch({ type: DELETE_COMMUNITY_SUCCESS, payload: communityId });
    } catch (error) {
        dispatch({ type: DELETE_COMMUNITY_FAILURE, payload: error.message });
    }
};

// Reducer
export const communityReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_COMMUNITY_REQUEST:
            return { ...state, loading: true, error: null };
        case FETCH_COMMUNITY_SUCCESS:
            return {
                ...state,
                loading: false,
                communities: action.payload,
                pagination: action.payload.pagination || {},
                error: null,
            };
        case FETCH_COMMUNITY_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case ADD_COMMUNITY_REQUEST:
            return { ...state, loading: true, successMessage: null, error: null };
        case ADD_COMMUNITY_SUCCESS:
            return {
                ...state,
                loading: false,
                communities: [...state.communities, action.payload],
                error: null,
            };
        case ADD_COMMUNITY_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case UPDATE_COMMUNITY_REQUEST:
            return { ...state, loading: true, error: null };
        case UPDATE_COMMUNITY_SUCCESS:
            return {
                ...state,
                loading: false,
                communities: action.payload.data,
                error: null,
            };
        case UPDATE_COMMUNITY_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case DELETE_COMMUNITY_REQUEST:
            return { ...state, deleteLoading: true };
        case DELETE_COMMUNITY_SUCCESS:
            return {
                ...state,
                loading: false,
                communities: Array.isArray(state.communities)
                    ? state.communities.filter((user) => user._id !== action.payload)
                    : [],
            };
        case DELETE_COMMUNITY_FAILURE:
            return { ...state, error: action.payload };
        default:
            return state;
    }
};
