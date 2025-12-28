export interface PostType {
    id: number;
    user_id: number;
    topic: string;
    title: string;
    content: string;
    like_count: number;
    comment_count: number;
    view_count: number;
    repost_count: number;
    score: number;
    created_at: string;
    updated_at: string;
    username?: string;
}

export interface CreatePostRequest {
    username: string;
    title: string;
    content: string;
    topic: string;
}

export interface TrendingPostsResponse {
    posts: PostType[];
    next_cursor: number | null;
    has_more: boolean;
}

export interface TrendingPostsParams {
    limit?: number;
    cursor?: number;
}