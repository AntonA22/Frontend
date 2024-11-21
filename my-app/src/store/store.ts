import {configureStore} from "@reduxjs/toolkit";
import shipsReducer from "./slices/shipsSlice.ts"

export const store = configureStore({
    reducer: {
        ships: shipsReducer
    }
});

export type RootState = ReturnType<typeof store.getState>
