export interface User {
    id: number;
    username: string;
    email: string;
    email_verified: boolean;

    follower_count: number;
    following_count: number;

    user_has_followed: boolean;
    user_is_being_followed: boolean;

    created_at: string;
}

export interface AuthResponse {
    data: { user: User };
    message?: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface SignupCredentials {
    username: string;
    email: string;
    password: string;
    confirm_password: string;
}

export interface ForgotPasswordRequest {
    username: string;
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