import type { PaginationType } from "../hooks/usePagination";
import type { PaginationParams } from "../types/post";
import type { ResponseType } from "../types/res";
import apiClient from "./axios.config";

export const postApi = {
    // get posts by username
    getPostByUsername: async (username: string): Promise<ResponseType> => {
        const response = await apiClient.get(`/posts/users/${username}`);
        return response.data;
    },

    // get posts by topic
    getPostsByTopic: async (topic: number): Promise<ResponseType> => {
        const response = await apiClient.get(`/posts/topic/${topic}`);
        return response.data;
    },

    // create new post
    createPost: async (postData: FormData): Promise<ResponseType> => {
        const response = await apiClient.post(
            `/posts/create`,
            postData,
            { headers: { "Content-Type": "multipart/form-data" } }
        )

        return response.data;
    },

    // get post by username and postID
    getUserPostByID: async (username: string, postID: string): Promise<ResponseType> => {
        const response = await apiClient.get(`/posts/users/${username}/${postID}`);
        return response.data;
    },

    // edit post by postID
    editPostByID: async (postData: FormData): Promise<ResponseType> => {
        const response = await apiClient.post(
            `/posts/edit`,
            postData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );

        console.log("API RESPONSE:", response.data)
        return response.data
    },

    // delete post by postID
    deletePostByID: async (postID: number): Promise<ResponseType> => {
        const response = await apiClient.post(`/posts/delete/${postID}`);
        console.log("API RESPONSE:", response.data)
        return response.data
    },

    // get posts for pagination
    getPaginationPosts: async (paginationType: PaginationType, params?: PaginationParams): Promise<ResponseType> => {
        const queryParams = new URLSearchParams();

        if (params?.limit) {
            queryParams.append('limit', params.limit.toString());
        }

        if (params?.cursor) {
            queryParams.append('cursor', params.cursor.toString());
        }

        const url = `${paginationType}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
        const response = await apiClient.get(`/posts/${url}`);

        return response.data;
    },
}