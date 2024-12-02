import {configureStore} from "@reduxjs/toolkit";
import shipsReducer from "./slices/shipsSlice.ts"
import cookieReducer from "./slices/cookieSlice.ts"
import flightReducer from "./slices/flightSlice.ts"

export const store = configureStore({
    reducer: {
        ships: shipsReducer,
        cookie: cookieReducer,
        flight: flightReducer,
        // ship: shipReducer
    }
});

export type RootState = ReturnType<typeof store.getState>
