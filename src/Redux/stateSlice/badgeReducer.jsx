import badgeService from "../../Services/badgeService";

const initialState = {
  loading: false,
  badges: [],
  error: null,
  addLoading: false,
  pagination: {},
};

const FETCH_BADGES_REQUEST = "FETCH_BADGES_REQUEST";
const FETCH_BADGES_SUCCESS = "FETCH_BADGES_SUCCESS";
const FETCH_BADGES_FAILURE = "FETCH_BADGES_FAILURE";
const ADD_BADGE_REQUEST = "ADD_BADGE_REQUEST";
const ADD_BADGE_SUCCESS = "ADD_BADGE_SUCCESS";
const ADD_BADGE_FAILURE = "ADD_BADGE_FAILURE";

const normalizeBadgesPayload = (payload) => {
  const badges =
    payload?.data?.results ||
    payload?.data?.data ||
    payload?.data?.badges ||
    payload?.data ||
    payload?.badges ||
    payload?.results ||
    [];

  const pagination = payload?.pagination || payload?.data?.pagination || {};

  return {
    badges: Array.isArray(badges) ? badges : [],
    pagination,
  };
};

export const fetchBadges = (page = 1, limit = 10) => async (dispatch) => {
  dispatch({ type: FETCH_BADGES_REQUEST });
  try {
    const data = await badgeService.getAll({ page, limit });
    dispatch({ type: FETCH_BADGES_SUCCESS, payload: data });
    return { success: true, data };
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch badges";
    dispatch({
      type: FETCH_BADGES_FAILURE,
      payload: message,
    });
    return { success: false, error: message };
  }
};

export const addBadge = (newBadge) => async (dispatch) => {
  dispatch({ type: ADD_BADGE_REQUEST });
  try {
    const data = await badgeService.add(newBadge);
    dispatch({ type: ADD_BADGE_SUCCESS, payload: data });
    return { success: true, data };
  } catch (error) {
    const message = error.response?.data?.message || "Failed to add badge";
    dispatch({
      type: ADD_BADGE_FAILURE,
      payload: message,
    });
    return { success: false, error: message };
  }
};

const badgeReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BADGES_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_BADGES_SUCCESS: {
      const { badges, pagination } = normalizeBadgesPayload(action.payload);
      return {
        ...state,
        loading: false,
        badges,
        pagination,
        error: null,
      };
    }
    case FETCH_BADGES_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case ADD_BADGE_REQUEST:
      return { ...state, addLoading: true, error: null };
    case ADD_BADGE_SUCCESS:
      return { ...state, addLoading: false, error: null };
    case ADD_BADGE_FAILURE:
      return { ...state, addLoading: false, error: action.payload };
    default:
      return state;
  }
};

export default badgeReducer;
