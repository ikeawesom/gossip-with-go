import { useEffect, useState } from "react";
import type { PostType } from "../../types/post";
import { twMerge } from "tailwind-merge";
import SpinnerPrimary from "../spinner/SpinnerPrimary";
import { useNavigate } from "react-router-dom";
import { likesApi } from "../../api/likes.api";
import PostCard from "../posts/PostCard";
import type { CommentLikedType } from "./LikedCommentCard";
import LikedCommentCard from "./LikedCommentCard";

type LikeType = "posts" | "comments";
type LikeTypeLabels = {
  id: LikeType;
  label: string;
};

const likeTypes = [
  { id: "posts", label: "Posts" },
  { id: "comments", label: "Comments" },
] as LikeTypeLabels[];

export default function UserLikes({ id }: { id: number }) {
  const [likeType, setLikeType] = useState<LikeType>("posts");
  const [likes, setLikes] = useState<PostType[] | CommentLikedType[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchLikes = async () => {
    setLoading(true);
    try {
      const res = await likesApi.getLikesByType(id, likeType);
      setLikes(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, [likeType]);

  return (
    <div className="mt-4 w-full">
      <div className="w-full flex justify-start items-center gap-4 mb-2">
        {likeTypes.map((item: LikeTypeLabels, index: number) => {
          return (
            <h4
              onClick={() => setLikeType(item.id)}
              className={twMerge(
                "cursor-pointer hover:opacity-70 duration-150",
                likeType === item.id
                  ? "text-primary"
                  : "text-primary/80 font-normal"
              )}
              key={index}
            >
              {item.label}
            </h4>
          );
        })}
      </div>
      <ul
        style={{ scrollbarWidth: "none" }}
        className={twMerge(
          "max-h-[50vh] overflow-y-scroll flex w-full flex-col items-start justify-start gap-4 pb-4",
          likes.length > 0 && "min-h-[100px]",
          loading &&
            "bg-white shadow-inner border border-gray-dark/20 rounded-md mt-3"
        )}
      >
        {loading ? (
          <li className="h-[100px] grid place-items-center p-2 border-b border-gray-light bg-white w-full">
            <SpinnerPrimary />
          </li>
        ) : likes.length > 0 ? (
          likes.map((item: PostType | CommentLikedType, index: number) => {
            if (likeType === "posts") {
              const post = item as PostType;
              const url = `/${post.username}/posts/${post.id}`;
              return (
                <li
                  onClick={() => navigate(url)}
                  key={index}
                  className="w-full"
                >
                  <PostCard
                    className="hover:opacity-80 duration-150 md:p-4"
                    hideInteractions
                    post={post}
                  />
                </li>
              );
            } else {
              const comment = item as CommentLikedType;
              return (
                <li key={index} className="w-full flex flex-col gap-1">
                  <LikedCommentCard comment={comment} />
                </li>
              );
            }
          })
        ) : (
          <li className="text-sm md:text-base h-[100px] grid place-items-center text-fine-print text-center p-2 border-b border-gray-light">
            {likes.length > 0
              ? "Hmm, no results were found. Try another keyword."
              : "No likes here!"}
          </li>
        )}
      </ul>
    </div>
  );
}
