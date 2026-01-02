import React, { useState } from "react";
import { postApi } from "../../api/posts.api";
import PrimaryButton from "../utils/PrimaryButton";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SpinnerSecondary from "../spinner/SpinnerSecondary";
import ModalTitle from "../utils/ModalTitle";

export default function DeletePostForm({
  postID,
  username,
  close,
}: {
  postID: number;
  username: string;
  close: () => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [deleteText, setDeleteText] = useState({
    username: "",
    delete: "",
  });

  const enabled =
    deleteText.username === username && deleteText.delete === "delete";

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await postApi.deletePostByID(postID);
      close();
      navigate(`/${username}`);
      toast.success("Posted deleted successfully");
    } catch (err: any) {
      const { status } = err;
      if (status === 401) {
        navigate("/auth/login", {
          state: { prev_page: location.pathname },
        });
        toast.error("Your session has ended. Please sign in again.");
      } else {
        toast.error(
          "An unexpected error has occurred. Please try again later."
        );
      }
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleDelete}
      className="w-full flex flex-col items-start justify-start gap-3"
    >
      <ModalTitle>Delete Post</ModalTitle>
      <div className="w-full">
        <label
          htmlFor="topics"
          className="ml-[5px] text-xs custom text-gray-dark"
        >
          Enter your username
        </label>
        <input
          type="text"
          placeholder={username}
          value={deleteText.username}
          onChange={(e) =>
            setDeleteText({ ...deleteText, username: e.target.value })
          }
        />
      </div>
      <div className="w-full">
        <label
          htmlFor="topics"
          className="ml-[5px] text-xs custom text-gray-dark"
        >
          Type "delete" to confirm
        </label>
        <input
          type="text"
          placeholder="delete"
          value={deleteText.delete}
          onChange={(e) =>
            setDeleteText({ ...deleteText, delete: e.target.value })
          }
        />
      </div>
      <p className="font-bold custom error">WARNING: This cannot be undone!</p>

      <PrimaryButton
        disabled={!enabled}
        type="submit"
        className="self-end bg-red flex items-center justify-center border-none gap-2 shrink-0"
      >
        {loading ? (
          <SpinnerSecondary />
        ) : (
          <>
            Delete Post
            <img
              alt="Edit"
              src="/icons/icon_trash.svg"
              height={15}
              width={15}
            />
          </>
        )}
      </PrimaryButton>
    </form>
  );
}
