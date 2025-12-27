import { useState } from "react";
import type { CreatePostRequest } from "../../types/post";
import { DEFAULT_TOPICS } from "../../lib/constants";
import PrimaryButton from "../utils/PrimaryButton";
import { postApi } from "../../api/posts.api";
import { toast } from "sonner";

export default function CreatePostForm({
  username,
  reload,
}: {
  username: string;
  reload: (username: string) => Promise<void>;
}) {
  const [postDetails, setPostDetails] = useState<CreatePostRequest>({
    title: "",
    content: "",
    topic: Object.keys(DEFAULT_TOPICS)[0],
    username,
  });

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postApi.createPost(postDetails);
      await reload(username);
      toast.success("Posted!");
    } catch (err: any) {
      console.error(err);
    }
  };
  return (
    <form
      onSubmit={handleCreatePost}
      className="w-full flex flex-col items-start justify-start gap-3 bg-primary/10 rounded-lg p-5 border border-primary/20"
    >
      <h3 className="text-2xl font-semibold border-b border-gray-dark/20 w-full pb-2">
        Share your thoughts
      </h3>
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
        className="resize-none h-[100px]"
      />
      <div className="w-full">
        <label htmlFor="topics" className="ml-[0.5px]">
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
      <PrimaryButton className="self-end" type="submit">
        Create Post
      </PrimaryButton>
    </form>
  );
}
