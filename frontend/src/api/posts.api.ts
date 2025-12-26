import type { CreatePostRequest } from "../types/post";
import type { ResponseType } from "../types/res";
import apiClient from "./axios.config";

export const postApi = {
    // get posts by username
    getPostByUsername: async (username: string): Promise<ResponseType> => {
        const response = await apiClient.get(`/posts/users/${username}`);
        console.log("API RESPONSE:", response.data);
        return response.data;
    },

    // get posts by topic
    getPostsByTopic: async (topic: string): Promise<ResponseType> => {
        const response = await apiClient.get(`/posts/topic/${topic}`);
        console.log("API RESPONSE:", response.data);
        return response.data;
    },

    createPost: async (postData: CreatePostRequest): Promise<ResponseType> => {
        const response = await apiClient.post(`/posts/create`, postData);
        console.log(response)
        return response.data;
    }

}