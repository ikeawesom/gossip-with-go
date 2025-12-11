import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { errorType } from "./constants";
import { defaultError } from "../../lib/constants";

interface passwordFormState {
    username: string;
    isLoading: boolean;
    error?: errorType;
    email?: string;
}

const initialState: passwordFormState = {
    username: "",
    isLoading: false
}

interface PayloadData {
    username: string;
    email: string;
}

interface fgPassType {
    email: string;
    username: string;
}

interface fgPasswordEntry { username: string; }

export const fgPassAsync = createAsyncThunk<fgPassType, fgPasswordEntry, { rejectValue: errorType }>(
    "fgPasswordForm/fg",
    async (credentials, { rejectWithValue }) => {
        const { username } = credentials;
        // handle username check
        // ...

        // username exists -> send reset password link to email
        // ...

        // simulate process
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const { data, error } = {
            data: { username, email: "test123@test.com" },
            error: null
            // { code: 401, message: "The username entered is not part of the family. Try signing up first!" }
        };

        // case handling after reset password attempt
        if (error) {
            return rejectWithValue(error);
        }
        console.log(data);
        return data;
    }
);

const fgPasswordFormSlice = createSlice({
    name: "fgPasswordForm",
    initialState,
    reducers: {
        setUsername: (state, action: PayloadAction<string>) => {
            state.username = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fgPassAsync.pending, (state) => {
            state.isLoading = true;
            state.error = undefined;
        })
            .addCase(fgPassAsync.fulfilled, (state, action: PayloadAction<PayloadData>) => {
                state.isLoading = false;
                state.email = action.payload.email;
            })
            .addCase(fgPassAsync.rejected, (state, action) => {
                state.isLoading = false;
                console.log(action.payload)
                state.error = action.payload || defaultError;
            });
    }
})

export const { setUsername } = fgPasswordFormSlice.actions;
export default fgPasswordFormSlice.reducer;
