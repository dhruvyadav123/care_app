import axios from "axios";
import { API_URL } from "../../Config/AppConstant";

const initialState = {
    loading: false,
    vacinations: [],
    error: null,
    pagination: {}
};

// Action types
const FETCH_VACINATION_REQUEST = "FETCH_VACINATION_REQUEST";
const FETCH_VACINATION_SUCCESS = "FETCH_VACINATION_SUCCESS";
const FETCH_VACINATION_FAILURE = "FETCH_VACINATION_FAILURE";
const ADD_VACINATION_REQUEST = "ADD_VACINATION_REQUEST";
const ADD_VACINATION_SUCCESS = "ADD_VACINATION_SUCCESS";
const ADD_VACINATION_FAILURE = "ADD_VACINATION_FAILURE";
const UPDATE_VACINATION_REQUEST = "UPDATE_VACINATION_REQUEST";
const UPDATE_VACINATION_SUCCESS = "UPDATE_VACINATION_SUCCESS";
const UPDATE_VACINATION_FAILURE = "UPDATE_VACINATION_FAILURE";
const DELETE_VACINATION_REQUEST = "DELETE_VACINATION_REQUEST";
const DELETE_VACINATION_SUCCESS = "DELETE_VACINATION_SUCCESS";
const DELETE_VACINATION_FAILURE = "DELETE_VACINATION_REQUEST";


export const fetchVacinations = () =>
    async (dispatch) => {

        dispatch({ type: FETCH_VACINATION_REQUEST });
        try {
            const token1= await localStorage.getItem("token")
            const { data } = await axios.get(
                `${API_URL}/vacination/list`,
                {
                    headers: {
                        Authorization: `Bearer ${token1}`,
                    },
                }
            );


            console.log("data::", data)
            dispatch({ type: FETCH_VACINATION_SUCCESS, payload: data });
        } catch (error) {
            dispatch({ type: FETCH_VACINATION_FAILURE, payload: error.message });
        }
    };

export const createVacination = (formData) => async (dispatch) => {
    dispatch({ type: ADD_VACINATION_REQUEST });

    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${API_URL}/vacination/create`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            dispatch({ type: ADD_VACINATION_SUCCESS, payload: response.data });
        }
    } catch (error) {
        dispatch({ type: ADD_VACINATION_FAILURE, payload: error.message });
    }
};


export const updateVacination = (id, formData, setEditModal) => async (dispatch) => {
    dispatch({ type: UPDATE_VACINATION_REQUEST });

    try {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${API_URL}/vacination/update/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            dispatch({ type: UPDATE_VACINATION_SUCCESS, payload: response.data });
            setEditModal(false)
        }
    } catch (error) {
        dispatch({ type: UPDATE_VACINATION_FAILURE, payload: error.message });
    }
};

export const deleteVacination = (id) => async (dispatch) => {
    dispatch({ type: DELETE_VACINATION_REQUEST });
    try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_URL}/vacination/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        dispatch({ type: DELETE_VACINATION_SUCCESS, payload: id });
    } catch (error) {
        dispatch({ type: DELETE_VACINATION_FAILURE, payload: error.message });
    }
};

// Reducer
export const vacinationReducer = (state = initialState, action) => {
    switch (action.type) {
        // Fetch medicines
        case FETCH_VACINATION_REQUEST:
            return { ...state, loading: true, error: null };
        case FETCH_VACINATION_SUCCESS:
            return {
                ...state,
                loading: false,
                vacinations: action.payload.data,
                pagination: action.payload.pagination || {},
                error: null,
            };
        case FETCH_VACINATION_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case ADD_VACINATION_REQUEST:
            return { ...state, loading: true, error: null };
        case ADD_VACINATION_SUCCESS:
            return {
                ...state,
                loading: false,
                vacinations: [...state.vacinations, action.payload],
                error: null,
            };
        case ADD_VACINATION_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case UPDATE_VACINATION_REQUEST:
            return { ...state, loading: true, error: null };
        case UPDATE_VACINATION_SUCCESS:
            return {
                ...state,
                loading: false,
                vacinations: action.payload.data,
                error: null,
            };
        case UPDATE_VACINATION_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case DELETE_VACINATION_REQUEST:
            return { ...state, deleteLoading: true };
        case DELETE_VACINATION_SUCCESS:
            return {
                ...state,
                loading: false,
                vacinations: Array.isArray(state.vacinations)
                    ? state.vacinations.filter((user) => user._id !== action.payload)
                    : [],
            };
        case DELETE_VACINATION_FAILURE:
            return { ...state, error: action.payload };
        default:
            return state;
    }
};
