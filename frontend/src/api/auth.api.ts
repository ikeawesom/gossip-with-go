import apiClient from './axios.config';
import type {
    AuthResponse,
    LoginCredentials,
    SignupCredentials,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    VerifyEmailRequest,
} from '../types/auth';

export const authApi = {
    // login
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    },

    // signup
    signup: async (credentials: SignupCredentials): Promise<{ message: string }> => {
        const response = await apiClient.post<{ message: string }>('/auth/signup', credentials);
        return response.data;
    },

    // logout
    logout: async (): Promise<void> => {
        await apiClient.post('/auth/logout');
    },

    // get current user (from cookie)
    getCurrentUser: async (): Promise<AuthResponse> => {
        const response = await apiClient.get<AuthResponse>('/auth/me');
        return response.data;
    },

    // refresh access token
    refreshToken: async (): Promise<void> => {
        await apiClient.post('/auth/refresh');
    },

    // verify email
    verifyEmail: async (data: VerifyEmailRequest): Promise<{ message: string }> => {
        const response = await apiClient.post<{ message: string }>('/auth/verify-email', data);
        return response.data;
    },

    // forgot password (send reset email)
    forgotPassword: async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
        const response = await apiClient.post<{ message: string }>('/auth/forgot-password', data);
        return response.data;
    },

    // reset password
    resetPassword: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
        const response = await apiClient.post<{ message: string }>('/auth/reset-password', data);
        return response.data;
    },
};