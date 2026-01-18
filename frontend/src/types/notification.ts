export interface NotificationType {
    id: number;
    entity_type: "like_post" | "like_comment" | "repost" | "root_comment" | "reply_comment" | "follow";
    entity_id: number,

    user_id: number,
    actor_id: number,

    viewed: boolean,
    created_at: string,

    // dynamic
    actor_username: string,
    receiver_username: string,
    comment_content: string,
    post_id: number,
    poster_username: string
    post_title: string;
    post_content: string;
}