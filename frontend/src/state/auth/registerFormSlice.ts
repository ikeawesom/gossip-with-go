import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { errorType, tokenType } from "./constants";
import { defaultError } from "../../lib/constants";

interface registerFormState {
    email: string;
    first_name: string;
    last_name: string;
    username: string;
    password: string;
    passwordCfm: string;
    isLoading: boolean;
    error?: errorType
    jwt_token?: tokenType;
}

const initialState: registerFormState = {
    email: "",
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    passwordCfm: "",
    isLoading: false
}

interface registerCfmEntry {
    email: string,
    first_name: string,
    last_name: string,
    username: string,
    passwordCfm: string,
}

export const registerAsync = createAsyncThunk<tokenType, registerCfmEntry, { rejectValue: errorType }>(
    "registerForm/Register",
    async (credentials, { rejectWithValue }) => {
        const { email, first_name, last_name, passwordCfm, username } = credentials;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // handle registration here
        // ...

        // simulate the registration
        const { data, error } = {
            data: { jwt_token: "mock-jwt-token", user_id: "000", name: first_name },
            error: null
            // { code: 401, message: "Invalid credentials" }
        };

        // handle cases after registration attempt
        if (error) {
            return rejectWithValue(error);
        }

        return data;
    }
);

const registerFormSlice = createSlice({
    name: "registerForm",
    initialState,
    reducers: {
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
        setFirstName: (state, action: PayloadAction<string>) => {
            state.first_name = action.payload;
        },
        setLastName: (state, action: PayloadAction<string>) => {
            state.last_name = action.payload;
        },
        setUsername: (state, action: PayloadAction<string>) => {
            state.username = action.payload;
        },
        setPassword: (state, action: PayloadAction<string>) => {
            state.password = action.payload;
        },
        setPasswordCfm: (state, action: PayloadAction<string>) => {
            state.passwordCfm = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(registerAsync.pending, (state) => {
            state.isLoading = true;
            state.error = undefined;
        })
            .addCase(registerAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.jwt_token = action.payload;
                console.log(action.payload);
            })
            .addCase(registerAsync.rejected, (state, action) => {
                state.isLoading = false;
                console.log(action.payload)
                state.error = action.payload || defaultError;
            });
    }
})

export const { setUsername, setPassword, setEmail, setFirstName, setLastName, setPasswordCfm } = registerFormSlice.actions;
export default registerFormSlice.reducer;
