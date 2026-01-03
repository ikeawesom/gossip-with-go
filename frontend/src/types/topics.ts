export interface Topic {
    id: number;
    topic_name: string;
    description?: string;
    topic_class: string;

    // user details
    createdBy: number;
    username?: string;

    user_has_followed: boolean;

    post_count: number;
    follower_count: number;
    followers: string[];

    createdAt: Date;
    updatedAt: Date;
}