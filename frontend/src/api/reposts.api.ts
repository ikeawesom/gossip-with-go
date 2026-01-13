import { REQUEST_CURSOR_LIMIT, REQUEST_OFFSET } from "../lib/constants";
import type { RepostVisibility } from "../types/reposts";
import type { ResponseType } from "../types/res";
import apiClient from "./axios.config";

export const repostsApi = {
    // user to toggle repost
    toggleRepost: async (
        post_id: number,
        visibility: "public" | "friends" | "private" = "public"
    ): Promise<ResponseType> => {
        const response = await apiClient.post(`/reposts/toggle`, { post_id, visibility }) as ResponseType;
        console.log("API RESPONSE:", response)
        return response;
    },

    // check if current user has already reposted post
    getRepostStatus: async (post_id: number): Promise<ResponseType> => {
        const response = await apiClient.get(`/reposts/status`, { params: { post_id } });
        return response.data;
    },

    // get the number of reposts
    getReposters: async (
        post_id: number,
        limit: number = REQUEST_CURSOR_LIMIT,
        offset: number = REQUEST_OFFSET
    ): Promise<ResponseType> => {
        const response = await apiClient.get(`/reposts/reposters`, { params: { post_id, limit, offset } });
        return response.data;
    },

    // get all user reposts
    getUserReposts: async (
        user_id: number,
    ): Promise<ResponseType> => {
        const response = await apiClient.get(`/reposts/user/${user_id}`);
        return response.data;
    },

    // update reposts visibility - public, friends or private
    updateRepostVisibility: async (
        post_id: number,
        visibility: RepostVisibility
    ): Promise<ResponseType> => {
        const response = await apiClient.post(`/reposts/update-visibility`, { post_id, visibility });
        return response.data;
    },
};