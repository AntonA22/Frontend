import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { T_Ship, T_ShipsListResponse } from "src/modules/types.ts";
import  {saveFlight}  from "./flightsSlice.ts";
import { api } from "src/api";
import { AxiosResponse } from "axios";
import { RootState, AppDispatch } from "../store";

type T_ShipsSlice = {
    ship_name: string;
    selectedShip: null | T_Ship;
    ships: T_Ship[];
};

const initialState: T_ShipsSlice = {
    ship_name: "",
    selectedShip: null,
    ships: []
};

export const fetchShip = createAsyncThunk<T_Ship, string, { state: RootState }>(
    "fetch_ship",
    async function(id) {
        const response = await api.ships.shipsRead(id) as AxiosResponse<T_Ship>;
        return response.data;
    }
);

export const fetchShips = createAsyncThunk<T_Ship[], object, { state: RootState; dispatch: AppDispatch }>(
    "fetch_ships",
    async function(_, thunkAPI) {
        const state = thunkAPI.getState() as RootState; // Указываем тип состояния
        const response = await api.ships.shipsList({
            ship_name: state.ships.ship_name
        }) as unknown as AxiosResponse<T_ShipsListResponse>; // Приведение типа через unknown

        thunkAPI.dispatch(saveFlight({
            draft_flight_id: response.data.draft_flight_id,
            ships_count: response.data.ships_count
        }));
        return response.data.ships;
    }
);

export const addShipToFlight = createAsyncThunk<void, string, { state: RootState }>(
    "ships/add_ship_to_flight",
    async function(ship_id) {
        await api.ships.shipsAddToFlightCreate(ship_id);
    }
);

const shipsSlice = createSlice({
    name: 'ships',
    initialState: initialState,
    reducers: {
        updateShipName: (state, action) => {
            state.ship_name = action.payload;
        },
        removeSelectedShip: (state) => {
            state.selectedShip = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchShips.fulfilled, (state: T_ShipsSlice, action: PayloadAction<T_Ship[]>) => {
            state.ships = action.payload;
        });
        builder.addCase(fetchShip.fulfilled, (state: T_ShipsSlice, action: PayloadAction<T_Ship>) => {
            state.selectedShip = action.payload;
        });
    }
});

export const { updateShipName, removeSelectedShip } = shipsSlice.actions;

export default shipsSlice.reducer;