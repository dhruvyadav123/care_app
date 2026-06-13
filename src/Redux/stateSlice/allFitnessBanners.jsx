import fitnessService from "../../Services/fitnessBanner";

const initialState = {
  loading: false,
  banners1: [],
  banners2: [],
  banners3: [],
  error: null,
  deleteLoading: false,
  editLoading: false,
  addLoading: false,
  pagination: {},
};

// Action types
// Banner1
const FETCH_BANNER1_REQUEST = "FETCH_BANNER1_REQUEST";
const FETCH_BANNER1_SUCCESS = "FETCH_BANNER1_SUCCESS";
const FETCH_BANNER1_FAILURE = "FETCH_BANNER1_FAILURE";

const ADD_BANNER1_REQUEST = "ADD_BANNER1_REQUEST";
const ADD_BANNER1_SUCCESS = "ADD_BANNER1_SUCCESS";
const ADD_BANNER1_FAILURE = "ADD_BANNER1_FAILURE";

const EDIT_BANNER1_REQUEST = "EDIT_BANNER1_REQUEST";
const EDIT_BANNER1_SUCCESS = "EDIT_BANNER1_SUCCESS";
const EDIT_BANNER1_FAILURE = "EDIT_BANNER1_FAILURE";

const DELETE_BANNER1_REQUEST = "DELETE_BANNER1_REQUEST";
const DELETE_BANNER1_SUCCESS = "DELETE_BANNER1_SUCCESS";
const DELETE_BANNER1_FAILURE = "DELETE_BANNER1_FAILURE";

// Banner2
const FETCH_BANNER2_REQUEST = "FETCH_BANNER2_REQUEST";
const FETCH_BANNER2_SUCCESS = "FETCH_BANNER2_SUCCESS";
const FETCH_BANNER2_FAILURE = "FETCH_BANNER2_FAILURE";

const ADD_BANNER2_REQUEST = "ADD_BANNER2_REQUEST";
const ADD_BANNER2_SUCCESS = "ADD_BANNER2_SUCCESS";
const ADD_BANNER2_FAILURE = "ADD_BANNER2_FAILURE";

const EDIT_BANNER2_REQUEST = "EDIT_BANNER2_REQUEST";
const EDIT_BANNER2_SUCCESS = "EDIT_BANNER2_SUCCESS";
const EDIT_BANNER2_FAILURE = "EDIT_BANNER2_FAILURE";

const DELETE_BANNER2_REQUEST = "DELETE_BANNER2_REQUEST";
const DELETE_BANNER2_SUCCESS = "DELETE_BANNER2_SUCCESS";
const DELETE_BANNER2_FAILURE = "DELETE_BANNER2_FAILURE";

// Banner3
const FETCH_BANNER3_REQUEST = "FETCH_BANNER3_REQUEST";
const FETCH_BANNER3_SUCCESS = "FETCH_BANNER3_SUCCESS";
const FETCH_BANNER3_FAILURE = "FETCH_BANNER3_FAILURE";

const ADD_BANNER3_REQUEST = "ADD_BANNER3_REQUEST";
const ADD_BANNER3_SUCCESS = "ADD_BANNER3_SUCCESS";
const ADD_BANNER3_FAILURE = "ADD_BANNER3_FAILURE";

const EDIT_BANNER3_REQUEST = "EDIT_BANNER3_REQUEST";
const EDIT_BANNER3_SUCCESS = "EDIT_BANNER3_SUCCESS";
const EDIT_BANNER3_FAILURE = "EDIT_BANNER3_FAILURE";

const DELETE_BANNER3_REQUEST = "DELETE_BANNER3_REQUEST";
const DELETE_BANNER3_SUCCESS = "DELETE_BANNER3_SUCCESS";
const DELETE_BANNER3_FAILURE = "DELETE_BANNER3_FAILURE";


// ------------------ ACTIONS ------------------

// Banner1
export const fetchBanners1 = (page = 1, limit = 10) => async (dispatch) => {
  dispatch({ type: FETCH_BANNER1_REQUEST });
  try {
    const data = await fitnessService.getAll({ page, limit });
    dispatch({ type: FETCH_BANNER1_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FETCH_BANNER1_FAILURE,
      payload: error.response?.data?.message || "Failed to fetch banner1",
    });
  }
};

export const addBanner1 = (newBanner) => async (dispatch) => {
  dispatch({ type: ADD_BANNER1_REQUEST });
  try {
    const data = await fitnessService.add(newBanner);
    dispatch({ type: ADD_BANNER1_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ADD_BANNER1_FAILURE,
      payload: error.response?.data?.message || "Failed to add banner1",
    });
  }
};

export const editBanner1 = (id, updatedData) => async (dispatch) => {
  dispatch({ type: EDIT_BANNER1_REQUEST });
  try {
    const data = await fitnessService.edit(id, updatedData);
    dispatch({ type: EDIT_BANNER1_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: EDIT_BANNER1_FAILURE,
      payload: error.response?.data?.message || "Failed to edit banner1",
    });
  }
};

export const deleteBanner1 = (id) => async (dispatch) => {
  dispatch({ type: DELETE_BANNER1_REQUEST });
  try {
    await fitnessService.delete(id);
    dispatch({ type: DELETE_BANNER1_SUCCESS, payload: id });
  } catch (error) {
    dispatch({
      type: DELETE_BANNER1_FAILURE,
      payload: error.response?.data?.message || "Failed to delete banner1",
    });
  }
};


