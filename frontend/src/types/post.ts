export interface PostType {
    id: number;
    user: number;
    username: string;
    title: string;
    content: string;
    topic: string;
    created_at: string;
    updated_at: string;
}

export interface CreatePostRequest {
    username: string;
    title: string;
    content: string;
    topic: string;
}