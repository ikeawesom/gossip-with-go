import type { ResponseType } from "../types/res";
import apiClient from "./axios.config";

export const userApi = {
    // get visiting user by username
    getVisitingUser: async (username: string): Promise<ResponseType> => {
        const response = await apiClient.get(`/users/${username}`);
        return response.data;
    },
}