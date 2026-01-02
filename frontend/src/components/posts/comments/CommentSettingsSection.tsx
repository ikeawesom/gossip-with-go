import { useState } from "react";
import type { CommentTriggers } from "../../../types/comments";
import DeleteCommentButton from "./DeleteCommentButton";
import Modal from "../../utils/Modal";
import ModalTitle from "../../utils/ModalTitle";

export default function CommentSettingsSection({
  trigger,
  triggerBool,
  commentID,
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
          <ModalTitle className="mb-3">Comment Settings</ModalTitle>
          <DeleteCommentButton
            trigger={trigger}
            triggerBool={triggerBool}
            commentID={commentID}
          />
        </Modal>
      )}
    </>
  );
}
