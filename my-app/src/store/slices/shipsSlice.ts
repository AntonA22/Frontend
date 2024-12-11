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
        const state = thunkAPI.getState() as RootState; 
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

export const deleteShip = createAsyncThunk<T_Ship[], string, { state: RootState }>(
    "ships/delete_ship",
    async function(ship_id, thunkAPI) {
        await api.ships.shipsDeleteDelete(ship_id);
        
        const state = thunkAPI.getState() as RootState;
        const updatedShips = state.ships.ships.filter(ship => Number(ship.id) !== Number(ship_id));
        
        return updatedShips;
    }
);

export const updateShip = createAsyncThunk<void, { shipId: string, data: T_Ship }, { state: RootState }>(
    "ships/update_ship",
    async function({ shipId, data }) {
        try {
            const updatedData = {
                ...data,
                id: Number(data.id)  // Преобразуем строку в число
            };
            await api.ships.shipsUpdateUpdate(shipId, updatedData); // Вызов API для обновления данных корабля
        } catch (error) {
            console.error("Ошибка обновления корабля", error);
        }
    }
);

export const updateShipImage = createAsyncThunk<void, { shipId: string, image: File }, { state: RootState }>(
    "ships/update_ship_image",
    async ({ shipId, image }) => {
      try {
        const formData = new FormData();
        console.log(image);
        formData.append("image", image);
  
        await api.ships.shipsUpdateImageCreate(shipId, { image }, {
          body: formData,  
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          type: "multipart/form-data" as any, 
          format: "json",  
        });

      } catch (error) {
        console.error("Ошибка загрузки изображения", error);
      }
    }
  );

  export const createShip = createAsyncThunk<T_Ship, T_Ship, { state: RootState }>(
    "ships/createShip",
    async (data: T_Ship, { rejectWithValue }) => {
      try {
        const formattedData = {
          ...data,
          id: typeof data.id === "string" ? Number(data.id) : data.id,
        };
  
        const response = await api.ships.shipsCreateCreate(formattedData);
  
        if (response.data) {
          return response.data as T_Ship;
        }
        return rejectWithValue("No data received");
        
      } catch (error: unknown) {
        console.error("Ошибка при создании корабля:", error);

        if (error instanceof Error) {
          return rejectWithValue(error.message);
        }
        return rejectWithValue("Неизвестная ошибка");
      }
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
            state.selectedShip = null;
        });
        builder.addCase(fetchShip.fulfilled, (state: T_ShipsSlice, action: PayloadAction<T_Ship>) => {
            state.selectedShip = action.payload;
        });
        builder.addCase(deleteShip.fulfilled, (state: T_ShipsSlice, action: PayloadAction<T_Ship[]>) => {
            // Обновляем список кораблей после удаления
            state.ships = action.payload;
        });
        builder.addCase(createShip.fulfilled, (state: T_ShipsSlice, action:  PayloadAction<T_Ship>) => {
            const newShip = action.payload;
            state.ships.push(newShip); 
         });
    }
});

export const { updateShipName, removeSelectedShip } = shipsSlice.actions;

export default shipsSlice.reducer;