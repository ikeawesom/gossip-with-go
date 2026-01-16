import { formatDate } from "../../lib/helpers";
import ArrowRight from "../utils/ArrowRight";
import Card from "../utils/Card";
import type { PostType } from "../../types/post";
import { Link } from "react-router-dom";
import TopicTag from "../topics/TopicTag";
import PostInteractionSection from "./PostInteractionSection";
import { twMerge } from "tailwind-merge";
import FollowingRepostsSection from "./FollowingRepostsSection";
import PfpImg from "../profile/PfpImg";
import HoriScrollSection from "../utils/HoriScrollSection";

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
    reposters,
    pfp,
    media_urls,
    repost_created_at,
  } = post;

  const newDateStr = formatDate(new Date(created_at).getTime(), true);

  const repostedDate = formatDate(
    new Date(repost_created_at ?? "").getTime(),
    true
  );

  const user = fetched_username ?? username;

  const url = `/${user}/posts/${post_id ?? id}`;

  return (
    <div className="w-full">
      {repost_created_at ? (
        <>
          <div className="mb-2 flex items-center gap-1 text-xs text-gray-600">
            <img
              src="/icons/posts/icon_reposted.svg"
              alt="Repost"
              width={16}
              height={16}
              className="opacity-70"
            />
            Reposted {repostedDate.date ? "on" : ""} {repostedDate.time}
          </div>
        </>
      ) : (
        <>
          {reposters && reposters.length > 0 && (
            <FollowingRepostsSection reposters={reposters} />
          )}
        </>
      )}

      <Card
        className={twMerge(
          "w-full flex flex-col items-start justify-start hover:brightness-105 duration-150 smart-wrap p-0 md:p-0",
          className
        )}
      >
        <div className="flex items-center justify-start gap-2 border-b border-gray-dark/20 w-full p-3">
          <PfpImg icon pfp={pfp} />
          <Link
            to={`/${user}`}
            className="custom text-primary text-sm cursor-pointer hover:opacity-70 duration-150"
          >
            {user}
          </Link>{" "}
        </div>

        {media_urls && (
          <HoriScrollSection gap="gap-0" floatingArrows>
            {media_urls.map((url, index) => (
              <div
                key={index}
                className="relative aspect-square w-lvw max-w-152 overflow-hidden"
              >
                <img
                  src={url}
                  alt={`image_${index + 1}`}
                  className=" w-full h-full object-cover"
                />
              </div>
            ))}
          </HoriScrollSection>
        )}

        <Link to={url} className="w-full">
          <div className="w-full flex items-center justify-between gap-4 p-3 group">
            <div className="w-full flex flex-col items-start justify-start gap-2">
              {showTopic && (
                <TopicTag
                  trim
                  topic_class={topic_class}
                  topic_name={topic_name}
                />
              )}
              <h4 className="custom font-bold line-clamp-2 text-black">
                {title}
              </h4>
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
            )}{" "}
          </div>
        </Link>
      </Card>
      {!hideInteractions && <PostInteractionSection post={post} url={url} />}
    </div>
  );
}
