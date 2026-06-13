import gameService from "../../Services/gamesBanner";



const initialState = {
  loading: false,
  games: [],
  error: null,
  deleteLoading: false,
  editLoading: false,
  addLoading: false,
  pagination: {},
};

// Action types
const FETCH_GAMES_REQUEST = 'FETCH_GAMES_REQUEST';
const FETCH_GAMES_SUCCESS = 'FETCH_GAMES_SUCCESS';
const FETCH_GAMES_FAILURE = 'FETCH_GAMES_FAILURE';
const DELETE_GAME_REQUEST = 'DELETE_GAME_REQUEST';
const DELETE_GAME_SUCCESS = 'DELETE_GAME_SUCCESS';
const DELETE_GAME_FAILURE = 'DELETE_GAME_FAILURE';
const EDIT_GAME_REQUEST = 'EDIT_GAME_REQUEST';
const EDIT_GAME_SUCCESS = 'EDIT_GAME_SUCCESS';
const EDIT_GAME_FAILURE = 'EDIT_GAME_FAILURE';
const ADD_GAME_REQUEST = 'ADD_GAME_REQUEST';
const ADD_GAME_SUCCESS = 'ADD_GAME_SUCCESS';
const ADD_GAME_FAILURE = 'ADD_GAME_FAILURE';

// Fetch games
export const fetchGames = (page = 1, limit = 10) => async (dispatch) => {
  dispatch({ type: FETCH_GAMES_REQUEST });
  try {
    const data = await gameService.getAll({ page, limit });
    dispatch({ type: FETCH_GAMES_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FETCH_GAMES_FAILURE,
      payload: error.response?.data?.message || 'Failed to fetch games',
    });
  }
};

// Delete game
export const deleteGame = (id) => async (dispatch) => {
  dispatch({ type: DELETE_GAME_REQUEST });
  try {
    await gameService.delete(id);
    dispatch({ type: DELETE_GAME_SUCCESS, payload: id });
  } catch (error) {
    dispatch({
      type: DELETE_GAME_FAILURE,
      payload: error.response?.data?.message || 'Failed to delete game',
    });
  }
};

// Edit game
export const editGame = (id, updatedData) => async (dispatch) => {
  dispatch({ type: EDIT_GAME_REQUEST });
  try {
    const data = await gameService.edit(id, updatedData);
    dispatch({ type: EDIT_GAME_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: EDIT_GAME_FAILURE,
      payload: error.response?.data?.message || 'Failed to edit game',
    });
  }
};

// Add game
export const addGame = (newGame) => async (dispatch) => {
  dispatch({ type: ADD_GAME_REQUEST });
  try {
    const data = await gameService.add(newGame);
    dispatch({ type: ADD_GAME_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ADD_GAME_FAILURE,
      payload: error.response?.data?.message || 'Failed to add game',
    });
  }
};

// Games reducer
export const gamesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_GAMES_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_GAMES_SUCCESS:
      return {
        ...state,
        loading: false,
        games: action.payload.data,
        pagination: action.payload.pagination,
        error: null,
      };
    case FETCH_GAMES_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case DELETE_GAME_REQUEST:
      return { ...state, deleteLoading: true };
    case DELETE_GAME_SUCCESS:
      return {
        ...state,
        deleteLoading: false,
        games: state.games.filter((game) => game._id !== action.payload),
      };
    case DELETE_GAME_FAILURE:
      return { ...state, deleteLoading: false, error: action.payload };
    case EDIT_GAME_REQUEST:
      return { ...state, editLoading: true };
    case EDIT_GAME_SUCCESS:
      return {
        ...state,
        editLoading: false,
        games: state.games.map((game) =>
          game._id === action.payload._id ? action.payload : game
        ),
      };
    case EDIT_GAME_FAILURE:
      return { ...state, editLoading: false, error: action.payload };
    case ADD_GAME_REQUEST:
      return { ...state, addLoading: true };
    case ADD_GAME_SUCCESS:
      return {
        ...state,
        addLoading: false,
        games: [action.payload, ...state.games],
      };
    case ADD_GAME_FAILURE:
      return { ...state, addLoading: false, error: action.payload };
    default:
      return state;
  }
};
