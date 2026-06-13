import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import DonateService from '../../Services/donateListServic';

// Thunks for async actions
export const fetchEvents = createAsyncThunk('donations/fetchItems', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in again.");
    }
    const response = await DonateService.getAll();
    console.log("eventlist reducer", response);
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});
export const fetchEvent = createAsyncThunk('donations/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const response = await DonateService.getAll2();
    console.log("eventlist reducer", response);
    return response;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const createEvent = createAsyncThunk('donations/createCategory', async (eventData, { rejectWithValue }) => {
  try {
    const response = await DonateService.create(eventData);
    return response;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateEvent = createAsyncThunk('donations/updateCategory', async ({ eventId, eventData }, { rejectWithValue }) => {
  try {
    const response = await DonateService.update(eventId, eventData);
    return response;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteEvent = createAsyncThunk('donations/deleteItem', async (eventId, { rejectWithValue }) => {
  try {
    
    await DonateService.delete(eventId);
    return eventId;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
export const deleteEvent2 = createAsyncThunk('donations/deleteCategory', async (eventId, { rejectWithValue }) => {
  try {
    
    await DonateService.delete2(eventId);
    return eventId;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
// Slice
const donateSlice = createSlice({
  name: 'donations',
  initialState: {
    events: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
       .addCase(fetchEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;

        if (Array.isArray(state.events)) {
          state.events.push(action.payload);
          return;
        }

        if (Array.isArray(state.events?.categories)) {
          state.events.categories = [...state.events.categories, action.payload];
          return;
        }

        if (Array.isArray(state.events?.donationItems)) {
          state.events.donationItems = [...state.events.donationItems, action.payload];
          return;
        }

        state.events = action.payload;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;

        if (Array.isArray(state.events)) {
          const index = state.events.findIndex((event) => event.id === action.payload.id);
          if (index !== -1) {
            state.events[index] = action.payload;
          }
          return;
        }

        if (Array.isArray(state.events?.categories)) {
          state.events.categories = state.events.categories.map((event) =>
            event.id === action.payload.id || event._id === action.payload._id ? action.payload : event
          );
          return;
        }

        if (Array.isArray(state.events?.donationItems)) {
          state.events.donationItems = state.events.donationItems.map((event) =>
            event.id === action.payload.id || event._id === action.payload._id ? action.payload : event
          );
        }
      })
         .addCase(deleteEvent2.fulfilled, (state, action) => {
        console.log("Deleted event ID in reducasaser:", state);
        // state.events = state.events.filter(event => event.id !== action.payload);
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        console.log("Deleted event ID in reducasaser:", state);
        // state.events = state.events.filter(event => event.id !== action.payload);
      });
      
  }
});

export default donateSlice.reducer;
