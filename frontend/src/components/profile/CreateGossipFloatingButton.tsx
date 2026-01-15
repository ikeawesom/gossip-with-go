import { useState } from "react";
import Modal from "../utils/Modal";
import PrimaryButton from "../utils/PrimaryButton";
import SecondaryButton from "../utils/SecondaryButton";
import CreateTopicForm from "../topics/CreateTopicForm";
import { useSelector } from "react-redux";
import type { RootState } from "../../state/store";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ModalTitle from "../utils/ModalTitle";
import CreatePostForm from "../posts/form/CreatePostForm";

export default function CreateGossipFloatingButton() {
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
        <Modal close={handleClose} className="max-w-[300px]">
          <ModalTitle>Start Gossipping</ModalTitle>
          <div className="w-full flex items-center justify-center gap-3 flex-col mt-4">
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
