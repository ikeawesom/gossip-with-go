import type { ResponseType } from "../types/res";
import apiClient from "./axios.config";

export const userApi = {
    // get visiting user by username
    getVisitingUser: async (username: string): Promise<ResponseType> => {
        const response = await apiClient.get(`/users/${username}`);
        return response.data;
    },

    // get user followers
    getFollowers: async (username: string): Promise<ResponseType> => {
        const response = await apiClient.get(`/users/${username}/followers`);
        console.log("API RESPONSE:", response.data);
        return response.data
    },

    // get user followings
    getFollowings: async (username: string): Promise<ResponseType> => {
        const response = await apiClient.get(`/users/${username}/followings`);
        console.log("API RESPONSE:", response.data);
        return response.data
    },

    // edit profile
    editProfile: async (formData: FormData): Promise<ResponseType> => {
        const response = await apiClient.post(
            "/users/edit-profile",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        )
        console.log("API RESPONSE:", response.data);
        return response.data
    }
}