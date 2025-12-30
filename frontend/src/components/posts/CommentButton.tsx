import { useNavigate } from "react-router-dom";

export default function CommentButton({
  url,
  initialCount,
  postID,
}: {
  url: string;
  postID: number;
  initialCount: number;
}) {
  const navigate = useNavigate();
  return (
    <button
      className="flex items-center justify-center gap-1 cursor-pointer px-2 py-1 rounded-md hover:bg-gray-dark/20 duration-150"
      onClick={() => navigate(url)}
    >
      <p className="custom text-gray-dark">{initialCount ?? 0}</p>
      <img
        src="icons/posts/icon_comment.svg"
        alt="Comments"
        width={20}
        height={20}
      />
    </button>
  );
}
