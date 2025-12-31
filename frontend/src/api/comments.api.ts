import { REQUEST_CURSOR_LIMIT, REQUEST_CURSOR_LIMIT_REPLIES, REQUEST_OFFSET } from "../lib/constants";
import type { RepliesResponse } from "../types/comments";
import type { ResponseType } from "../types/res";
import apiClient from "./axios.config";

export const commentsApi = {
    // allows user to make the initial comment to a post
    createRootComment: async (post_id: number, content: string): Promise<ResponseType> => {
        const response = await apiClient.post(`/comments/root`, { post_id, content });
        return response.data
    },

    // creates a reply to an existing comment (parent comment)
    createReply: async (parent_comment_id: number, content: string): Promise<ResponseType> => {
        const response = await apiClient.post(`/comments/reply`, { parent_comment_id, content });
        return response.data;
    },

    // get all root comments on a post
    getRootComments: async (
        post_id: number,
        limit: number = REQUEST_CURSOR_LIMIT,
        offset: number = REQUEST_OFFSET
    ): Promise<ResponseType> => {
        const response = await apiClient.get(`/comments/post/${post_id}`, { params: { limit, offset } });
        return response as any as ResponseType;
    },

    // get replies and number of replies to a particular comment
    getReplies: async (
        comment_id: number,
        limit: number = REQUEST_CURSOR_LIMIT_REPLIES,
        offset: number = REQUEST_OFFSET
    ): Promise<ResponseType> => {
        const response = await apiClient.get(`/comments/${comment_id}/replies`, { params: { limit, offset } });
        return response as any as ResponseType;
    },

    // update an existing comment
    updateComment: async (comment_id: number, content: string): Promise<ResponseType> => {
        const response = await apiClient.post(`/comments/${comment_id}`, { content });
        return response.data;
    },

    // delete an existing comment
    deleteComment: async (comment_id: number): Promise<ResponseType> => {
        const response = await apiClient.delete(`/comments/${comment_id}`);
        return response.data;
    },
}