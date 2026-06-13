import axios from "axios";
import { API_URL } from "../../Config/AppConstant";

const initialState = {
    loading: false,
    doctors: [],
    error: null,
    pagination: {}
};

// Action types
const FETCH_DOCTOR_REQUEST = "FETCH_DOCTOR_REQUEST";
const FETCH_DOCTOR_SUCCESS = "FETCH_DOCTOR_SUCCESS";
const FETCH_DOCTOR_FAILURE = "FETCH_DOCTOR_FAILURE";
const ADD_DOCTOR_REQUEST = "ADD_DOCTOR_REQUEST";
const ADD_DOCTOR_SUCCESS = "ADD_DOCTOR_SUCCESS";
const ADD_DOCTOR_FAILURE = "ADD_DOCTOR_FAILURE";
const UPDATE_DOCTOR_REQUEST = "UPDATE_DOCTOR_REQUEST";
const UPDATE_DOCTOR_SUCCESS = "UPDATE_DOCTOR_SUCCESS";
const UPDATE_DOCTOR_FAILURE = "UPDATE_DOCTOR_FAILURE";
const DELETE_DOCTOR_REQUEST = "DELETE_DOCTOR_REQUEST";
const DELETE_DOCTOR_SUCCESS = "DELETE_DOCTOR_SUCCESS";
const DELETE_DOCTOR_FAILURE = "DELETE_DOCTOR_REQUEST";

export const fetchDoctors = () =>
    async (dispatch) => {
        dispatch({ type: FETCH_DOCTOR_REQUEST });
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(
                `${API_URL}/doctor`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            dispatch({ type: FETCH_DOCTOR_SUCCESS, payload: data });
        } catch (error) {
            dispatch({ type: FETCH_DOCTOR_FAILURE, payload: error.message });
        }
    };

export const createDoctor = (formData) => async (dispatch) => {
    dispatch({ type: ADD_DOCTOR_REQUEST });

    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${API_URL}/doctor`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            dispatch({ type: ADD_DOCTOR_SUCCESS, payload: response.data });
        }
    } catch (error) {
        dispatch({ type: ADD_DOCTOR_FAILURE, payload: error.message });
    }
};


export const updateDoctor = (id, formData, setEditModal) => async (dispatch) => {
    dispatch({ type: UPDATE_DOCTOR_REQUEST });

    try {
        const token = localStorage.getItem("token");
        const response = await axios.patch(`${API_URL}/doctor/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            dispatch({ type: UPDATE_DOCTOR_SUCCESS, payload: response.data });
            setEditModal(false)
        }
    } catch (error) {
        dispatch({ type: UPDATE_DOCTOR_FAILURE, payload: error.message });
    }
};

export const deleteDoctor = (id) => async (dispatch) => {
    dispatch({ type: DELETE_DOCTOR_REQUEST });
    try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_URL}/doctor/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        dispatch({ type: DELETE_DOCTOR_SUCCESS, payload: id });
    } catch (error) {
        dispatch({ type: DELETE_DOCTOR_FAILURE, payload: error.message });
    }
};

// Reducer
export const doctorReducer = (state = initialState, action) => {
    switch (action.type) {
        // Fetch medicines
        case FETCH_DOCTOR_REQUEST:
            return { ...state, loading: true, error: null };
        case FETCH_DOCTOR_SUCCESS:
            return {
                ...state,
                loading: false,
                doctors: action.payload.data,
                pagination: action.payload.pagination || {},
                error: null,
            };
        case FETCH_DOCTOR_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case ADD_DOCTOR_REQUEST:
            return { ...state, loading: true, error: null };
        case ADD_DOCTOR_SUCCESS:
            return {
                ...state,
                loading: false,
                medicines: [...state.doctors, action.payload],
                error: null,
            };
        case ADD_DOCTOR_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case UPDATE_DOCTOR_REQUEST:
            return { ...state, loading: true, error: null };
        case UPDATE_DOCTOR_SUCCESS:
            return {
                ...state,
                loading: false,
                medicines: action.payload.data,
                error: null,
            };
        case UPDATE_DOCTOR_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case DELETE_DOCTOR_REQUEST:
            return { ...state, loading: true };
        case DELETE_DOCTOR_SUCCESS:
            return {
                ...state,
                loading: false,
                medicines: Array.isArray(state.doctors)
                    ? state.doctors.filter((user) => user._id !== action.payload)
                    : [],
            };
        case DELETE_DOCTOR_FAILURE:
            return { ...state, error: action.payload };
        default:
            return state;
    }
};
