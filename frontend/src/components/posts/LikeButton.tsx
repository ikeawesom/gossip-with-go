import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { likesApi } from "../../api/likes.api";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "../../state/store";
import { useNavigate } from "react-router-dom";

interface LikeButtonProps {
  targetId: number;
  targetType: "post" | "comment";
  initialLiked: boolean;
  initialCount: number;
}

export default function LikeButton({
  initialCount,
  initialLiked,
  targetId,
  targetType,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to interact with posts!");
      navigate("/auth/login");
      return;
    }

    if (loading) return;

    setLoading(true);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 150);

    // optimistic update
    const newLiked = !liked;
    const newCount = newLiked ? likeCount + 1 : likeCount - 1;

    setLiked(newLiked);
    setLikeCount(newCount);

    try {
      const res = await likesApi.toggleLike(targetId, targetType);

      const serverLiked = res.data.liked;
      setLiked(serverLiked);
    } catch (error) {
      console.error("failed to toggle like:", error);
      toast.error("Failed to like. Please try again later.");

      setLiked(!newLiked);
      setLikeCount(likeCount);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={twMerge(
        "flex items-center justify-center gap-1 cursor-pointer px-2 py-1 rounded-md",
        !loading && "hover:bg-gray-dark/20 duration-150"
      )}
      onClick={handleToggleLike}
      disabled={loading}
    >
      <p
        className={twMerge(
          "custom text-green tabular-nums min-w-[2ch] text-right",
          liked ? "text-red" : "text-gray-dark"
        )}
      >
        {likeCount}
      </p>
      <img
        src={
          liked
            ? "/icons/posts/icon_liked.svg"
            : "/icons/posts/icon_unliked.svg"
        }
        alt="Liked"
        height={18}
        width={18}
        className={twMerge(
          "transition-transform duration-150 ease-out",
          animate && "scale-125"
        )}
      />
    </button>
  );
}
