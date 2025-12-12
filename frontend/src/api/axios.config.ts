import axios from 'axios';
import type { AxiosError } from "axios";

declare module 'axios' {
    export interface InternalAxiosRequestConfig {
        _retry?: boolean;
    }
}

// base URL configuration
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// request interceptor to add auth headers
apiClient.interceptors.request.use(
    (config) => {
        // You can add custom headers here if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// response interceptor for global error handling
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config;

        // if access token expired (401) for the first time
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await apiClient.post('/auth/refresh');

                // retry the original request
                return apiClient(originalRequest);
            } catch (refreshError) {
                // refresh failed - user needs to log in again
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;