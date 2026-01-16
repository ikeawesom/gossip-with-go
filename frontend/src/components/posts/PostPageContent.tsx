import type { PostType } from "../../types/post";
import { formatDate } from "../../lib/helpers";
import Card from "../utils/Card";
import { Link } from "react-router-dom";
import PfpImg from "../profile/PfpImg";
import TopicTag from "../topics/TopicTag";
import LongContent from "./LongContent";
import HoriScrollSection from "../utils/HoriScrollSection";
import Modal from "../utils/Modal";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../state/store";
import PostSettingsModal from "./PostSettingsModal";

export default function PostPageContent({
  postData,
  user_id,
}: {
  postData: PostType;
  user_id: string | undefined;
}) {
  const { user } = useSelector((state: RootState) => state.auth);
  const isCurrentUser = user?.username === user_id;
  const [show, setShow] = useState<"none" | "media" | "settings">("none");

  const {
    created_at,
    title,
    username,
    topic,
    topic_name,
    topic_class,
    content,
    updated_at,
    pfp,
    media_urls,
  } = postData;
  const isDate = formatDate(new Date(created_at).getTime(), true).date;
  const newDate = formatDate(new Date(created_at).getTime(), true).time;

  const isEdited =
    new Date(updated_at).getTime() > new Date(created_at).getTime();
  const isEdit = formatDate(new Date(updated_at).getTime(), true).date;
  const editDate = formatDate(new Date(updated_at).getTime(), true).time;
  return (
    <>
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col items-start justify-center gap-2 flex-1">
            <h1 className="text-3xl font-semibold">{title}</h1>
            <div className="flex items-center justify-start gap-1 mb-1">
              <p className="text-gray-dark">
                <Link
                  className="text-sm text-primary hover:opacity-70 duration-150 flex items-center justify-start gap-1"
                  to={`/${username}`}
                >
                  <PfpImg icon pfp={pfp} />
                  {username}
                </Link>
              </p>
              <p>•</p>
              <p>
                {"Posted "}
                {isDate ? "on" : ""} {newDate}
              </p>
            </div>
            <Link
              to={`/topics/${topic}`}
              className="hover:brightness-125 duration-150"
            >
              <TopicTag topic_class={topic_class} topic_name={topic_name} />
            </Link>
          </div>
          {isCurrentUser && (
            <button
              onClick={() => setShow("settings")}
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
          {media_urls && (
            <div
              onClick={() => setShow("media")}
              className="w-full mt-6 rounded-xl overflow-hidden border border-gray-dark/20 shadow-sm group"
            >
              <div className="relative aspect-square w-full overflow-hidden">
                <img
                  src={media_urls[0]}
                  alt={`image_${1}`}
                  className=" w-full h-full object-cover"
                />
                <button
                  type="button"
                  className="absolute cursor-pointer inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                >
                  <span className="text-white text-xs">View Media</span>
                </button>
              </div>
            </div>
          )}
          {isEdited && (
            <p className="fine-print text-xs italic custom mt-3">
              {" Edited "}
              {isEdit ? "on" : ""} {editDate}
            </p>
          )}
        </LongContent>
      </Card>
      {show === "media" && (
        <Modal className="max-w-104" close={() => setShow("none")}>
          <HoriScrollSection isModal gap="gap-0" floatingArrows>
            {postData?.media_urls.map((url: string, index: number) => (
              <div
                key={index}
                className="relative aspect-square w-full max-w-96 overflow-hidden"
              >
                <img
                  src={url}
                  alt={`image_${index + 1}`}
                  className=" w-full h-full object-cover"
                />
              </div>
            ))}
          </HoriScrollSection>
        </Modal>
      )}
      {show === "settings" && (
        <PostSettingsModal close={() => setShow("none")} postData={postData} />
      )}
    </>
  );
}
