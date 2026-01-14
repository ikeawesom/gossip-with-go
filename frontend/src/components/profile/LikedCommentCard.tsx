import { Link } from "react-router-dom";
import Card from "../utils/Card";
import { formatDate } from "../../lib/helpers";
import ArrowRight from "../utils/ArrowRight";
import PfpImg from "./PfpImg";

export interface CommentLikedType {
  comment_id: number;
  content: string;
  commenter_username: string;
  commenter_pfp: string;
  post_id: number;
  poster_username: string;
  comment_created_at: string;
  liked_at: string;
}

export default function LikedCommentCard({
  comment,
}: {
  comment: CommentLikedType;
}) {
  const url = `/${comment.poster_username}/posts/${comment.post_id}?highlight_comment=${comment.comment_id}`;

  return (
    <Link to={url}>
      <Card className="md:p-3 flex items-center justify-between group hover:opacity-80 duration-150">
        <div>
          <h4 className="text-primary custom text-sm flex items-center justify-start gap-2 mb-2">
            <PfpImg icon pfp={comment.commenter_pfp} />
            {comment.commenter_username}
          </h4>
          <p className="custom text-sm mt-1">{comment.content}</p>
          <p className="fine-print custom text-xs mt-2">
            {formatDate(new Date(comment.comment_created_at).getTime()).time}
          </p>
        </div>
        <ArrowRight
          className="group-hover:translate-x-1 duration-150"
          size={30}
        />
      </Card>
    </Link>
  );
}
