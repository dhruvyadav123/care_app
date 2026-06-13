import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import EventService from '../../Services/eventListService';

const getEventList = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.events)) {
    return payload.events;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  return [];
};

// Thunks for async actions
export const fetchEvents = createAsyncThunk('events/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await EventService.getAll();
    return response;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const createEvent = createAsyncThunk('events/create', async (eventData, { rejectWithValue }) => {
  try {
    const response = await EventService.create(eventData);
    return response;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateEvent = createAsyncThunk('events/update', async ({ eventId, eventData }, { rejectWithValue }) => {
  try {
    const response = await EventService.update(eventId, eventData);
    return { eventId, response };
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteEvent = createAsyncThunk('admin/deleteEvent', async (eventId, { rejectWithValue }) => {
  try {
    
    await EventService.delete(eventId);
    return eventId;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Slice
const eventSlice = createSlice({
  name: 'events',
  initialState: {
    events: [],
    loading: false,
    submitting: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      })
      .addCase(updateEvent.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.submitting = false;

        const incomingEvents = getEventList(action.payload?.response);
        if (incomingEvents.length) {
          state.events = incomingEvents;
          return;
        }

        const updatedEvent =
          action.payload?.response?.event ||
          action.payload?.response?.data ||
          action.payload?.response?.updatedEvent;

        if (Array.isArray(state.events?.data)) {
          state.events.data = state.events.data.map((event) =>
            event?._id === action.payload.eventId ? { ...event, ...updatedEvent } : event
          );
        } else if (Array.isArray(state.events)) {
          state.events = state.events.map((event) =>
            event?._id === action.payload.eventId ? { ...event, ...updatedEvent } : event
          );
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || 'Unable to update event';
      })
      .addCase(deleteEvent.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.submitting = false;
        if (Array.isArray(state.events?.data)) {
          state.events.data = state.events.data.filter((event) => event?._id !== action.payload);
        } else if (Array.isArray(state.events)) {
          state.events = state.events.filter((event) => event?._id !== action.payload);
        }
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || 'Unable to delete event';
      });
  }
});

export default eventSlice.reducer;
