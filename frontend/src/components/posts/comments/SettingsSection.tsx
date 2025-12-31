import { useState } from "react";
import type { CommentTriggers } from "../../../types/comments";
import DeleteCommentButton from "./DeleteCommentButton";
import Modal from "../../utils/Modal";

export default function SettingsSection({
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
        <Modal close={() => setShowSettings(false)} className="max-w-[300px]">
          <h3 className="text-2xl font-semibold border-b border-gray-dark/20 pb-2 text-center w-full mb-4">
            Comment Settings
          </h3>
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
