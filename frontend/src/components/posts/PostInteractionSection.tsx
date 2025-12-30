import type { PostType } from "../../types/post";
import LikeButton from "./LikeButton";
import RepostButton from "./RepostButton";
import CommentButton from "./CommentButton";
import type { DefaultCustomProps } from "../../lib/constants";
import { twMerge } from "tailwind-merge";

interface PostInteractionType extends DefaultCustomProps {
  post: PostType;
  url?: string;
}
export default function PostInteractionSection({
  post,
  url,
  className,
}: PostInteractionType) {
  const {
    comment_count,
    user_has_liked,
    id,
    like_count,
    repost_count,
    user_has_reposted,
  } = post;

  return (
    <div
      className={twMerge(
        "flex items-center justify-start gap-4 mt-2",
        className
      )}
    >
      <LikeButton
        initialLiked={user_has_liked}
        targetType="post"
        targetId={id}
        initialCount={like_count}
      />
      <RepostButton
        postID={id}
        initialCount={repost_count}
        initialReposted={user_has_reposted}
      />
      {url && (
        <CommentButton postID={id} initialCount={comment_count} url={url} />
      )}
    </div>
  );
}
