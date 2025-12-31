export interface Comment {
    id: number;
    post_id: number;
    parent_comment_id?: number;
    user_id: number;
    username?: string;
    content: string;

    like_count: number;
    user_has_liked: boolean;

    created_at: string;
    updated_at: string;


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

export interface CommentTriggers {
    postID?: number;
    commentID?: number;
    trigger: React.Dispatch<React.SetStateAction<boolean>>;
    triggerBool: boolean;
}