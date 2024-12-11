import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { T_Flight, T_Ship } from "src/modules/types.ts";
import { AxiosResponse } from "axios";
import { NEXT_YEAR } from "src/utils/consts.ts";
import { api } from "src/api";

const today = new Date();
today.setMonth(today.getMonth() - 1); 

// Типизация состояния слайса
type T_FlightsState = {
  draft_flight_id: number | null;
  ships_count: number | null;
  flight: T_Flight | null;
  flights: T_Flight[];
  filters: T_FlightsFilters;
  save_mm: boolean;
};

export type T_FlightsFilters = {
  date_formation_start: string;
  date_formation_end: string;
  status: number;
  user_name: string;
};

// Начальное состояние слайса
const initialState: T_FlightsState = {
  draft_flight_id: null,
  ships_count: null,
  flight: null,
  flights: [],
  filters: {
    status: 0,
    date_formation_start: today.toISOString().split("T")[0],
    date_formation_end: NEXT_YEAR.toISOString().split("T")[0],
    user_name: ""
  },
  save_mm: false,
};

// Async thunks
export const fetchFlight = createAsyncThunk<T_Flight, string>(
  "flights/fetchFlight",
  async (flight_id) => {
    const response = (await api.flights.flightsRead(flight_id)) as unknown as AxiosResponse<T_Flight>;
    console.log(flight_id)
    return response.data;
  }
);

export const fetchFlights = createAsyncThunk<T_Flight[], void, { state: { flights: T_FlightsState } }>(
  "flights/fetchFlights",
  async (_, { getState }) => {
    const { filters } = getState().flights;
    const response = (await api.flights.flightsList({
        status: filters.status,
        date_formation_start: filters.date_formation_start,
        date_formation_end: filters.date_formation_end,
    })) as unknown as AxiosResponse<T_Flight[]>;
    const filteredFlights = response.data.filter(flight => 
      filters.user_name ? flight.owner?.includes(filters.user_name) : true
    );
    return filteredFlights;
  }
);

export const removeShipFromDraftFlight = createAsyncThunk<T_Ship[], string, { state: { flights: T_FlightsState } }>(
    "flights/removeShipFromDraftFlight",
    async (ship_id, { getState }) => {
      const { flight } = getState().flights;
  
      if (!flight?.id) {
        throw new Error("Flight ID is required to remove a ship.");
      }
  
      const response = (await api.flights.flightsDeleteShipDelete(flight.id, ship_id)) as AxiosResponse<T_Ship[]>;
      return response.data;
    }
  );
  
  export const deleteDraftFlight = createAsyncThunk<void, void, { state: { flights: T_FlightsState } }>(
    "flights/deleteDraftFlight",
    async (_, { getState }) => {
      const { flight } = getState().flights;
  
      if (!flight?.id) {
        throw new Error("Flight ID is required to delete a draft flight.");
      }
  
      await api.flights.flightsDeleteDelete(flight.id);
    }
  );
  
  export const sendDraftFlight = createAsyncThunk<void, void, { state: { flights: T_FlightsState } }>(
    "flights/sendDraftFlight",
    async (_, { getState }) => {
      const { flight } = getState().flights;
  
      if (!flight?.id) {
        throw new Error("Flight ID is required to send a draft flight.");
      }
  
      await api.flights.flightsUpdateStatusUserUpdate(flight.id);
    }
  );
  
  export const updateFlight = createAsyncThunk<void, Partial<T_Flight>, { state: { flights: T_FlightsState } }>(
    "flights/updateFlight",
    async (data, { getState }) => {
      const { flight } = getState().flights;
  
      if (!flight?.id) {
        throw new Error("Flight ID is required to update a flight.");
      }
  
      await api.flights.flightsUpdateUpdate(flight.id, { ...data });
    }
  );
  
  export const updateShipValue = createAsyncThunk<void, { ship_id: string; payload2: number }, { state: { flights: T_FlightsState } }>(
    "flights/updateShipValue",
    async ({ ship_id, payload2 }, { getState }) => {
      const { flight } = getState().flights;
  
      if (!flight?.id) {
        throw new Error("Flight ID is required to update ship value.");
      }
  
      await api.flights.flightsUpdateShipUpdate(flight.id, ship_id, { payload: payload2 });
    }
  );

  export const updateFlightStatus = createAsyncThunk<T_Flight, { flightId: string; status: number }, { state: { flights: T_FlightsState } }>(
  "flights/updateFlightStatus",
  async ({ flightId, status }) => {
    const response = (await api.flights.flightsUpdateStatusAdminUpdate(flightId, { status })) as unknown as AxiosResponse<T_Flight>;
    return response.data;
  }
);

// Слайс
const flightsSlice = createSlice({
  name: "flights",
  initialState,
  reducers: {
    saveFlight: (state, action: PayloadAction<{ draft_flight_id: number; ships_count: number }>) => {
      state.draft_flight_id = action.payload.draft_flight_id;
      state.ships_count = action.payload.ships_count;
    },
    removeFlight: (state) => {
      state.flight = null;
    },
    UpdateMM: (state) => {
      state.save_mm = !state.save_mm;
    },
    updateFilters: (state, action: PayloadAction<T_FlightsFilters>) => {
      state.filters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlight.fulfilled, (state, action: PayloadAction<T_Flight>) => {
        state.flight = action.payload;
      })
      .addCase(fetchFlights.fulfilled, (state, action: PayloadAction<T_Flight[]>) => {
        state.flights = action.payload;
      })
      .addCase(removeShipFromDraftFlight.fulfilled, (state, action: PayloadAction<T_Ship[]>) => {
        if (state.flight) {
          state.flight.ships = action.payload;
        }
      })
      .addCase(sendDraftFlight.fulfilled, (state) => {
        state.flight = null;
      })
      .addCase(updateFlightStatus.fulfilled, (state, action) => {
        state.flights = state.flights.map(flight =>
          flight.id === action.payload.id ? action.payload : flight
        );
      });
  },
});

// Экспорт действий и редьюсера
export const { saveFlight, removeFlight, UpdateMM, updateFilters } = flightsSlice.actions;
export default flightsSlice.reducer;