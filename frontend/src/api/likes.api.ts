import { REQUEST_CURSOR_LIMIT, REQUEST_OFFSET } from "../lib/constants";
import type { ResponseType } from "../types/res";
import apiClient from "./axios.config";

export const likesApi = {
    // user to toggle like on post or comment
    toggleLike: async (target_id: number, type: "post" | "comment"): Promise<ResponseType> => {
        const response = await apiClient.post(`/likes/toggle`, { target_id, type }) as ResponseType
        console.log("API RESPONSE:", response)
        return response
    },

    // check if current user has already liked post or comment
    getLikeStatus: async (id: number, type: "post" | "comment"): Promise<ResponseType> => {
        const response = await apiClient.get(`/likes/status`, { params: { type, id } });
        return response.data;
    },

    // get the likers and number of likes
    getLikers: async (
        id: number,
        type: "post" | "comment",
        limit: number = REQUEST_CURSOR_LIMIT,
        offset: number = REQUEST_OFFSET
    ): Promise<ResponseType> => {
        const response = await apiClient.get(`/likes/likers`, { params: { type, id, limit, offset } });
        return response.data;
    },

    // get the likes from user ID
    getLikesByType: async (id: number, likeable_type: "posts" | "comments"): Promise<ResponseType> => {
        const response = await apiClient.post(`/likes/by_type/${id}/${likeable_type}`);
        console.log("API RESPONSE:", response)
        return response as any as ResponseType;
    },
}