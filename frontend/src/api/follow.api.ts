import type { ResponseType } from "../types/res";
import apiClient from "./axios.config";

export const followApi = {
    // user to toggle follow on another user
    toggleFollow: async (following_id: number, follow_type: string): Promise<ResponseType> => {
        const response = await apiClient.post(`/follow/toggle`, { following_id, follow_type })
        console.log("API RESPONSE:", response.data)
        return response.data
    },
}