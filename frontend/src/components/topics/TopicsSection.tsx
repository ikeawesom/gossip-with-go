import { Link } from "react-router-dom";
import Card from "../utils/Card";
import HoriScrollSection from "../utils/HoriScrollSection";
import type { Topic } from "../../types/topics";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import SpinnerPrimary from "../spinner/SpinnerPrimary";
import { topicApi } from "../../api/topics.api";
import { COLORS_ARR } from "../../lib/constants";

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
      toast.error("Could not fetch topics");
      console.log(err);
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
              <Card className="hover:brightness-110 flex flex-col justify-between items-start duration-150 ease-in-out py-3 px-4 gap-1">
                <div className="flex items-center justify-start gap-6">
                  <h4 className={COLORS_ARR[topic_class].text}>{topic_name}</h4>
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
                <p className="fine-print">Created by {username}</p>
              </Card>
            </Link>
          );
        })
      )}
    </HoriScrollSection>
  );
}
