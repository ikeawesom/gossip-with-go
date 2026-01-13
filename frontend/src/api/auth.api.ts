import apiClient from './axios.config';
import type {
    AuthResponse,
    LoginCredentials,
    SignupCredentials,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    VerifyEmailRequest,
    User,
} from '../types/auth';

export const authApi = {
    // login
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    },

    // signup
    signup: async (credentials: SignupCredentials): Promise<{ message: string }> => {
        console.log("here");
        const response = await apiClient.post<{ message: string }>('/auth/signup', credentials);
        console.log(response);
        return response.data;
    },

    // logout
    logout: async (): Promise<void> => {
        await apiClient.post('/auth/logout');
    },

    // get current user (from cookie)
    getCurrentUser: async (): Promise<User> => {
        const response = await apiClient.get<AuthResponse>('/auth/me');
        const user = response.data.data.user;
        return user;
    },

    // refresh access token
    refreshToken: async (): Promise<void> => {
        await apiClient.post('/auth/refresh');
    },

    // verify email after registration
    verifyEmail: async (token: string): Promise<{ message: string }> => {
        const response = await apiClient.post<{ message: string }>('/auth/verify-email', { token });
        return response.data;
    },

    // send verification email
    sendVerification: async (email: string): Promise<{ message: string }> => {
        const response = await apiClient.post<{ message: string }>('/auth/send-verification', { email });
        return response.data;
    },

    // forgot password (send reset email)
    forgotPassword: async (data: ForgotPasswordRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/forgot-password', data);
        return response.data;
    },

    // reset password
    resetPassword: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
        const response = await apiClient.post<{ message: string }>('/auth/reset-password', data);
        return response.data;
    },

    // check reset token validity
    checkResetToken: async (token: string): Promise<{ success: boolean }> => {
        const response = await apiClient.post<{ success: boolean }>('/auth/check-reset-token', { token });
        return response.data;
    }
};