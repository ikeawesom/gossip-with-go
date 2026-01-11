import { useState } from "react";
import type { AxiosError } from "axios";
import type { ApiError } from "../../../types/auth";
import { commentsApi } from "../../../api/comments.api";
import type { CommentTriggers } from "../../../types/comments";
import SecondaryButton from "../../utils/SecondaryButton";
import SpinnerPrimary from "../../spinner/SpinnerPrimary";

export default function PinCommentButton({
  commentID,
  trigger,
  triggerBool,
  isPinned,
}: CommentTriggers) {
  const [loading, setLoading] = useState(false);

  const handlePin = async () => {
    if (commentID === undefined) return;

    setLoading(true);
    try {
      await commentsApi.togglePinComment(commentID);
      trigger(!triggerBool);
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      console.log(axiosError);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SecondaryButton
      disabled={loading}
      onClick={handlePin}
      className="text-xs rounded-md flex items-center justify-center gap-2 border-none px-3 w-full"
    >
      {loading ? (
        <SpinnerPrimary size={15} />
      ) : (
        <>
          {isPinned ? "Unpin Comment" : "Pin Comment"}
          <img
            alt="Edit"
            src="/icons/comments/icon_pin.svg"
            height={15}
            width={15}
          />
        </>
      )}
    </SecondaryButton>
  );
}
