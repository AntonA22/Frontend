import {createSlice} from "@reduxjs/toolkit";

type T_ShipsSlice = {
    ship_name: string
}

const initialState:T_ShipsSlice = {
    ship_name: "",
}


const shipsSlice = createSlice({
    name: 'ships',
    initialState: initialState,
    reducers: {
        updateShipName: (state, action) => {
            state.ship_name = action.payload
        }
    }
})

export const { updateShipName} = shipsSlice.actions;

export default shipsSlice.reducer