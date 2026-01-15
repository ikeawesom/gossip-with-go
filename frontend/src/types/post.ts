export interface PostType {
    id: number;
    post_id?: number; // for reposted backend
    user_id: number;

    topic: number;
    topic_name: string;
    topic_class: string;

    title: string;
    content: string;
    username?: string;
    pfp?: string;

    created_at: string;
    updated_at: string;

    like_count: number;
    comment_count: number;
    repost_count: number;
    view_count: number;
    score: number;

    user_has_liked: boolean;
    user_has_reposted: boolean;
    reposters: string[];

    images: string[]
}

export interface CreatePostRequest {
    username: string;
    title: string;
    content: string;
    topic: number;
    topicName: string
    imagesPreview: string[];
    imagesFiles: File[];
}

export interface TrendingPostsResponse {
    posts: PostType[];
    next_cursor: number | null;
    has_more: boolean;
}

export interface PaginationParams {
    limit?: number;
    cursor?: number;
}