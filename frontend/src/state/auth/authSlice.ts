import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

import type {
    AuthState,
    LoginCredentials,
    SignupCredentials,
    ApiError,
    ForgotPasswordRequest,
    User
} from '../../types/auth';
import { AxiosError } from 'axios';
import { defaultError } from '../../lib/constants';
import { authApi } from '../../api/auth.api';

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

// async thunks
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            const response = await authApi.login(credentials);
            return response;

        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            console.log("Full error:", axiosError.response?.data)
            return rejectWithValue(
                axiosError.response?.data?.message || defaultError.message
            );
        }
    }
);

export const signupUser = createAsyncThunk(
    'auth/signup',
    async (credentials: SignupCredentials, { rejectWithValue }) => {
        try {
            const response = await authApi.signup(credentials);
            return response;

        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            console.error('Full error:', axiosError.response?.data);
            return rejectWithValue(
                axiosError.response?.data?.message || defaultError.message
            );
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authApi.logout();

        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            console.error('Full error:', axiosError.response?.data);
            return rejectWithValue(
                axiosError.response?.data?.message || defaultError.message
            );
        }
    }
);

export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authApi.getCurrentUser();
            return response;

        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            console.error('Full error:', axiosError.response?.data);
            return rejectWithValue(
                axiosError.response?.data?.message || defaultError.message
            );
        }
    }
);

export const sendPasswordResetEmail = createAsyncThunk(
    'auth/sendPassReset',
    async (credentials: ForgotPasswordRequest, { rejectWithValue }) => {
        try {
            const response = await authApi.forgotPassword({ username: credentials.username });
            return response;

        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            console.error('Full error:', axiosError.response?.data);
            return rejectWithValue(axiosError.response?.data?.message || defaultError.message)
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
    },
    extraReducers: (builder) => {
        // login
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.data.user;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.isAuthenticated = false;
            });

        // signup
        builder
            .addCase(signupUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // logout
        builder
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;

                // clear auth state even if logout fails
                state.user = null;
                state.isAuthenticated = false;
            });

        // check Auth
        builder
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action: PayloadAction<User>) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            });

        // send reset password email
        builder
            .addCase(sendPasswordResetEmail.pending, (state) => {
                state.isLoading = true;
                state.error = null
            })
            .addCase(sendPasswordResetEmail.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(sendPasswordResetEmail.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
    },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;