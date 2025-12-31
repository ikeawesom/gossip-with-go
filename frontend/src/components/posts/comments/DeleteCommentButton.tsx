import { useState } from "react";
import PrimaryButton from "../../utils/PrimaryButton";
import type { AxiosError } from "axios";
import type { ApiError } from "../../../types/auth";
import { commentsApi } from "../../../api/comments.api";
import SpinnerSecondary from "../../spinner/SpinnerSecondary";
import { toast } from "sonner";
import type { CommentTriggers } from "../../../types/comments";

export default function DeleteCommentButton({
  commentID,
  trigger,
  triggerBool,
}: CommentTriggers) {
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    if (commentID === undefined) return;

    setLoading(true);
    try {
      await commentsApi.deleteComment(commentID);
      toast.success("Comment has been deleted.");
      trigger(!triggerBool);
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      console.log(axiosError);
    } finally {
      setLoading(false);
    }
  };
  return (
    <PrimaryButton
      disabled={loading}
      onClick={handleDelete}
      className="text-xs bg-red rounded-md flex items-center justify-center gap-2 border-none px-3 w-full"
    >
      {loading ? (
        <SpinnerSecondary size={15} />
      ) : (
        <>
          Delete Comment
          <img alt="Edit" src="/icons/icon_trash.svg" height={15} width={15} />
        </>
      )}
    </PrimaryButton>
  );
}
