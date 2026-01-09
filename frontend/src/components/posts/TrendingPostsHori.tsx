import HoriScrollSection from "../utils/HoriScrollSection";
import { usePagination } from "../../hooks/usePagination";
import SpinnerPrimary from "../spinner/SpinnerPrimary";
import type { PostType } from "../../types/post";
import Card from "../utils/Card";
import { Link } from "react-router-dom";
import { formatDate } from "../../lib/helpers";
import TopicTag from "../topics/TopicTag";

export default function TrendingPostsHori() {
  const { posts, loading } = usePagination(6, "trending");
  return (
    <>
      <HoriScrollSection
        icon={
          <img
            src="/icons/posts/icon_hot.svg"
            width={25}
            height={25}
            className="ml-1"
          />
        }
        scrollAmount={600}
        title="Trending Posts"
      >
        {loading ? (
          <SpinnerPrimary />
        ) : (
          posts.map((post: PostType, index: number) => {
            const {
              title,
              content,
              created_at,
              username,
              topic_class,
              topic_name,
              id,
            } = post;

            const newDateStr = formatDate(new Date(created_at).getTime(), true);
            return (
              <Link
                className="w-[300px] flex"
                to={`/${username}/posts/${id}`}
                key={index}
              >
                <Card className="hover:brightness-110 flex flex-col justify-between items-start duration-150 ease-in-out p-4 gap-2">
                  <div className="flex flex-col items-start justify-start gap-2">
                    <TopicTag
                      topic_class={topic_class}
                      topic_name={topic_name}
                    />
                    <h3 className="smart-wrap line-clamp-1">{title}</h3>
                    <p className="line-clamp-2">{content}</p>
                  </div>
                  <span className="flex items-center justify-start gap-1">
                    <p className="text-primary custom text-sm">{username}</p>•
                    <p className="fine-print">
                      Posted {newDateStr.date ? "on" : ""} {newDateStr.time}
                    </p>
                  </span>
                </Card>
              </Link>
            );
          })
        )}
      </HoriScrollSection>
      <Link
        to="/trending"
        className="self-end mb-4 text-primary text-sm cursor-pointer hover:opacity-70 duration-150"
      >
        View All
      </Link>
    </>
  );
}
