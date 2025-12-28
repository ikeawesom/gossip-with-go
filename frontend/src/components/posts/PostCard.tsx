import { formatDate } from "../../lib/helpers";
import ArrowRight from "../utils/ArrowRight";
import Card from "../utils/Card";
import type { PostType } from "../../types/post";
import { Link } from "react-router-dom";
import TopicTag from "../topics/TopicTag";

export default function PostCard({
  post,
  hideArrow,
  showTopic,
  username,
}: {
  post: PostType;
  hideArrow?: boolean;
  showTopic?: boolean;
  username?: string;
}) {
  const {
    content,
    created_at,
    title,
    username: fetched_username,
    id,
    topic,
  } = post;

  const newDateStr = formatDate(new Date(created_at).getTime(), true);

  const user = fetched_username ?? username;

  return (
    <Link to={`/${user}/posts/${id}`} className="w-full">
      <Card className="flex items-center justify-between gap-6 group hover:brightness-110 duration-150 smart-wrap">
        <div className="w-full flex flex-col items-start justify-start gap-3">
          <div className="flex items-center justify-start gap-2">
            {showTopic && <TopicTag topic_id={topic} />}
            <h4 className="custom font-bold">{title}</h4> • <p>{user}</p>
          </div>
          <p className="whitespace-pre-wrap line-clamp-3">{content}</p>
          <p className="fine-print">
            Posted {newDateStr.date ? "on" : ""} {newDateStr.time.toLowerCase()}
          </p>
        </div>
        {!hideArrow && (
          <ArrowRight
            className="group-hover:translate-x-1 duration-150"
            size={30}
          />
        )}
      </Card>
    </Link>
  );
}
