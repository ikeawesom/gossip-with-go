import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { commentsApi } from "../../api/comments.api";
import PrimaryButton from "../utils/PrimaryButton";
import SpinnerSecondary from "../spinner/SpinnerSecondary";
import type { AxiosError } from "axios";
import type { ApiError } from "../../types/auth";
import { useLocation, useNavigate } from "react-router-dom";
import type { CommentTriggers } from "../../types/comments";
import { defaultError } from "../../lib/constants";

export default function CreateRootCommentForm({
  postID,
  trigger,
  triggerBool,
}: CommentTriggers) {
  const [content, setContent] = useState<string>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const cachedCommentKey = `comment_${postID}`;

  useEffect(() => {
    const cachedComment = sessionStorage.getItem(cachedCommentKey);
    if (cachedComment) {
      const cachedContent = JSON.parse(cachedComment).content;
      setContent(cachedContent);
    } else {
      setContent("");
    }
  }, []);

  useEffect(() => {
    if (content && content !== "") {
      sessionStorage.setItem(
        cachedCommentKey,
        JSON.stringify({
          post_id: postID,
          content,
        })
      );
    }
    if (content === "") {
      sessionStorage.removeItem(cachedCommentKey);
    }
  }, [content]);

  const handleCreateRootComment = async (e: React.FormEvent) => {
    if (postID === undefined) return;

    e.preventDefault();
    setLoading(true);
    try {
      await commentsApi.createRootComment(postID, content ?? "");
      toast.success("Comment has been posted.");
      setContent("");
      trigger(!triggerBool);
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      if (axiosError.status === 401) {
        toast.info("Please sign in to interact with posts!");
        navigate("/auth/login", {
          state: { prev_page: location.pathname },
        });
      } else {
        // get full axios error
        console.log("[COMMENT ERROR]:", axiosError.response?.data);

        // toast error or default error
        toast.error(axiosError.response?.data?.message || defaultError.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <form
      onSubmit={handleCreateRootComment}
      className="w-full flex flex-col items-start justify-start gap-2"
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        placeholder="What are your thoughts?"
        className="resize-none h-[100px] text-sm pt-5"
      />
      <PrimaryButton
        type="submit"
        className="self-end"
        disabled={loading || content === ""}
      >
        {loading ? <SpinnerSecondary /> : "Post Comment"}
      </PrimaryButton>
    </form>
  );
}
