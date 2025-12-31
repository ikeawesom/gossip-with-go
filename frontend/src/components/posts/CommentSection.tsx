import { useEffect, useState } from "react";
import CreateRootCommentForm from "./CreateRootCommentForm";
import type { Comment } from "../../types/comments";
import SpinnerPrimary from "../spinner/SpinnerPrimary";
import type { ApiError } from "../../types/auth";
import type { AxiosError } from "axios";
import { commentsApi } from "../../api/comments.api";
import IndividualComment from "./IndividualComment";

export default function CommentSection({ postID }: { postID: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updateComment, setUpdateComment] = useState(false);

  const fetchRootComments = async () => {
    try {
      const res = await commentsApi.getRootComments(postID);
      setComments(res.data.comments);
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      console.error(axiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchRootComments();
  }, [postID, updateComment]);

  return (
    <div className="flex flex-col w-full items-center justify-center mt-2 border-t border-gray-dark/20 pt-4">
      <CreateRootCommentForm
        triggerBool={updateComment}
        trigger={setUpdateComment}
        postID={postID}
      />

      <div className="flex items-center justify-center w-full flex-col mt-4 gap-4">
        {loading ? (
          <SpinnerPrimary size={30} />
        ) : (
          comments.map((item: Comment, index: number) => (
            <IndividualComment
              trigger={setUpdateComment}
              triggerBool={updateComment}
              comment={item}
              key={index}
            />
          ))
        )}
      </div>
    </div>
  );
}
