import type { StateTriggerType } from "./res";

export interface Comment {
    id: number;
    post_id: number;
    parent_comment_id?: number;
    user_id: number;
    username?: string;
    pfp?: string;
    content: string;

    like_count: number;
    user_has_liked: boolean;

    created_at: string;
    updated_at: string;

    is_pinned?: boolean;

    reply_count?: number; // for root comments
}

export interface CreateRootCommentRequest {
    post_id: number;
    content: string;
}

export interface CreateReplyRequest {
    parent_comment_id: number;
    content: string;
}

export interface UpdateCommentRequest {
    content: string;
}

export interface RootCommentsResponse {
    comments: Comment[];
    total: number;
    limit: number;
    offset: number;
}

export interface RepliesResponse {
    replies: Comment[];
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
}

export interface CommentTriggers extends StateTriggerType {
    postID?: number;
    commentID?: number;
    isPostOwner?: boolean;
    isPinned?: boolean
}