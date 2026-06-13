import axios from 'axios';
import { API_URL } from '../../Config/AppConstant';

const initialState = {
    loading: false,
    roles: [],
    error: null,
    pagination: {},
};

// Action types
const FETCH_ROLE_REQUEST = "FETCH_ROLE_REQUEST";
const FETCH_ROLE_SUCCESS = "FETCH_ROLE_SUCCESS";
const FETCH_ROLE_FAILURE = "FETCH_ROLE_FAILURE";

const fetchRoles = () => async (dispatch) => {
    dispatch({ type: FETCH_ROLE_REQUEST });
    try {
        // Get token from localStorage
        const token = localStorage.getItem("token");
        console.log('Token from localStorage:', token);  

        if (!token) {
            throw new Error("No token found. Please log in again.");
        }

        const { data } = await axios.get(
            `${API_URL}/role/fetchAllRole`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        dispatch({ type: FETCH_ROLE_SUCCESS, payload: data });
    } catch (error) {
        console.log('Error:', error);
        dispatch({ type: FETCH_ROLE_FAILURE, payload: error.response?.data?.message || error.message });
    }
}

export const roleReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ROLE_REQUEST:
            return { ...state, loading: true, error: null };
        case FETCH_ROLE_SUCCESS:
            return {
                ...state,
                loading: false,
                roles: action.payload.data,
                pagination: action.payload.pagination || {},
                error: null,
            };
        case FETCH_ROLE_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

export default fetchRoles;
