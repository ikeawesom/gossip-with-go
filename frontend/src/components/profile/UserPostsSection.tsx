import { useEffect, useState } from "react";
import type { PostType } from "../../types/post";
import SpinnerPrimary from "../spinner/SpinnerPrimary";
import PostCard from "../posts/PostCard";
import { postApi } from "../../api/posts.api";
import type { ResponseType } from "../../types/res";
import { repostsApi } from "../../api/reposts.api";
import type { ProfileToggleType } from "../../pages/ProfilePage";

export default function UserPostsSection({
  username,
  id,
  view,
}: {
  username: string;
  id?: number;
  view: ProfileToggleType;
}) {
  const [postState, setPostState] = useState<"loading" | "success" | "invalid">(
    "loading"
  );
  const [userPosts, setUserPosts] = useState<PostType[]>([]);

  const getUserPosts = async () => {
    try {
      let res: ResponseType;
      if (id) {
        res = await repostsApi.getUserReposts(id);
      } else {
        res = await postApi.getPostByUsername(username);
      }
      const posts = res.data.posts as PostType[];
      setUserPosts(posts);
      setPostState("success");
      if (res.data.posts) setPostState("success");
    } catch (err: any) {
      console.log(err);
      setPostState("invalid");
    }
  };

  useEffect(() => {
    if (postState === "loading") {
      getUserPosts();
    }
  }, [postState]);

  useEffect(() => {
    setPostState("loading");
  }, [username, id, view]);

  return (
    <div className="flex items-center justify-center w-full flex-col gap-4 py-4">
      {postState === "loading" ? (
        <SpinnerPrimary size={22} />
      ) : postState === "invalid" ? (
        <p>
          {username} has no {id ? "reposts" : "posts"} yet.
        </p>
      ) : userPosts.length > 0 ? (
        <div className="w-full flex flex-col gap-4 items-center justify-center">
          {userPosts.map((post: PostType, index: number) => {
            return (
              <PostCard
                post_id={post.post_id}
                username={username}
                post={post}
                key={index}
                showTopic
              />
            );
          })}
        </div>
      ) : (
        <p>
          {username} has no {id ? "reposts" : "posts"} yet.
        </p>
      )}
    </div>
  );
}
