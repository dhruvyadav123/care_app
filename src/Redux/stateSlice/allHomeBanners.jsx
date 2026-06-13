import homeBannersService from "../../Services/homeBanner";

const initialState = {
  loading: false,
  banners: [],
  error: null,
  deleteLoading: false,
  editLoading: false,
  addLoading: false,
  pagination: {},
};

// Action Types
const FETCH_BANNERS_REQUEST = "FETCH_BANNERS_REQUEST";
const FETCH_BANNERS_SUCCESS = "FETCH_BANNERS_SUCCESS";
const FETCH_BANNERS_FAILURE = "FETCH_BANNERS_FAILURE";
const DELETE_BANNER_REQUEST = "DELETE_BANNER_REQUEST";
const DELETE_BANNER_SUCCESS = "DELETE_BANNER_SUCCESS";
const DELETE_BANNER_FAILURE = "DELETE_BANNER_FAILURE";

// Action Creators
export const fetchBanners = (page = 1, limit = 10) => async (dispatch) => {
  dispatch({ type: FETCH_BANNERS_REQUEST });
  try {
    const response = await homeBannersService.getAll({ page, limit });
    console.log("API Response - Fetch Banners:", response);

    dispatch({
      type: FETCH_BANNERS_SUCCESS,
      payload: response.data || response, // Ensuring correct API response structure
    });
  } catch (error) {
    dispatch({
      type: FETCH_BANNERS_FAILURE,
      payload: error.response?.data?.message || "Failed to fetch banners",
    });
  }
};

export const deleteBanner = (id) => async (dispatch) => {
  dispatch({ type: DELETE_BANNER_REQUEST });
  try {
    await homeBannersService.delete(id);
    dispatch({ type: DELETE_BANNER_SUCCESS, payload: id });
  } catch (error) {
    dispatch({
      type: DELETE_BANNER_FAILURE,
      payload: error.response?.data?.message || "Failed to delete banner",
    });
  }
};

// Reducer
export const homeBannerReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BANNERS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_BANNERS_SUCCESS:
      console.log("Reducer - FETCH_BANNERS_SUCCESS", action.payload);
      return {
        ...state,
        loading: false,
        banners: Array.isArray(action.payload) ? action.payload : [], // Ensuring array format
        pagination: action.payload?.pagination || { totalItems: 0 },
        error: null,
      };

    case FETCH_BANNERS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case DELETE_BANNER_SUCCESS:
      return {
        ...state,
        deleteLoading: false,
        banners: state.banners.filter((banner) => banner._id !== action.payload),
      };

    default:
      return state;
  }
};
