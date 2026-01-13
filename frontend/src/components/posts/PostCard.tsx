import { formatDate } from "../../lib/helpers";
import ArrowRight from "../utils/ArrowRight";
import Card from "../utils/Card";
import type { PostType } from "../../types/post";
import { Link } from "react-router-dom";
import TopicTag from "../topics/TopicTag";
import PostInteractionSection from "./PostInteractionSection";
import { twMerge } from "tailwind-merge";

export default function PostCard({
  post,
  hideArrow,
  showTopic,
  username,
  hideInteractions,
  className,
  post_id,
}: {
  post: PostType;
  hideArrow?: boolean;
  showTopic?: boolean;
  username?: string;
  hideInteractions?: boolean;
  className?: string;
  post_id?: number;
}) {
  const {
    content,
    created_at,
    title,
    username: fetched_username,
    id,
    topic_name,
    topic_class,
  } = post;

  const newDateStr = formatDate(new Date(created_at).getTime(), true);

  const user = fetched_username ?? username;

  const url = `/${user}/posts/${post_id ?? id}`;

  return (
    <div className="w-full">
      <Link to={url} className="w-full">
        <Card
          className={twMerge(
            "flex items-center justify-between gap-6 group hover:brightness-110 duration-150 smart-wrap",
            className
          )}
        >
          <div className="w-full flex flex-col items-start justify-start gap-2">
            <div className="flex items-center justify-start gap-2">
              {showTopic && (
                <TopicTag
                  trim
                  topic_class={topic_class}
                  topic_name={topic_name}
                />
              )}
              <p className="custom text-primary text-sm">{user}</p>{" "}
            </div>
            <h4 className="custom font-bold line-clamp-2">{title}</h4>
            <p className="whitespace-pre-wrap line-clamp-3">{content}</p>
            <p className="fine-print">
              Posted {newDateStr.date ? "on" : ""} {newDateStr.time}
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
      {!hideInteractions && <PostInteractionSection post={post} url={url} />}
    </div>
  );
}
