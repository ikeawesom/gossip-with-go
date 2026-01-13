import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../state/store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { repostsApi } from "../../api/reposts.api";
import { twMerge } from "tailwind-merge";
import type { AxiosError } from "axios";
import type { ApiError } from "../../types/auth";

interface RepostButtonProps {
  postID: number;
  initialReposted: boolean;
  initialCount: number;
}

export default function RepostButton({
  initialCount,
  initialReposted,
  postID,
}: RepostButtonProps) {
  const [reposted, setReposted] = useState(initialReposted);
  const [repostCount, setRepostCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const handleToggleRepost = async () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to interact with posts!");
      navigate("/auth/login");
      return;
    }

    if (loading) return;

    setLoading(true);

    // optimistic update
    const newRepost = !reposted;
    const newRepostCount = newRepost ? repostCount + 1 : repostCount - 1;

    setReposted(newRepost);
    setRepostCount(newRepostCount);

    try {
      const res = await repostsApi.toggleRepost(postID);

      const serverResposted = res.data.reposted;
      setReposted(serverResposted);
    } catch (err) {
      // get full axios error
      const axiosError = err as AxiosError<ApiError>;
      console.log("[REPOST ERROR]:", axiosError.response?.data);

      // toast error or default error
      toast.error(
        axiosError.response?.data?.message ||
          "Failed to repost. Please try again later."
      );

      setReposted(!newRepost);
      setRepostCount(repostCount);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      disabled={loading}
      onClick={handleToggleRepost}
      className={twMerge(
        "flex items-center justify-center gap-1 cursor-pointer px-2 py-1 rounded-md",
        !loading && "hover:bg-gray-dark/20 duration-150"
      )}
    >
      <p
        className={twMerge(
          "custom text-green tabular-nums min-w-[2ch] text-right",
          reposted ? "text-primary" : "text-gray-dark"
        )}
      >
        {repostCount}
      </p>
      <img
        src={
          reposted
            ? "/icons/posts/icon_reposted.svg"
            : "/icons/posts/icon_unreposted.svg"
        }
        className={twMerge(
          reposted ? "rotate-180 duration-300" : "-rotate-180 duration-300"
        )}
        alt="Reposts"
        width={20}
        height={20}
      />
    </button>
  );
}
