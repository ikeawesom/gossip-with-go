import type { CreatePostRequest, TrendingPostsParams } from "../types/post";
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
    createPost: async (postData: CreatePostRequest): Promise<ResponseType> => {
        const response = await apiClient.post(`/posts/create`, {
            username: postData.username,
            title: postData.title,
            content: postData.content,
            topic: Number(postData.topic),
        });
        return response.data;
    },

    // get post by username and postID
    getUserPostByID: async (username: string, postID: string): Promise<ResponseType> => {
        const response = await apiClient.get(`/posts/users/${username}/${postID}`);
        return response.data;
    },

    // edit post by postID
    editPostByID: async (postData: CreatePostRequest, postID: number): Promise<ResponseType> => {
        const response = await apiClient.post(`/posts/edit/${postID}`, postData);
        console.log("API RESPONSE:", response.data)
        return response.data
    },

    // delete post by postID
    deletePostByID: async (postID: number): Promise<ResponseType> => {
        const response = await apiClient.post(`/posts/delete/${postID}`);
        console.log("API RESPONSE:", response.data)
        return response.data
    },

    getTrendingPosts: async (params?: TrendingPostsParams): Promise<ResponseType> => {
        const queryParams = new URLSearchParams();

        if (params?.limit) {
            queryParams.append('limit', params.limit.toString());
        }

        if (params?.cursor) {
            queryParams.append('cursor', params.cursor.toString());
        }

        const url = `trending${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
        const response = await apiClient.get(`/posts/${url}`);

        return response.data;
    },


}