// Banner2
export const fetchBanners2 = (page = 1, limit = 10) => async (dispatch) => {
  dispatch({ type: FETCH_BANNER2_REQUEST });
  try {
    const data = await fitnessService.getAll1({ page, limit });
    dispatch({ type: FETCH_BANNER2_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FETCH_BANNER2_FAILURE,
      payload: error.response?.data?.message || "Failed to fetch banner2",
    });
  }
};

export const addBanner2 = (newBanner) => async (dispatch) => {
  dispatch({ type: ADD_BANNER2_REQUEST });
  try {
    const data = await fitnessService.add1(newBanner);
    dispatch({ type: ADD_BANNER2_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ADD_BANNER2_FAILURE,
      payload: error.response?.data?.message || "Failed to add banner2",
    });
  }
};

export const editBanner2 = (id, updatedData) => async (dispatch) => {
  dispatch({ type: EDIT_BANNER2_REQUEST });
  try {
    const data = await fitnessService.edit1(id, updatedData);
    dispatch({ type: EDIT_BANNER2_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: EDIT_BANNER2_FAILURE,
      payload: error.response?.data?.message || "Failed to edit banner2",
    });
  }
};

export const deleteBanner2 = (id) => async (dispatch) => {
  dispatch({ type: DELETE_BANNER2_REQUEST });
  try {
    await fitnessService.delete1(id);
    dispatch({ type: DELETE_BANNER2_SUCCESS, payload: id });
  } catch (error) {
    dispatch({
      type: DELETE_BANNER2_FAILURE,
      payload: error.response?.data?.message || "Failed to delete banner2",
    });
  }
};


// Banner3
export const fetchBanners3 = (page = 1, limit = 10) => async (dispatch) => {
  dispatch({ type: FETCH_BANNER3_REQUEST });
  try {
    const data = await fitnessService.getAll2({ page, limit });
    dispatch({ type: FETCH_BANNER3_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FETCH_BANNER3_FAILURE,
      payload: error.response?.data?.message || "Failed to fetch banner3",
    });
  }
};

export const addBanner3 = (newBanner) => async (dispatch) => {
  dispatch({ type: ADD_BANNER3_REQUEST });
  try {
    const data = await fitnessService.add2(newBanner);
    dispatch({ type: ADD_BANNER3_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ADD_BANNER3_FAILURE,
      payload: error.response?.data?.message || "Failed to add banner3",
    });
  }
};

export const editBanner3 = (id, updatedData) => async (dispatch) => {
  dispatch({ type: EDIT_BANNER3_REQUEST });
  try {
    const data = await fitnessService.edit2(id, updatedData);
    dispatch({ type: EDIT_BANNER3_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: EDIT_BANNER3_FAILURE,
      payload: error.response?.data?.message || "Failed to edit banner3",
    });
  }
};

export const deleteBanner3 = (id) => async (dispatch) => {
  dispatch({ type: DELETE_BANNER3_REQUEST });
  try {
    await fitnessService.delete2(id);
    dispatch({ type: DELETE_BANNER3_SUCCESS, payload: id });
  } catch (error) {
    dispatch({
      type: DELETE_BANNER3_FAILURE,
      payload: error.response?.data?.message || "Failed to delete banner3",
    });
  }
};


// ------------------ REDUCER ------------------

export const fitnessBannerReducer = (state = initialState, action) => {
  switch (action.type) {
    // Banner1
    case FETCH_BANNER1_REQUEST:
      return { ...state, loading: true };
    case FETCH_BANNER1_SUCCESS:
      return { ...state, loading: false, banners1: action.payload };
    case FETCH_BANNER1_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case ADD_BANNER1_SUCCESS:
      return { ...state, banners1: [action.payload, ...state.banners1] };
    case EDIT_BANNER1_SUCCESS:
      return {
        ...state,
        banners1: state.banners1.map((b) =>
          b._id === action.payload._id ? action.payload : b
        ),
      };
    case DELETE_BANNER1_SUCCESS:
      return {
        ...state,
        banners1: state.banners1.filter((b) => b._id !== action.payload),
      };

    // Banner2
    case FETCH_BANNER2_REQUEST:
      return { ...state, loading: true };
    case FETCH_BANNER2_SUCCESS:
      return { ...state, loading: false, banners2: action.payload };
    case FETCH_BANNER2_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case ADD_BANNER2_SUCCESS:
      return { ...state, banners2: [action.payload, ...state.banners2] };
    case EDIT_BANNER2_SUCCESS:
      return {
        ...state,
        banners2: state.banners2.map((b) =>
          b._id === action.payload._id ? action.payload : b
        ),
      };
    case DELETE_BANNER2_SUCCESS:
      return {
        ...state,
        banners2: state.banners2.filter((b) => b._id !== action.payload),
      };

    // Banner3
    case FETCH_BANNER3_REQUEST:
      return { ...state, loading: true };
    case FETCH_BANNER3_SUCCESS:
      return { ...state, loading: false, banners3: action.payload };
    case FETCH_BANNER3_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case ADD_BANNER3_SUCCESS:
      return { ...state, banners3: [action.payload, ...state.banners3] };
    case EDIT_BANNER3_SUCCESS:
      return {
        ...state,
        banners3: state.banners3.map((b) =>
          b._id === action.payload._id ? action.payload : b
        ),
      };
    case DELETE_BANNER3_SUCCESS:
      return {
        ...state,
        banners3: state.banners3.filter((b) => b._id !== action.payload),
      };

    default:
      return state;
  }
};
