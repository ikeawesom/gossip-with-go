import type { NotificationType } from "../../../types/notification";
import Modal from "../../utils/Modal";
import ModalTitle from "../../utils/ModalTitle";
import { twMerge } from "tailwind-merge";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../lib/helpers";
import type { NotificationsRes } from "../../../hooks/useNotifications";

interface NotifModal extends NotificationsRes {
  close: () => void;
  back: () => void;
}
export default function NotificationsModal({
  notifs,
  toggleAllViewed,
  toggleView,
  unread,
  close,
  back,
}: NotifModal) {
  const navigate = useNavigate();

  return (
    <Modal close={close}>
      <ModalTitle back={back}>
        <span className="custom text-gray-dark">Notifications</span>
      </ModalTitle>
      {unread.length > 0 && (
        <p
          onClick={toggleAllViewed}
          className="mt-2 text-primary custom text-sm text-end cursor-pointer hover:opacity-70 duration-150"
        >
          Mark all as read
        </p>
      )}
      <div className="mt-2 w-full h-[500px] overflow-y-scroll rounded-lg shadow-inner bg-white border border-gray-dark/10">
        {notifs.map((item: NotificationType, index: number) => {
          const {
            actor_username,
            entity_type,
            viewed,
            poster_username,
            post_id,
            entity_id,
            created_at,
            comment_content,
            post_title,
            post_content,
          } = item;
          let text: string;
          let url: string;

          if (entity_type === "like_post") {
            text = "liked your post";
            url = `/${poster_username}/posts/${post_id}`;
          } else if (entity_type === "follow") {
            text = "followed you";
            url = `/${actor_username}`;
          } else if (entity_type === "root_comment") {
            text = "commented on your post";
            url = `/${poster_username}/posts/${post_id}?highlight_comment=${entity_id}`;
          } else if (entity_type === "reply_comment") {
            text = "replied to your comment";
            url = `/${poster_username}/posts/${post_id}?highlight_comment=${entity_id}`;
          } else if (entity_type === "like_comment") {
            text = "liked your comment";
            url = `/${poster_username}/posts/${post_id}?highlight_comment=${entity_id}`;
          } else {
            text = "reposted your post";
            url = `/${poster_username}/posts/${post_id}`;
          }

          const dateStr = formatDate(new Date(created_at).getTime(), true).time;

          const handleClick = () => {
            if (!viewed) {
              toggleView(index);
            }
            close();
            navigate(url);
          };
          return (
            <div
              onClick={handleClick}
              key={index}
              className={twMerge(
                "duration-150 py-3 space-y-2 px-4 w-full cursor-pointer border-b border-gray-dark/10",
                !viewed
                  ? "bg-primary/20 hover:bg-dark-primary/30"
                  : "bg-white hover:brightness-95",
              )}
            >
              <div className="flex items-center justify-start gap-2">
                <p className="custom text-sm text-gray-dark">
                  <span className="font-bold text-primary">
                    {actor_username}
                  </span>{" "}
                  {text}
                </p>
                <p>•</p>
                <span className="text-xs custom text-fine-print">
                  {dateStr}
                </span>
              </div>
              {comment_content && (
                <p className="border-l-2 pl-2 border-l-gray-dark/20 line-clamp-2 custom text-sm text-gray-dark">
                  {comment_content}
                </p>
              )}
              {post_title && post_content && (
                <div className="border-l-2 pl-2 border-l-gray-dark/20">
                  <h4 className="custom text-base text-gray-dark font-semibold">
                    {post_title}
                  </h4>
                  <p className="custom text-sm text-gray-dark line-clamp-2">
                    {post_content}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
