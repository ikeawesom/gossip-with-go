export interface ToggleLikeRequest {
    type: "post" | "comment"
}

export interface ToggleLikeResponse {
    liked: boolean;
    message: string;
}

export interface LikeStatusResponse {
    liked: boolean;
}

export interface LikersResponse {
    likers: string[];
    total: number;
    limit: number;
    offset: number;
}