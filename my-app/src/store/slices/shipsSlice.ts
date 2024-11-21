import {createSlice} from "@reduxjs/toolkit";
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface ShipsSlice {
    ship_name: string;
}

const initialState: ShipsSlice = {
    ship_name: "",
}


const shipsSlice = createSlice({
    name: 'ships',
    initialState: initialState,
    reducers: {
        updateShipName: (state: ShipsSlice, action) => {
            state.ship_name = action.payload
        }
    }
})
export const useTitle = () => useSelector((state: RootState) => state.ships.ship_name);

export const { 
    updateShipName,
//    clearShipName,
} = shipsSlice.actions;

export default shipsSlice.reducer