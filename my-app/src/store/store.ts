import { configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import shipsReducer from "./slices/shipsSlice";
import cookieReducer from "./slices/cookieSlice.ts";
import flightsReducer from "./slices/flightsSlice";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

export const store = configureStore({
    reducer: {
        ships: shipsReducer,  // Оставляем только эту строку
        cookie: cookieReducer,
        flights: flightsReducer
    }
});
export type AppThunkDispatch = ThunkDispatch<RootState, never, never>
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 

export const useAppDispatch = () => useDispatch<AppDispatch>(); // Тип dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
