import {configureStore} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useSelector} from "react-redux";
import shipsReducer from "./slices/shipsSlice.ts"

export const store = configureStore({
    reducer: {
        ships: shipsReducer
    }
});

export type RootState = ReturnType<typeof store.getState>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;