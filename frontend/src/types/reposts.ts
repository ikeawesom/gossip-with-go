export type RepostVisibility = "public" | "friends" | "private"


export interface ToggleRepostRequest {
    post_id: number;
    visibility: RepostVisibility
}

export interface ToggleRepostResponse {
    reposted: boolean;
    message: string;
}

export interface RepostStatusResponse {
    reposted: boolean;
}

export interface RepostersResponse {
    reposters: string[];
    total: number;
    limit: number;
    offset: number;
}