/* eslint-disable @typescript-eslint/no-explicit-any */
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit"
import {T_LoginCredentials, T_RegisterCredentials, T_User} from "src/modules/types.ts";
import {AxiosResponse} from "axios";
import { api } from "src/api";

const initialState:T_User = {
    id: -1,
    username: "",
    email: "",
    password: "",
    is_authenticated: false,
    validation_error: false,
    validation_success: false,
    checked: false,
    first_name: "",
    last_name: ""
}

export const handleCheck = createAsyncThunk<T_User, void>(
    "check",
    async function () {
        const storedUser = localStorage.getItem('user');
        console.log('user', storedUser);

        if (storedUser) {
            // Если данные есть в localStorage, возвращаем их
            return JSON.parse(storedUser);
        }

        const response = await api.users.usersLoginCreate({
            username: "",
            password: ""
        }) as unknown as AxiosResponse<T_User>;
        return response.data;
    }
);

export const handleLogin = createAsyncThunk<T_User, T_LoginCredentials>(
    "login",
    async function ({ username, password }: T_LoginCredentials) {
        const response = await api.users.usersLoginCreate({
            username,
            password
        }) as unknown as AxiosResponse<T_User>;
        localStorage.setItem('user', JSON.stringify(response.data.username))
        console.log(response.data.username);

        return response.data;
    }
);

export const handleRegister = createAsyncThunk<T_User, T_RegisterCredentials>(
    "register",
    async function ({ username, email, password, first_name, last_name }: T_RegisterCredentials) {
        const response = await api.users.usersRegisterCreate({
            username,
            email,
            password,
            first_name,
            last_name
        }) as unknown as AxiosResponse<T_User>;

        return response.data;
    }
);

export const handleLogout = createAsyncThunk<void>(
    "logout",
    async function () {
        await api.users.usersLogoutCreate();
        localStorage.removeItem('user');
    }
    
);

export const handleUpdateProfile = createAsyncThunk<T_User, T_RegisterCredentials>(
    "updateProfile",
    async function (userData: T_RegisterCredentials, thunkAPI) {
        const state: any = thunkAPI.getState();
        const { username, email, password, first_name, last_name} = userData;
        console.log("here")
        console.log("Состояние перед запросом:", state);
        const response = await api.users.usersUpdateUpdate(state.cookie.id, {
            username,
            email,
            password,
            first_name,
            last_name

        }) as AxiosResponse<T_User>;
        console.log("Запрос выполнен, ответ:", response);
        return response.data;
    }
);

const cookieSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        setValidationError: (state, action) => {
            state.validation_error = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(handleLogin.fulfilled, (state: T_User, action: PayloadAction<T_User>) => {
            console.log(action.payload)
            state.is_authenticated = true;
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.password = action.payload.password
            state.first_name = action.payload.first_name
            state.last_name = action.payload.last_name
        });
        builder.addCase(handleRegister.fulfilled, (state: T_User, action: PayloadAction<T_User>) => {
            state.is_authenticated = true;
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.password = action.payload.password
            state.first_name = action.payload.first_name
            state.last_name = action.payload.last_name
        });
        builder.addCase(handleLogout.fulfilled, (state: T_User) => {
            state.is_authenticated = false;
            state.id = -1;
            state.username = "";
            state.email = "";
            state.validation_error = false;
            state.password = ""
            state.first_name = ""
            state.last_name = ""

        });
        builder.addCase(handleCheck.fulfilled, (state: T_User, action: PayloadAction<T_User>) => {
            state.is_authenticated = true;
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.checked = true;
            state.password = action.payload.password
            state.first_name = action.payload.first_name
            state.last_name = action.payload.last_name
        });
        builder.addCase(handleCheck.rejected, (state: T_User) => {
            state.is_authenticated = false;
            state.id = -1;
            state.username = "";
            state.email = "";
            state.password = ""
            state.validation_error = false;
            state.checked = true;
        });
        builder.addCase(handleUpdateProfile.fulfilled, (state: T_User, action: PayloadAction<T_User>) => {
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.validation_error = false;
            state.validation_success = true;
            state.password = action.payload.password
            state.first_name = action.payload.first_name
            state.last_name = action.payload.last_name
        });
        builder.addCase(handleUpdateProfile.rejected, (state: T_User) => {
            state.validation_error = true;
            state.validation_success = false;
        });
    }
});

export const { setValidationError } = cookieSlice.actions;

export default cookieSlice.reducer;
