import { useState } from "react";
import Modal from "../components/utils/Modal";
import CreatePostForm from "../components/posts/CreatePostForm";
import PrimaryButton from "../components/utils/PrimaryButton";
import SecondaryButton from "../components/utils/SecondaryButton";
import CreateTopicForm from "../components/topics/CreateTopicForm";
import { useSelector } from "react-redux";
import type { RootState } from "../state/store";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function CreatePostTopicSection() {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const [show, setShow] = useState<"none" | "list" | "post" | "topic">("none");

  const toggleTopic = () => {
    setShow("topic");
  };

  const handleClose = () => {
    setShow("none");
  };

  const handleCreate = (s: "none" | "list" | "post" | "topic") => {
    if (!user) {
      toast.info("Sign in to start a gossip!");
      navigate("/auth/login");
    } else {
      setShow(s);
    }
  };

  return (
    <>
      <div
        onClick={() => setShow("list")}
        className="cursor-pointer hover:brightness-95 duration-150 shadow-lg rounded-full h-20 w-20 grid place-items-center bg-white/60 backdrop-blur-md border border-white/20"
      >
        <img
          src="/icons/create.svg"
          alt="Start Gossip"
          width={65}
          height={65}
        />
      </div>
      {show === "list" && (
        <Modal close={handleClose} className="max-w-[250px]">
          <div className="w-full flex items-center justify-center gap-4 flex-col">
            <PrimaryButton
              onClick={() => handleCreate("post")}
              className="w-full"
            >
              Make a Post
            </PrimaryButton>
            <SecondaryButton
              onClick={() => handleCreate("topic")}
              className="w-full"
            >
              Start a New Topic
            </SecondaryButton>
          </div>
        </Modal>
      )}
      {user && show === "post" && (
        <Modal close={handleClose}>
          <CreatePostForm
            toggleTopic={toggleTopic}
            close={handleClose}
            username={user.username}
          />
        </Modal>
      )}
      {user && show === "topic" && (
        <Modal close={handleClose}>
          <CreateTopicForm />
        </Modal>
      )}
    </>
  );
}
