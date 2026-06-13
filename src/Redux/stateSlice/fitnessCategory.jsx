import axios from "axios";
import { API_URL } from "../../Config/AppConstant";

const initialState = {
    loading: false,
    categories: [],
    error: null,
    pagination: {}
};

// Action types
const FETCH_FITNESS_CATEGORY_REQUEST = "FETCH_FITNESS_CATEGORY_REQUEST";
const FETCH_FITNESS_CATEGORY_SUCCESS = "FETCH_FITNESS_CATEGORY_SUCCESS";
const FETCH_FITNESS_CATEGORY_FAILURE = "FETCH_FITNESS_CATEGORY_FAILURE";
const ADD_FITNESS_CATEGORY_REQUEST = "ADD_FITNESS_CATEGORY_REQUEST";
const ADD_FITNESS_CATEGORY_SUCCESS = "ADD_FITNESS_CATEGORY_SUCCESS";
const ADD_FITNESS_CATEGORY_FAILURE = "ADD_FITNESS_CATEGORY_FAILURE";
const UPDATE_FITNESS_CATEGORY_REQUEST = "UPDATE_FITNESS_CATEGORY_REQUEST";
const UPDATE_FITNESS_CATEGORY_SUCCESS = "UPDATE_FITNESS_CATEGORY_SUCCESS";
const UPDATE_FITNESS_CATEGORY_FAILURE = "UPDATE_FITNESS_CATEGORY_FAILURE";
const DELETE_FITNESS_CATEGORY_REQUEST = "DELETE_FITNESS_CATEGORY_REQUEST";
const DELETE_FITNESS_CATEGORY_SUCCESS = "DELETE_FITNESS_CATEGORY_SUCCESS";
const DELETE_FITNESS_CATEGORY_FAILURE = "DELETE_FITNESS_CATEGORY_REQUEST";

export const fetchFitnessCategory = () =>
    async (dispatch) => {
        dispatch({ type: FETCH_FITNESS_CATEGORY_REQUEST });
        try {
            const token1= await localStorage.getItem("token")
            const { data } = await axios.get(
                `${API_URL}/fitness/fitnessCategory`,
                {
                    headers: {
                        Authorization: `Bearer ${token1}`,
                    },
                }
            );
            console.log("data::",data.services)
            dispatch({ type: FETCH_FITNESS_CATEGORY_SUCCESS, payload: data.services });
        } catch (error) {
            dispatch({ type: FETCH_FITNESS_CATEGORY_FAILURE, payload: error.message });
        }
    };

export const createFitnessCategory = (formDataToSubmit) => async (dispatch) => {
    dispatch({ type: ADD_FITNESS_CATEGORY_REQUEST });

    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${API_URL}/fitness/fitnessCategory`, formDataToSubmit, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            dispatch({ type: ADD_FITNESS_CATEGORY_SUCCESS, payload: response.data });
        }
    } catch (error) {
        dispatch({ type: ADD_FITNESS_CATEGORY_FAILURE, payload: error.message });
    }
};


export const updateFitnessCategory = (id, formData, setEditModal) => async (dispatch) => {
    dispatch({ type: UPDATE_FITNESS_CATEGORY_REQUEST });

    try {
        const token = localStorage.getItem("token");
        const response = await axios.patch(`${API_URL}/fitness/fitnessCategory/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            dispatch({ type: UPDATE_FITNESS_CATEGORY_SUCCESS, payload: response.data });
            setEditModal(false)
        }
    } catch (error) {
        dispatch({ type: UPDATE_FITNESS_CATEGORY_FAILURE, payload: error.message });
    }
};

export const deleteFitnessCategory = (id) => async (dispatch) => {
    dispatch({ type: DELETE_FITNESS_CATEGORY_REQUEST });
    try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_URL}/fitness/fitnessCategory/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        dispatch({ type: DELETE_FITNESS_CATEGORY_SUCCESS, payload: id });
    } catch (error) {
        dispatch({ type: DELETE_FITNESS_CATEGORY_FAILURE, payload: error.message });
    }
};

// Reducer
export const fitnessCategoriesReducer = (state = initialState, action) => {
    switch (action.type) {
        // Fetch medicines
        case FETCH_FITNESS_CATEGORY_REQUEST:
            return { ...state, loading: true, error: null };
        case FETCH_FITNESS_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                categories: action.payload,
                pagination: action.payload.pagination || {},
                error: null,
            };
        case FETCH_FITNESS_CATEGORY_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case ADD_FITNESS_CATEGORY_REQUEST:
            return { ...state, loading: true, error: null };
        case ADD_FITNESS_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                categories: [...state.categories, action.payload],
                error: null,
            };
        case ADD_FITNESS_CATEGORY_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case UPDATE_FITNESS_CATEGORY_REQUEST:
            return { ...state, loading: true, error: null };
        case UPDATE_FITNESS_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                categories: action.payload.data,
                error: null,
            };
        case UPDATE_FITNESS_CATEGORY_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case DELETE_FITNESS_CATEGORY_REQUEST:
            return { ...state, loading: true };
        case DELETE_FITNESS_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                categories: Array.isArray(state.categories)
                    ? state.categories.filter((user) => user._id !== action.payload)
                    : [],
            };
        case DELETE_FITNESS_CATEGORY_FAILURE:
            return { ...state, error: action.payload };
        default:
            return state;
    }
};
