import NavSection from "../components/nav/NavSection";
import { Link, useParams } from "react-router-dom";
import { DEFAULT_TOPICS } from "../lib/constants";
import NotFound from "./NotFound";
import { useEffect, useState } from "react";
import type { PostType } from "../types/post";
import { postApi } from "../api/posts.api";
import SpinnerPrimary from "../components/spinner/SpinnerPrimary";
import PostCard from "../components/posts/PostCard";

export default function TopicPage() {
  const { topic_id } = useParams();
  const invalid_topic = !Object.keys(DEFAULT_TOPICS).includes(topic_id ?? "");
  const [posts, setPosts] = useState<PostType[]>([]);
  const [status, setStatus] = useState<"loading" | "invalid" | "success">(
    "loading"
  );

  const fetchPosts = async () => {
    try {
      if (!topic_id) throw new Error("Invalid topic.");

      const res = await postApi.getPostsByTopic(topic_id);
      const data = res.data.posts;

      if (data.length > 0) {
        setPosts(res.data.posts);
        setStatus("success");
      } else {
        throw new Error("no posts");
      }
    } catch (err: any) {
      console.log(err);
      setStatus("invalid");
    }
  };
  useEffect(() => {
    if (!invalid_topic) {
      fetchPosts();
    }
  }, [topic_id]);

  return (
    <NavSection>
      {invalid_topic ? (
        <NotFound />
      ) : (
        <div className="w-full flex flex-col items-start justify-start gap-4">
          <div className="w-full flex flex-col items-start justify-start gap-2 border-b border-gray-dark/20 pb-4">
            <h1 className="custom text-5xl">
              {DEFAULT_TOPICS[topic_id ?? ""].title}
            </h1>
            <div className="flex items-center justify-start gap-2">
              <h4 className="custom text-gray-dark">
                {posts.length}{" "}
                {`post${posts.length === 1 ? "" : "s"} on this topic `}
              </h4>
              <h4 className="custom text-gray-dark">•</h4>
              <h4 className="custom text-gray-dark">
                Browse other topics{" "}
                <Link className="text-primary font-bold" to="/topics">
                  here
                </Link>
                .
              </h4>
            </div>
            {/* Add topic followers */}
          </div>
          {status === "loading" ? (
            <SpinnerPrimary />
          ) : status === "success" ? (
            <>
              {posts.map((post: PostType, index: number) => {
                return <PostCard key={index} post={post} />;
              })}
            </>
          ) : (
            <p className="self-center">Oops, nothing to see here!</p>
          )}
        </div>
      )}
    </NavSection>
  );
}
