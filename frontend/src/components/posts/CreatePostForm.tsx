import { useState } from "react";
import type { CreatePostRequest, PostType } from "../../types/post";
import { DEFAULT_TOPICS } from "../../lib/constants";
import PrimaryButton from "../utils/PrimaryButton";
import { postApi } from "../../api/posts.api";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import ModalTitle from "../utils/ModalTitle";

export default function CreatePostForm({
  username,
  reload,
  curPost,
  close,
}: {
  username: string;
  reload: (username: string) => Promise<void>;
  curPost?: PostType;
  close: () => void;
}) {
  const [postDetails, setPostDetails] = useState<CreatePostRequest>({
    title: curPost?.title ?? "",
    content: curPost?.content ?? "",
    topic: curPost?.topic ?? Object.keys(DEFAULT_TOPICS)[0],
    username,
  });

  const handlePosts = async (e: React.FormEvent) => {
    e.preventDefault();
    if (curPost) {
      await handleSaveChanges(curPost);
    } else {
      await handleCreatePost();
    }
  };
  const handleCreatePost = async () => {
    try {
      await postApi.createPost(postDetails);
      await reload(username);
      toast.success("Posted!");
      close();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSaveChanges = async (curPost: PostType) => {
    try {
      if (!curPost) throw new Error("Invalid post");
      await postApi.editPostByID(postDetails, curPost.id);
      await reload(username);
      toast.success("Changes have been saved");
      close();
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <form
      onSubmit={handlePosts}
      className="w-full flex flex-col items-start justify-start gap-3"
    >
      <ModalTitle>{curPost ? "Edit Post" : "Share your thoughts"}</ModalTitle>
      <input
        value={postDetails.title}
        onChange={(e) =>
          setPostDetails({ ...postDetails, title: e.target.value })
        }
        required
        type="text"
        className="not-rounded"
        placeholder="Enter a title for your post"
      />
      <textarea
        value={postDetails.content}
        onChange={(e) =>
          setPostDetails({ ...postDetails, content: e.target.value })
        }
        required
        placeholder="Share your thoughts here..."
        className="resize-none h-[200px] text-sm"
      />
      <div className="w-full">
        <label
          htmlFor="topics"
          className={twMerge(
            "ml-[0.5px]",
            curPost ? "custom text-gray-dark" : ""
          )}
        >
          What is this for?
        </label>
        <select
          id="topics"
          value={postDetails.topic}
          onChange={(e) =>
            setPostDetails({ ...postDetails, topic: e.target.value })
          }
        >
          {Object.keys(DEFAULT_TOPICS).map((id: string) => (
            <option value={id} key={id}>
              {DEFAULT_TOPICS[id].title}
            </option>
          ))}
        </select>
      </div>
      {curPost ? (
        <PrimaryButton className="self-end" type="submit">
          Save Changes
        </PrimaryButton>
      ) : (
        <PrimaryButton className="self-end" type="submit">
          Create Post
        </PrimaryButton>
      )}
    </form>
  );
}
