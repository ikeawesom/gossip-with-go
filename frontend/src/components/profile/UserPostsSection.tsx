import { useEffect, useState } from "react";
import type { PostType } from "../../types/post";
import SpinnerPrimary from "../spinner/SpinnerPrimary";
import PostCard from "../posts/PostCard";
import { postApi } from "../../api/posts.api";

export default function UserPostsSection({ username }: { username: string }) {
  const [postState, setPostState] = useState<"loading" | "success" | "invalid">(
    "loading"
  );
  const [userPosts, setUserPosts] = useState<PostType[]>([]);

  const getUserPosts = async (username: string) => {
    try {
      const res = await postApi.getPostByUsername(username);
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
    if (username) {
      getUserPosts(username);
    }
  }, [username]);

  return (
    <div className="flex items-center justify-center w-full flex-col gap-4 py-4">
      {postState === "loading" ? (
        <SpinnerPrimary />
      ) : postState === "invalid" ? (
        <p>{username} has no posts yet.</p>
      ) : userPosts.length > 0 ? (
        <div className="w-full flex flex-col gap-4 items-center justify-center">
          {userPosts.map((post: PostType, index: number) => {
            return (
              <PostCard username={username} post={post} key={index} showTopic />
            );
          })}
        </div>
      ) : (
        <p>{username} has no posts yet.</p>
      )}
    </div>
  );
}
