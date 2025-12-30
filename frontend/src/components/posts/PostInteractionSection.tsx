import type { PostType } from "../../types/post";
import LikeButton from "./LikeButton";
import RepostButton from "./RepostButton";
import CommentButton from "./CommentButton";

export default function PostInteractionSection({
  post,
  url,
}: {
  post: PostType;
  url: string;
}) {
  const {
    comment_count,
    user_has_liked,
    id,
    like_count,
    repost_count,
    user_has_reposted,
  } = post;
  return (
    <div className="flex items-center justify-start gap-4 mt-2">
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
      <CommentButton postID={id} initialCount={comment_count} url={url} />
    </div>
  );
}
