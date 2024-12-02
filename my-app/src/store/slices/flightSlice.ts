import { createSlice, PayloadAction } from "@reduxjs/toolkit"


interface MySpareState {
    count : number
    idFlight : number 
    ships: { [id_ships: number]: number }
}

const initialState : MySpareState = {
    count: 0,
    idFlight: 0,
    ships: {}
}

const OrderSlice = createSlice({

    name: "order",
    initialState,
    reducers: {

        setShips (state, action : PayloadAction<{id_ship : number; count : number}>) {
            const {id_ship, count} = action.payload
            state.ships[id_ship] = count
        },

        // addShips (state, action : PayloadAction<number>){
        //     const id_ship = action.payload
        //     state.ships[id_ship] += 1
        // },

        // decSpares (state, action: PayloadAction<number>) {
        //     const id_spare = action.payload
        //     if (state.ships[id_spare] > 1) {
        //         state.ships[id_spare] -= 1
        //     }else {
        //         console.log("forbiden")
        //     }
        // },

        removeShips (state, action: PayloadAction<number>){
            const id_ship = action.payload
            delete state.ships[id_ship] 
        },

        clearShips (state){
            state.ships = {}
        },


        setIdFlight (state, action : PayloadAction<number>) {
            state.idFlight = action.payload
        },

        setCount(state, action: PayloadAction<number>) {
            state.count = action.payload
        },
        addShip (state) {
            state.count += 1
        },
        delShip (state) {
            state.count -= 1
        },
        removeFlight(state){
            state.count = 0
            state.idFlight = 0
        }
    }

})

// export const { setCount, addSpare, delSpare, removeOrder, setIdOrder, setSpares, addSpares, decSpares,  removeSpares, clearSpares} = OrderSlice.actions;
export const { setCount, addShip, delShip,removeFlight, setIdFlight, setShips, removeShips, clearShips} = OrderSlice.actions;
export default OrderSlice.reducer;