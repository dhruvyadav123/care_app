import alzheimerService from "../../Services/alzheimer";

const initialState = {
  loading: false,
  games: [],
  error: null,
  deleteLoading: false,
  editLoading: false,
  addLoading: false,
  pagination: {},
};

const FETCH_GAMES_REQUEST = "FETCH_ALZHEIMER_GAMES_REQUEST";
const FETCH_GAMES_SUCCESS = "FETCH_ALZHEIMER_GAMES_SUCCESS";
const FETCH_GAMES_FAILURE = "FETCH_ALZHEIMER_GAMES_FAILURE";
const DELETE_GAME_REQUEST = "DELETE_ALZHEIMER_GAME_REQUEST";
const DELETE_GAME_SUCCESS = "DELETE_ALZHEIMER_GAME_SUCCESS";
const DELETE_GAME_FAILURE = "DELETE_ALZHEIMER_GAME_FAILURE";
const EDIT_GAME_REQUEST = "EDIT_ALZHEIMER_GAME_REQUEST";
const EDIT_GAME_SUCCESS = "EDIT_ALZHEIMER_GAME_SUCCESS";
const EDIT_GAME_FAILURE = "EDIT_ALZHEIMER_GAME_FAILURE";
const ADD_GAME_REQUEST = "ADD_ALZHEIMER_GAME_REQUEST";
const ADD_GAME_SUCCESS = "ADD_ALZHEIMER_GAME_SUCCESS";
const ADD_GAME_FAILURE = "ADD_ALZHEIMER_GAME_FAILURE";

const normalizeSingleGame = (payload) =>
  payload?.data?.data ||
  payload?.data?.game ||
  payload?.data ||
  payload?.game ||
  payload;

const normalizeGamesPayload = (payload, page = 1, limit = 10) => {
  const rawGames =
    payload?.data?.data ||
    payload?.data?.games ||
    payload?.data ||
    payload?.games ||
    payload?.game ||
    payload;

  const games = Array.isArray(rawGames) ? rawGames : [];
  const rawPagination = payload?.pagination || payload?.data?.pagination;

  const pagination =
    rawPagination ||
    (Array.isArray(rawGames)
      ? {
          currentPage: page,
          totalItems: games.length,
          itemsPerPage: limit,
          totalPages: Math.max(1, Math.ceil(games.length / limit)),
        }
      : {});

  return { games, pagination };
};

export const fetchAlzheimerGames =
  (page = 1, limit = 10) =>
  async (dispatch) => {
    dispatch({ type: FETCH_GAMES_REQUEST });
    try {
      const data = await alzheimerService.getAdminGames({ page, limit });
      dispatch({
        type: FETCH_GAMES_SUCCESS,
        payload: { response: data, page, limit },
      });
    } catch (error) {
      dispatch({
        type: FETCH_GAMES_FAILURE,
        payload:
          error.response?.data?.message || "Failed to fetch Alzheimer games",
      });
    }
  };

export const addAlzheimerGame = (newGame) => async (dispatch) => {
  dispatch({ type: ADD_GAME_REQUEST });
  try {
    const data = await alzheimerService.createAdminGame(newGame);
    dispatch({ type: ADD_GAME_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ADD_GAME_FAILURE,
      payload: error.response?.data?.message || "Failed to add Alzheimer game",
    });
    throw error;
  }
};

export const editAlzheimerGame = (id, updatedData) => async (dispatch) => {
  dispatch({ type: EDIT_GAME_REQUEST });
  try {
    const data = await alzheimerService.updateAdminGame(id, updatedData);
    dispatch({ type: EDIT_GAME_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: EDIT_GAME_FAILURE,
      payload:
        error.response?.data?.message || "Failed to update Alzheimer game",
    });
    throw error;
  }
};

export const deleteAlzheimerGame = (id) => async (dispatch) => {
  dispatch({ type: DELETE_GAME_REQUEST });
  try {
    await alzheimerService.deleteAdminGame(id);
    dispatch({ type: DELETE_GAME_SUCCESS, payload: id });
  } catch (error) {
    dispatch({
      type: DELETE_GAME_FAILURE,
      payload:
        error.response?.data?.message || "Failed to delete Alzheimer game",
    });
    throw error;
  }
};

const alzheimerGamesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_GAMES_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_GAMES_SUCCESS: {
      const { response, page, limit } = action.payload;
      const { games, pagination } = normalizeGamesPayload(response, page, limit);
      return {
        ...state,
        loading: false,
        games,
        pagination,
        error: null,
      };
    }
    case FETCH_GAMES_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case DELETE_GAME_REQUEST:
      return { ...state, deleteLoading: true };
    case DELETE_GAME_SUCCESS:
      return {
        ...state,
        deleteLoading: false,
        pagination: {
          ...state.pagination,
          totalItems: Math.max(
            0,
            (state.pagination?.totalItems || state.games.length) - 1
          ),
        },
        games: state.games.filter((game) => game._id !== action.payload),
      };
    case DELETE_GAME_FAILURE:
      return { ...state, deleteLoading: false, error: action.payload };
    case EDIT_GAME_REQUEST:
      return { ...state, editLoading: true };
    case EDIT_GAME_SUCCESS: {
      const editedGame = normalizeSingleGame(action.payload);
      return {
        ...state,
        editLoading: false,
        error: null,
        games: state.games.map((game) =>
          game._id === editedGame?._id ? editedGame : game
        ),
      };
    }
    case EDIT_GAME_FAILURE:
      return { ...state, editLoading: false, error: action.payload };
    case ADD_GAME_REQUEST:
      return { ...state, addLoading: true };
    case ADD_GAME_SUCCESS: {
      const addedGame = normalizeSingleGame(action.payload);
      return {
        ...state,
        addLoading: false,
        error: null,
        pagination: {
          ...state.pagination,
          totalItems: (state.pagination?.totalItems || state.games.length) + 1,
        },
        games: addedGame?._id ? [addedGame, ...state.games] : state.games,
      };
    }
    case ADD_GAME_FAILURE:
      return { ...state, addLoading: false, error: action.payload };
    default:
      return state;
  }
};

export default alzheimerGamesReducer;
