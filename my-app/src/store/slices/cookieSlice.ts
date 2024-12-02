import { createSlice, PayloadAction } from "@reduxjs/toolkit"


const getCookie = (): string | null => {

  const cookie = document.cookie.split(";").find((row) => row.trim().startsWith("session_id="));
  return cookie ? cookie.split("=")[1] : null; 
  
};


interface CookieState {
    cookie: string | null; 
    id_user: number | null
  }
  
  // Начальное состояние
  const initialState: CookieState = {
    cookie: getCookie(),
    id_user: null
  };

const cookieSlice = createSlice (
  {

    name: "cookie",
    initialState, 
    reducers: {

      setIdUser : (state, action : PayloadAction<number>) => {
        state.id_user = action.payload
      },

      setCookie : (state, action : PayloadAction<string> ) => {
        state.cookie = action.payload;
      },

      delCookie : (state) => {
        state.cookie = null;
      }

    }

  }
)

export const {setCookie, delCookie, setIdUser} = cookieSlice.actions;
export default cookieSlice.reducer;