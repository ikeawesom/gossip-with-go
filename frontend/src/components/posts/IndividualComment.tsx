import { Link } from "react-router-dom";
import type { Comment, CommentTriggers } from "../../types/comments";
import LongContent from "./LongContent";
import { formatDate } from "../../lib/helpers";
import LikeButton from "./LikeButton";
import { useSelector } from "react-redux";
import type { RootState } from "../../state/store";
import ReplyButton from "./comments/ReplyButton";
import useShowReplies from "../../hooks/useShowReplies";
import { twMerge } from "tailwind-merge";
import CommentSettingsSection from "./comments/CommentSettingsSection";
import SpinnerPrimary from "../spinner/SpinnerPrimary";

export interface IndivComment extends CommentTriggers {
  comment: Comment;
}

export default function IndividualComment({
  comment,
  trigger,
  triggerBool,
}: IndivComment) {
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    replies,
    loadMore,
    showReplies,
    allLoaded,
    handleHideAllReplies,
    loading,
  } = useShowReplies(comment.id);

  const {
    content,
    created_at,
    like_count,
    username,
    id,
    user_id,
    user_has_liked,
  } = comment;

  const isValidUser = user?.id === user_id;

  const newDate = formatDate(
    new Date(created_at).getTime(),
    true
  ).time.toLowerCase();

  return (
    <div className="w-full flex flex-col items-end justify-start gap-2">
      <div className="w-full flex flex-col gap-1 items-start justify-start p-2 hover:bg-gray-dark/5 rounded-md duration-150 relative">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center justify-start gap-1">
            <Link
              className="font-bold text-sm text-primary hover:opacity-70 duration-150"
              to={`/${username}`}
            >
              {username}
            </Link>
            <p>•</p>
            <p className="fine-print">{newDate}</p>
          </div>
          {isValidUser && (
            <CommentSettingsSection
              trigger={trigger}
              triggerBool={triggerBool}
              commentID={id}
            />
          )}
        </div>
        <div className="flex w-full items-center justify-between">
          <LongContent largeClamp left content={content} />
          <LikeButton
            fitWidth
            initialCount={like_count}
            initialLiked={user_has_liked}
            targetId={id}
            targetType="comment"
          />
        </div>
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center justify-start gap-2">
            <ReplyButton
              comment={comment}
              trigger={trigger}
              triggerBool={triggerBool}
            />
            {comment.reply_count !== undefined && comment.reply_count > 0 && (
              <>
                <p>•</p>
                <p
                  onClick={loadMore}
                  className={twMerge(
                    "custom text-gray-dark text-sm flex items-center justify-center gap-1 cursor-pointer hover:opacity-70 duration-150"
                  )}
                >
                  View {comment.reply_count} replies
                  <img
                    src="/icons/posts/icon_comment.svg"
                    alt="Comments"
                    width={20}
                    height={20}
                  />
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {showReplies && (
        <div className="min-w-11/12 border-l border-l-gray-dark/20 pl-4 flex flex-col items-start justify-start gap-3">
          {replies.map((reply: Comment, index: number) => {
            const {
              content,
              username,
              created_at,
              id,
              user_has_liked,
              like_count,
              user_id: reply_user_id,
            } = reply;
            const replyDate = formatDate(
              new Date(created_at).getTime(),
              true
            ).time.toLowerCase();

            const isValidUser = user?.id === reply_user_id;

            return (
              <div
                className="hover:bg-gray-dark/5 rounded-md duration-150 w-full p-2 flex items-center justify-between"
                key={index}
              >
                <div
                  key={index}
                  className="w-full flex flex-col items-start justify-start"
                >
                  <div className="w-full flex items-center justify-between gap-2">
                    <div className="flex items-center justify-start gap-1">
                      <Link
                        className="font-bold text-sm text-primary hover:opacity-70 duration-150"
                        to={`/${username}`}
                      >
                        {username}
                      </Link>
                      <p>•</p>
                      <p className="fine-print">{replyDate}</p>
                    </div>
                    {isValidUser && (
                      <CommentSettingsSection
                        trigger={trigger}
                        triggerBool={triggerBool}
                        commentID={id}
                      />
                    )}
                  </div>
                  <div className="w-full flex items-center justify-between gap-2">
                    <LongContent largeClamp left content={content} />
                    <LikeButton
                      fitWidth
                      initialCount={like_count}
                      initialLiked={user_has_liked}
                      targetId={id}
                      targetType="comment"
                    />
                  </div>
                </div>
              </div>
            );
          })}
          {loading && (
            <div className="w-full h-8 grid place-items-center">
              <SpinnerPrimary size={20} />
            </div>
          )}
          {!allLoaded ? (
            <p
              className="custom text-sm cursor-pointer hover:opacity-70 duration-150"
              onClick={loadMore}
            >
              Load more replies
            </p>
          ) : (
            <p
              className="custom text-sm cursor-pointer hover:opacity-70 duration-150"
              onClick={handleHideAllReplies}
            >
              Hide replies
            </p>
          )}
        </div>
      )}
    </div>
  );
}
