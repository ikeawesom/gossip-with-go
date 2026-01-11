import { useState } from "react";
import type { CommentTriggers } from "../../../types/comments";
import DeleteCommentButton from "./DeleteCommentButton";
import Modal from "../../utils/Modal";
import ModalTitle from "../../utils/ModalTitle";
import PinCommentButton from "./PinCommentButton";

export default function CommentSettingsSection({
  trigger,
  triggerBool,
  commentID,
  isPostOwner,
  isPinned,
}: CommentTriggers) {
  const [showSettings, setShowSettings] = useState(false);
  return (
    <>
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="px-2 rounded-md cursor-pointer hover:bg-gray-dark/20 duration-150"
      >
        •••
      </button>
      {showSettings && (
        <Modal
          close={() => setShowSettings(false)}
          className="max-w-[300px] p-4"
        >
          <ModalTitle className="mb-3">Comment Settings</ModalTitle>{" "}
          <div className="w-full flex flex-col items-center justify-center gap-2">
            {isPostOwner && (
              <PinCommentButton
                isPinned={isPinned}
                trigger={trigger}
                triggerBool={triggerBool}
                commentID={commentID}
              />
            )}
            <DeleteCommentButton
              trigger={trigger}
              triggerBool={triggerBool}
              commentID={commentID}
            />
          </div>
        </Modal>
      )}
    </>
  );
}
