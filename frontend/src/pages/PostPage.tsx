import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NavSection from "../components/nav/NavSection";
import NotFound from "./NotFound";
import SpinnerPrimary from "../components/spinner/SpinnerPrimary";
import { postApi } from "../api/posts.api";
import { formatDate } from "../lib/helpers";
import type { PostType } from "../types/post";
import TopicTag from "../components/topics/TopicTag";
import Card from "../components/utils/Card";

type PostPageParams = {
  user_id: string;
  post_id: string;
};

export default function PostPage() {
  const { user_id, post_id } = useParams<PostPageParams>();
  const [status, setStatus] = useState<"loading" | "invalid" | "success">(
    "loading"
  );
  const [postData, setPostData] = useState<PostType>();

  const fetchPost = async (username: string, post_id: string) => {
    try {
      const res = await postApi.getUserPostByID(username, post_id);
      setPostData(res.data.post);
      setStatus("success");
    } catch (err: any) {
      console.log(err);
      setStatus("invalid");
    }
  };

  useEffect(() => {
    if (user_id && post_id) {
      fetchPost(user_id, post_id);
    }
  }, [user_id, post_id]);

  return (
    <NavSection>
      {status === "loading" ? (
        <SpinnerPrimary />
      ) : status === "invalid" ? (
        <NotFound />
      ) : (
        postData && (
          <div className="flex w-full items-center justify-start gap-4">
            <Card className="flex flex-col items-start justify-center gap-2">
              <h1 className="text-3xl font-semibold">{postData.title}</h1>
              <p className="text-gray-dark">
                <Link className="text-primary" to={`/${user_id}`}>
                  {user_id}
                </Link>{" "}
                •<span className="font-medium">{postData.username}</span>{" "}
                {formatDate(new Date(postData.updated_at).getTime(), true).date
                  ? "on"
                  : ""}{" "}
                {formatDate(
                  new Date(postData.updated_at).getTime(),
                  true
                ).time.toLowerCase()}
              </p>
              <Link
                to={`/topics/${postData.topic}`}
                className="hover:brightness-125 duration-150"
              >
                <TopicTag topic_id={postData.topic} />
              </Link>
              <div className="mt-2 w-full border-t border-gray-dark/20 pt-2">
                <p className="smart-wrap">{postData.content}</p>
              </div>
            </Card>
            {/* for comments */}
          </div>
        )
      )}
    </NavSection>
  );
}
