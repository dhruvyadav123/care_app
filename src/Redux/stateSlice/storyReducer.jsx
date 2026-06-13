import storyService from "../../Services/storyService";

const initialState = {
  loading: false,
  stories: [],
  error: null,
  deleteLoading: false,
  editLoading: false,
  addLoading: false,
  pagination: {},
};

const FETCH_STORIES_REQUEST = "FETCH_STORIES_REQUEST";
const FETCH_STORIES_SUCCESS = "FETCH_STORIES_SUCCESS";
const FETCH_STORIES_FAILURE = "FETCH_STORIES_FAILURE";
const DELETE_STORY_REQUEST = "DELETE_STORY_REQUEST";
const DELETE_STORY_SUCCESS = "DELETE_STORY_SUCCESS";
const DELETE_STORY_FAILURE = "DELETE_STORY_FAILURE";
const EDIT_STORY_REQUEST = "EDIT_STORY_REQUEST";
const EDIT_STORY_SUCCESS = "EDIT_STORY_SUCCESS";
const EDIT_STORY_FAILURE = "EDIT_STORY_FAILURE";
const ADD_STORY_REQUEST = "ADD_STORY_REQUEST";
const ADD_STORY_SUCCESS = "ADD_STORY_SUCCESS";
const ADD_STORY_FAILURE = "ADD_STORY_FAILURE";

const normalizeStoriesPayload = (payload) => {
  const stories =
    payload?.data?.data ||
    payload?.data?.stories ||
    payload?.data ||
    payload?.stories ||
    payload?.story ||
    payload?.results ||
    [];

  const pagination = payload?.pagination || payload?.data?.pagination || {};

  return {
    stories: Array.isArray(stories) ? stories : [],
    pagination,
  };
};

export const fetchStories = (page = 1, limit = 10) => async (dispatch) => {
  dispatch({ type: FETCH_STORIES_REQUEST });
  try {
    const data = await storyService.getAll({ page, limit });
    dispatch({ type: FETCH_STORIES_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FETCH_STORIES_FAILURE,
      payload: error.response?.data?.message || "Failed to fetch stories",
    });
  }
};

export const addStory = (newStory) => async (dispatch) => {
  dispatch({ type: ADD_STORY_REQUEST });
  try {
    const data = await storyService.add(newStory);
    dispatch({ type: ADD_STORY_SUCCESS, payload: data });
    return { success: true, data };
  } catch (error) {
    const message = error.response?.data?.message || "Failed to add story";
    dispatch({
      type: ADD_STORY_FAILURE,
      payload: message,
    });
    return { success: false, error: message };
  }
};

export const editStory = (id, updatedData) => async (dispatch) => {
  dispatch({ type: EDIT_STORY_REQUEST });
  try {
    const data = await storyService.edit(id, updatedData);
    dispatch({ type: EDIT_STORY_SUCCESS, payload: data });
    return { success: true, data };
  } catch (error) {
    const message = error.response?.data?.message || "Failed to edit story";
    dispatch({
      type: EDIT_STORY_FAILURE,
      payload: message,
    });
    return { success: false, error: message };
  }
};

export const deleteStory = (id) => async (dispatch) => {
  dispatch({ type: DELETE_STORY_REQUEST });
  try {
    await storyService.delete(id);
    dispatch({ type: DELETE_STORY_SUCCESS, payload: id });
  } catch (error) {
    dispatch({
      type: DELETE_STORY_FAILURE,
      payload: error.response?.data?.message || "Failed to delete story",
    });
  }
};

const storyReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_STORIES_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_STORIES_SUCCESS: {
      const { stories, pagination } = normalizeStoriesPayload(action.payload);
      return {
        ...state,
        loading: false,
        stories,
        pagination,
        error: null,
      };
    }
    case FETCH_STORIES_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case ADD_STORY_REQUEST:
      return { ...state, addLoading: true, error: null };
    case ADD_STORY_SUCCESS:
      return {
        ...state,
        addLoading: false,
        error: null,
      };
    case ADD_STORY_FAILURE:
      return { ...state, addLoading: false, error: action.payload };
    case EDIT_STORY_REQUEST:
      return { ...state, editLoading: true, error: null };
    case EDIT_STORY_SUCCESS:
      return {
        ...state,
        editLoading: false,
        error: null,
        stories: state.stories.map((story) => {
          const editedStory =
            action.payload?.data?.story ||
            action.payload?.data ||
            action.payload?.story ||
            action.payload;

          return story._id === editedStory?._id ? editedStory : story;
        }),
      };
    case EDIT_STORY_FAILURE:
      return { ...state, editLoading: false, error: action.payload };
    case DELETE_STORY_REQUEST:
      return { ...state, deleteLoading: true, error: null };
    case DELETE_STORY_SUCCESS:
      return {
        ...state,
        deleteLoading: false,
        stories: state.stories.filter((story) => story._id !== action.payload),
      };
    case DELETE_STORY_FAILURE:
      return { ...state, deleteLoading: false, error: action.payload };
    default:
      return state;
  }
};

export default storyReducer;
