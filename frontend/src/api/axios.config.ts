import axios from 'axios';

declare module 'axios' {
    export interface InternalAxiosRequestConfig {
        _retry?: boolean;
    }
}

// base URL configuration
const BASE_URL = "/api";

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
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;