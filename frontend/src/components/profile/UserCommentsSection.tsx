import { useEffect, useState } from "react";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { commentsApi } from "../../api/comments.api";
import SpinnerPrimary from "../spinner/SpinnerPrimary";
import LikedCommentCard, { type CommentLikedType } from "./LikedCommentCard";

export default function UserCommentsSection({ id }: { id: number }) {
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<CommentLikedType[]>([]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await commentsApi.getCommentsByUser(id);
      setComments(res.data.comments);
    } catch (err) {
      console.log(err);
      toast.error("An unexpected error has occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <ul
      style={{ scrollbarWidth: "none" }}
      className={twMerge(
        "mt-4 max-h-[50vh] overflow-y-scroll flex w-full flex-col items-start justify-start gap-4",
        comments.length > 0 && "min-h-[100px] pb-4",
        loading &&
          "bg-white shadow-inner border border-gray-dark/20 rounded-md mt-3"
      )}
    >
      {loading ? (
        <li className="h-[100px] grid place-items-center p-2 border-b border-gray-light bg-white w-full">
          <SpinnerPrimary />
        </li>
      ) : comments.length > 0 ? (
        comments.map((comment: CommentLikedType, index: number) => {
          return (
            <li key={index} className="w-full flex flex-col gap-1">
              <LikedCommentCard comment={comment} />
            </li>
          );
        })
      ) : (
        <li className="text-sm md:text-base h-[100px] grid place-items-center rounded-md text-fine-print text-center p-2 border-b border-gray-light w-full bg-white">
          {comments.length > 0
            ? "Hmm, no results were found."
            : "No comments here!"}
        </li>
      )}
    </ul>
  );
}
