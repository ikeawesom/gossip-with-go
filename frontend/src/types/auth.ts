export interface User {
    id: number;
    username: string;
    email: string;
    created_at: string;
    email_verified: boolean;
}

export interface AuthResponse {
    user: User;
    message?: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface SignupCredentials {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    confirm_password: string;
}

export interface ForgotPasswordRequest {
    username: string;
    email?: string;
}

export interface ResetPasswordRequest {
    token: string;
    new_password: string;
    confirm_password: string;
}

export interface VerifyEmailRequest {
    token: string;
}

export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}