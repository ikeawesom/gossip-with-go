import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavSection from "../components/nav/NavSection";
import NotFound from "./NotFound";
import SpinnerPrimary from "../components/spinner/SpinnerPrimary";
import { postApi } from "../api/posts.api";
import type { PostType } from "../types/post";
import PostInteractionSection from "../components/posts/PostInteractionSection";
import CommentSection from "../components/posts/CommentSection";
import PostPageContent from "../components/posts/PostPageContent";

export type PostPageParams = {
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
      const fetchedPost = res.data.post as PostType;
      setPostData(fetchedPost);
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
        postData &&
        (() => {
          return (
            <div className="flex w-full items-start justify-start gap-1 flex-col">
              <PostPageContent postData={postData} user_id={user_id} />
              <PostInteractionSection post={postData} className="self-end" />
              <CommentSection postID={postData.id} />
            </div>
          );
        })()
      )}
    </NavSection>
  );
}
