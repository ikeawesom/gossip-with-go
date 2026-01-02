import { useSelector } from "react-redux";
import PrimaryButton from "../../utils/PrimaryButton";
import type { RootState } from "../../../state/store";
import { toast } from "sonner";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Modal from "../../utils/Modal";
import type { IndivComment } from "../IndividualComment";
import { formatDate } from "../../../lib/helpers";
import SpinnerSecondary from "../../spinner/SpinnerSecondary";
import type { ApiError } from "../../../types/auth";
import type { AxiosError } from "axios";
import { commentsApi } from "../../../api/comments.api";
import ModalTitle from "../../utils/ModalTitle";

export default function RepyButton({
  comment,
  trigger,
  triggerBool,
}: IndivComment) {
  const { content, created_at, username } = comment;
  const newDate = formatDate(new Date(created_at).getTime(), true).time;

  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const isShowForm = () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to interact with posts!");
      navigate("/auth/login", {
        state: { prev_page: location.pathname },
      });
    } else {
      setShowForm(true);
    }
  };

  const disabled = loading || replyContent === "";

  const handleCreateReply = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await commentsApi.createReply(comment.id, replyContent);
      console.log(res);
      trigger(!triggerBool);
      setReplyContent("");
      setShowForm(false);
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      console.log(axiosError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p
        onClick={isShowForm}
        className="custom text-gray-dark text-sm flex items-center justify-center cursor-pointer hover:opacity-70 duration-150"
      >
        Reply
        <img
          src="/icons/comments/icon_reply.svg"
          className="ml-1"
          alt="Reply"
          width={16}
          height={16}
        />
      </p>
      {showForm && (
        <Modal
          close={() => setShowForm(false)}
          className="w-full flex-col flex items-center justify-center gap-4"
        >
          <ModalTitle>
            <div className="bg-white shadow-xs border border-gray-dark/10 rounded-md p-4 flex flex-col w-full gap-1 items-start justify-start mb-2">
              <div className="flex items-center justify-start gap-1 pb-1">
                <Link
                  className="font-bold text-sm text-primary hover:opacity-70 duration-150"
                  to={`/${username}`}
                >
                  {username}
                </Link>
                <p>•</p>
                <p className="fine-print">{newDate}</p>
              </div>
              <div
                className="overflow-y-scroll w-full"
                style={{ scrollbarWidth: "none" }}
              >
                <p className="whitespace-pre-wrap">{content}</p>
              </div>
            </div>
          </ModalTitle>
          <form
            onSubmit={handleCreateReply}
            className="w-full flex flex-col items-start justify-start gap-4"
          >
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              required
              placeholder="Add comment..."
              className="resize-none h-[100px] text-sm pt-5"
            />
            <PrimaryButton disabled={disabled} className="self-end rounded-md">
              {loading ? <SpinnerSecondary /> : "Post Reply"}
            </PrimaryButton>
          </form>
        </Modal>
      )}
    </>
  );
}
