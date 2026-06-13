import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import expertEventService from "../../Services/expertEventService";

const LIVE_EVENT_STORAGE_KEY = "expertLiveEvents";

const readLiveEventOverrides = () => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const rawValue = window.localStorage.getItem(LIVE_EVENT_STORAGE_KEY);
    if (!rawValue) {
      return {};
    }

    const parsedValue = JSON.parse(rawValue);
    return parsedValue && typeof parsedValue === "object" ? parsedValue : {};
  } catch (error) {
    return {};
  }
};

const writeLiveEventOverrides = (overrides) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LIVE_EVENT_STORAGE_KEY, JSON.stringify(overrides));
};

const persistLiveEventOverride = (eventId, patch) => {
  if (!eventId) {
    return;
  }

  const overrides = readLiveEventOverrides();
  overrides[eventId] = {
    ...(overrides[eventId] || {}),
    ...patch,
  };
  writeLiveEventOverrides(overrides);
};

const mergeLiveOverrides = (events) => {
  const overrides = readLiveEventOverrides();

  return events.map((event) => {
    const override = overrides[event?._id];
    if (!override) {
      return event;
    }

    return {
      ...event,
      ...override,
      isLive: override.isLive ?? event?.isLive,
      status: override.status || event?.status,
    };
  });
};

const resolveEventListFromResponse = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  const candidates = [
    response?.data,
    response?.data?.data,
    response?.data?.events,
    response?.data?.result,
    response?.data?.results,
    response?.data?.docs,
    response?.data?.rows,
    response?.events,
    response?.result,
    response?.results,
    response?.docs,
    response?.rows,
    response?.payload?.data,
    response?.payload?.data?.data,
    response?.payload?.data?.events,
    response?.payload?.events,
    response?.payload?.result,
    response?.payload?.results,
    response?.payload?.docs,
    response?.payload?.rows,
  ];

  const matchedCandidate = candidates.find((candidate) => Array.isArray(candidate));
  return Array.isArray(matchedCandidate) ? matchedCandidate : [];
};

const resolveEventCountFromResponse = (response, events) =>
  Number(
    response?.count ??
      response?.data?.count ??
      response?.total ??
      response?.data?.total ??
      response?.totalCount ??
      response?.data?.totalCount ??
      response?.resultsCount ??
      response?.payload?.count ??
      response?.payload?.data?.count ??
      response?.payload?.total ??
      response?.payload?.totalCount
  ) || events.length;

export const fetchExpertEvents = createAsyncThunk(
  "expertEvents/fetchMyEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await expertEventService.getMyEvents();
      const events = resolveEventListFromResponse(response);

      return {
        events: mergeLiveOverrides(events),
        count: resolveEventCountFromResponse(response, events),
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Unable to fetch expert events");
    }
  }
);

export const createExpertEvent = createAsyncThunk(
  "expertEvents/createEvent",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await expertEventService.createMyEvent(formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Unable to create event");
    }
  }
);

export const updateExpertEvent = createAsyncThunk(
  "expertEvents/updateEvent",
  async ({ eventId, formData }, { rejectWithValue }) => {
    try {
      const response = await expertEventService.updateMyEvent(eventId, formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Unable to update event");
    }
  }
);

export const deleteExpertEvent = createAsyncThunk(
  "expertEvents/deleteEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      await expertEventService.deleteMyEvent(eventId);
      return eventId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Unable to delete event");
    }
  }
);

export const goLiveExpertEvent = createAsyncThunk(
  "expertEvents/goLiveEvent",
  async (eventOrId, { rejectWithValue }) => {
    const normalizedEvent =
      typeof eventOrId === "string" ? { _id: eventOrId } : eventOrId || {};
    const eventId =
      normalizedEvent?._id ||
      normalizedEvent?.id ||
      normalizedEvent?.eventId ||
      normalizedEvent?.sessionId;
    const liveStartedAt = new Date().toISOString();
    const livePatch = {
      isLive: true,
      status: "live",
      liveStartedAt,
    };

    if (!eventId) {
      return rejectWithValue("Unable to start live session");
    }

    const formPayload = new FormData();
    formPayload.append("isLive", "true");
    formPayload.append("status", "live");
    formPayload.append("liveStartedAt", liveStartedAt);

    try {
      const response = await expertEventService.goLiveMyEvent(eventId, formPayload);
      persistLiveEventOverride(eventId, livePatch);
      return { eventId, response, patch: livePatch, localOnly: false };
    } catch (formError) {
      try {
        const response = await expertEventService.goLiveMyEvent(eventId, livePatch);
        persistLiveEventOverride(eventId, livePatch);
        return { eventId, response, patch: livePatch, localOnly: false };
      } catch (fallbackError) {
        persistLiveEventOverride(eventId, livePatch);
        return { eventId, response: null, patch: livePatch, localOnly: true };
      }
    }
  }
);

const expertEventSlice = createSlice({
  name: "expertEvents",
  initialState: {
    events: [],
    count: 0,
    loading: false,
    actionLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpertEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpertEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.events;
        state.count = action.payload.count;
      })
      .addCase(fetchExpertEvents.rejected, (state, action) => {
        state.loading = false;
        state.events = [];
        state.count = 0;
        state.error = action.payload || "Unable to fetch expert events";
      })
      .addCase(createExpertEvent.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createExpertEvent.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(createExpertEvent.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Unable to create event";
      })
      .addCase(updateExpertEvent.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateExpertEvent.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(updateExpertEvent.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Unable to update event";
      })
      .addCase(deleteExpertEvent.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteExpertEvent.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.events = state.events.filter((event) => event._id !== action.payload);
        state.count = Math.max(0, state.count - 1);
      })
      .addCase(deleteExpertEvent.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Unable to delete event";
      })
      .addCase(goLiveExpertEvent.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(goLiveExpertEvent.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.events = state.events.map((event) =>
          event?._id === action.payload.eventId
            ? {
                ...event,
                ...action.payload.patch,
              }
            : event
        );
      })
      .addCase(goLiveExpertEvent.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Unable to start live session";
      });
  },
});

export const expertEventReducer = expertEventSlice.reducer;
export default expertEventSlice.reducer;
