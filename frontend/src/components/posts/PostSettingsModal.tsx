import { useState } from "react";
import Modal from "../utils/Modal";
import ModalTitle from "../utils/ModalTitle";
import PrimaryButton from "../utils/PrimaryButton";
import SecondaryButton from "../utils/SecondaryButton";
import CreatePostForm from "./form/CreatePostForm";
import DeletePostForm from "./DeletePostForm";
import { useParams } from "react-router-dom";
import type { PostPageParams } from "../../pages/PostPage";
import type { PostType } from "../../types/post";

export default function PostSettingsModal({
  close,
  postData,
}: {
  close: () => void;
  postData?: PostType;
}) {
  const { user_id } = useParams<PostPageParams>();
  const [isEditing, setIsEditing] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  return (
    <>
      <Modal close={close} className="max-w-[300px] p-4">
        <ModalTitle>Post Settings</ModalTitle>
        <SecondaryButton
          onClick={() => {
            setIsEditing(true);
          }}
          className="text-xs flex items-center justify-center gap-2 px-3 w-full mb-2 mt-3"
        >
          Edit
          <img alt="Edit" src="/icons/icon_pencil.svg" height={15} width={15} />
        </SecondaryButton>
        <PrimaryButton
          onClick={() => {
            setIsDelete(true);
          }}
          className="text-xs flex items-center w-full justify-center gap-2 px-3 from-red/80 border-red/20 hover:from-red/60 to-red"
        >
          Delete
          <img alt="Edit" src="/icons/icon_trash.svg" height={15} width={15} />
        </PrimaryButton>
      </Modal>
      {isEditing && (
        <Modal close={() => setIsEditing(false)}>
          <CreatePostForm
            close={() => setIsEditing(false)}
            username={user_id ?? ""}
            curPost={postData}
            topic={postData ? postData.topic : -1}
          />
        </Modal>
      )}
      {isDelete && (
        <Modal close={() => setIsDelete(false)}>
          <DeletePostForm
            close={() => setIsDelete(false)}
            postID={postData?.id ?? 0}
            username={user_id ?? ""}
          />
        </Modal>
      )}
    </>
  );
}
