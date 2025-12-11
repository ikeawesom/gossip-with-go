import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { errorType, tokenType } from "./constants";
import { defaultError } from "../../lib/constants";

interface loginFormState {
    username: string;
    password: string;
    isLoading: boolean;
    error?: errorType
    jwt_token?: tokenType;
}

const initialState: loginFormState = {
    username: "",
    password: "",
    isLoading: false,
}

interface loginCfmEntry { username: string; password: string }

export const loginAsync = createAsyncThunk<tokenType, loginCfmEntry, { rejectValue: errorType }>(
    "loginForm/login",
    async (credentials, { rejectWithValue }) => {
        const { } = credentials
        // handle login here
        // ...

        // simulate the login
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const { data, error } = {
            data: { jwt_token: "mock-jwt-token", user_id: "000", name: "Ike" },
            error: null
            // { code: 401, message: "Invalid credentials" }
        };

        // case handling after login attempt
        if (error) {
            return rejectWithValue(error);
        }
        console.log(credentials);
        return data;
    }
);

const loginFormSlice = createSlice({
    name: "loginForm",
    initialState,
    reducers: {
        setUsername: (state, action: PayloadAction<string>) => {
            state.username = action.payload;
        },
        setPassword: (state, action: PayloadAction<string>) => {
            state.password = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginAsync.pending, (state) => {
            state.isLoading = true;
            state.error = undefined;
        })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.jwt_token = action.payload;
                console.log(action.payload);
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.isLoading = false;
                console.log(action.payload)
                state.error = action.payload || defaultError;
            });
    }
})

export const { setUsername, setPassword } = loginFormSlice.actions;
export default loginFormSlice.reducer;
