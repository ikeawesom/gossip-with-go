import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NavSection from "../components/nav/NavSection";
import NotFound from "./NotFound";
import SpinnerPrimary from "../components/spinner/SpinnerPrimary";
import { postApi } from "../api/posts.api";
import { formatDate } from "../lib/helpers";
import type { PostType } from "../types/post";
import TopicTag from "../components/topics/TopicTag";
import Card from "../components/utils/Card";
import { useSelector } from "react-redux";
import type { RootState } from "../state/store";
import SecondaryButton from "../components/utils/SecondaryButton";
import PrimaryButton from "../components/utils/PrimaryButton";
import Modal from "../components/utils/Modal";
import CreatePostForm from "../components/posts/CreatePostForm";
import DeletePostForm from "../components/posts/DeletePostForm";
import LongContent from "../components/posts/LongContent";
import PostInteractionSection from "../components/posts/PostInteractionSection";
import CommentSection from "../components/posts/CommentSection";
import ModalTitle from "../components/utils/ModalTitle";

type PostPageParams = {
  user_id: string;
  post_id: string;
};

export default function PostPage() {
  const { user_id, post_id } = useParams<PostPageParams>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [status, setStatus] = useState<"loading" | "invalid" | "success">(
    "loading"
  );
  const [postData, setPostData] = useState<PostType>();
  const [isEditing, setIsEditing] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const isCurrentUser = user?.username === user_id;

  const fetchPost = async (username: string, post_id: string) => {
    try {
      const res = await postApi.getUserPostByID(username, post_id);
      setPostData(res.data.post);
      setStatus("success");
    } catch (err: any) {
      console.log(err);
      setStatus("invalid");
    }
  };

  useEffect(() => {
    if (user_id && post_id) {
      fetchPost(user_id, post_id);
    }
  }, [user_id, post_id]);

  return (
    <NavSection>
      {status === "loading" ? (
        <SpinnerPrimary />
      ) : status === "invalid" ? (
        <NotFound />
      ) : (
        postData &&
        (() => {
          const { created_at, title, username, topic, content, updated_at } =
            postData;
          const isDate = formatDate(new Date(created_at).getTime(), true).date;
          const newDate = formatDate(new Date(created_at).getTime(), true).time;

          const isEdited =
            new Date(updated_at).getTime() > new Date(created_at).getTime();
          const isEdit = formatDate(new Date(updated_at).getTime(), true).date;
          const editDate = formatDate(
            new Date(updated_at).getTime(),
            true
          ).time;
          return (
            <div className="flex w-full items-start justify-start gap-1 flex-col">
              <Card>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col items-start justify-center gap-2 flex-1">
                    <h1 className="text-3xl font-semibold">{title}</h1>
                    <p className="text-gray-dark">
                      <Link
                        className="text-sm text-primary hover:opacity-70 duration-150"
                        to={`/${username}`}
                      >
                        {username}
                      </Link>{" "}
                      •{" Posted "}
                      {isDate ? "on" : ""} {newDate}
                    </p>
                    <Link
                      to={`/topics/${topic}`}
                      className="hover:brightness-125 duration-150"
                    >
                      <TopicTag topic_id={topic} />
                    </Link>
                  </div>
                  {isCurrentUser && (
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="px-2 rounded-md cursor-pointer hover:bg-gray-dark/20 duration-150"
                    >
                      •••
                    </button>
                  )}
                </div>
                <LongContent
                  className="mt-3 border-t border-gray-dark/20 pt-2"
                  content={content}
                >
                  {isEdited && (
                    <p className="fine-print text-xs italic custom mt-3">
                      {" Edited "}
                      {isEdit ? "on" : ""} {editDate}
                    </p>
                  )}
                </LongContent>
              </Card>
              <PostInteractionSection post={postData} className="self-end" />
              <CommentSection postID={postData.id} />
            </div>
          );
        })()
      )}
      {isEditing && (
        <Modal close={() => setIsEditing(false)}>
          <CreatePostForm
            close={() => setIsEditing(false)}
            username={user_id ?? ""}
            reload={() => fetchPost(user_id ?? "", post_id ?? "")}
            curPost={postData}
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

      {showSettings && (
        <Modal
          close={() => setShowSettings(false)}
          className="max-w-[300px] p-4"
        >
          <ModalTitle className="mb-3">Post Settings</ModalTitle>
          <SecondaryButton
            onClick={() => {
              setShowSettings(false);
              setIsEditing(true);
            }}
            className="text-xs flex items-center justify-center gap-2 px-3 w-full mb-3"
          >
            Edit
            <img
              alt="Edit"
              src="/icons/icon_pencil.svg"
              height={15}
              width={15}
            />
          </SecondaryButton>
          <PrimaryButton
            onClick={() => {
              setShowSettings(false);
              setIsDelete(true);
            }}
            className="text-xs flex items-center w-full justify-center gap-2 px-3 from-red/80 border-red/20 hover:from-red/60 to-red"
          >
            Delete
            <img
              alt="Edit"
              src="/icons/icon_trash.svg"
              height={15}
              width={15}
            />
          </PrimaryButton>
        </Modal>
      )}
    </NavSection>
  );
}
