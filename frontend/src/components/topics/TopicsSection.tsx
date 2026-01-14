import { Link } from "react-router-dom";
import Card from "../utils/Card";
import HoriScrollSection from "../utils/HoriScrollSection";
import type { Topic } from "../../types/topics";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import SpinnerPrimary from "../spinner/SpinnerPrimary";
import { topicApi } from "../../api/topics.api";
import { COLORS_ARR } from "../../lib/constants";
import { trimString } from "../../lib/helpers";
import type { AxiosError } from "axios";
import type { ApiError } from "../../types/auth";

export default function TopicsSection() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      // fetch posts
      const res = await topicApi.getTrendingTopics();
      setTopics(res.data.topics);
    } catch (err: any) {
      // get full axios error
      const axiosError = err as AxiosError<ApiError>;
      console.log("[EDIT PROFILE ERROR]:", axiosError.response?.data);

      // toast error or default error
      toast.error(
        axiosError.response?.data?.message ||
          "Could not fetch topics. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTopics();
  }, []);
  return (
    <HoriScrollSection
      title="Popular Topics"
      icon={
        <img
          src="/icons/topics/icon_chat.svg"
          width={23}
          height={23}
          className="ml-3"
        />
      }
    >
      {loading ? (
        <div className="w-full h-[50px] grid place-items-center">
          <SpinnerPrimary />
        </div>
      ) : (
        topics.map((topic: Topic, index: number) => {
          const {
            follower_count,
            post_count,
            id,
            topic_name,
            username,
            topic_class,
          } = topic;
          return (
            <Link
              key={index}
              to={`/topics/${id}`}
              className="min-w-[150px] flex"
            >
              <Card className="hover:brightness-110 flex flex-col justify-between items-start duration-150 ease-in-out md:py-2 md:pb-4 pt-2 pb-3 gap-1">
                <div className="flex items-center justify-start gap-6">
                  <h4 className={COLORS_ARR[topic_class].text}>
                    {trimString(topic_name, 15)}
                  </h4>
                  <div className="flex items-center justify-start gap-2">
                    <span className="flex items-center justify-start gap-1">
                      {follower_count}{" "}
                      <img
                        src="/icons/icon_user.svg"
                        alt="Followers"
                        width={10}
                        height={10}
                      />
                    </span>
                    <span className="flex items-center justify-start gap-1">
                      {post_count}{" "}
                      <img
                        src="/icons/posts/icon_comment.svg"
                        alt="Posts"
                        width={20}
                        height={20}
                      />
                    </span>
                  </div>
                </div>
                <p className="fine-print">
                  {username === "admin"
                    ? "FREE TOPICS"
                    : `Created by ${username}`}
                </p>
              </Card>
            </Link>
          );
        })
      )}
    </HoriScrollSection>
  );
}
