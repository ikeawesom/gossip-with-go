import { useState } from "react";
import type { CreatePostRequest, PostType } from "../../types/post";
import PrimaryButton from "../utils/PrimaryButton";
import { postApi } from "../../api/posts.api";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import ModalTitle from "../utils/ModalTitle";
import useQuery, { type QueryResult } from "../../hooks/useQuery";
import SpinnerPrimary from "../spinner/SpinnerPrimary";
import type { Topic } from "../../types/topics";
import SpinnerSecondary from "../spinner/SpinnerSecondary";
import { useNavigate } from "react-router-dom";

export interface CreatePostFormType {
  toggleTopic?: () => void;
  username: string;
  curPost?: PostType;
  close: () => void;
  topic?: number;
  topicName?: string;
}
export default function CreatePostForm({
  username,
  curPost,
  close,
  toggleTopic,
  topicName,
  topic,
}: CreatePostFormType) {
  const [postDetails, setPostDetails] = useState<CreatePostRequest>({
    title: curPost?.title ?? "",
    content: curPost?.content ?? "",
    topic: topic ? topic : -1,
    topicName: topicName ? topicName : "",
    username,
  });

  const [postLoad, setPostLoad] = useState(false);

  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const { loading, results } = useQuery(query, "topics");

  const navigate = useNavigate();

  const disabled =
    postDetails.title === "" ||
    postDetails.content === "" ||
    postDetails.topic === -1;

  const handlePosts = async (e: React.FormEvent) => {
    e.preventDefault();
    if (curPost) {
      await handleSaveChanges(curPost);
    } else {
      await handleCreatePost();
    }
  };
  const handleCreatePost = async () => {
    setPostLoad(true);
    try {
      const res = await postApi.createPost(postDetails);
      toast.success("Posted!");
      close();
      navigate(`/${username}/posts/${res.data.data}`);
    } catch (err: any) {
      console.error(err);
    } finally {
      setPostLoad(false);
    }
  };

  const handleSaveChanges = async (curPost: PostType) => {
    setPostLoad(true);
    try {
      if (!curPost) throw new Error("Invalid post");
      await postApi.editPostByID(postDetails, curPost.id);
      toast.success("Changes have been saved.");
      window.location.reload();
      close();
    } catch (err: any) {
      console.log(err);
    } finally {
      setPostLoad(false);
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
      {(!topic || toggleTopic) && (
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
          <div className="flex items-center justify-between gap-3">
            <input
              onClick={() => setShowResults(true)}
              placeholder="Enter a topic"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <h4 className="custom">Or</h4>
            <PrimaryButton onClick={toggleTopic}>Start a Topic</PrimaryButton>
          </div>
          {postDetails.topicName !== "" && (
            <p className="mt-2 custom text-sm text-gray-dark">
              Selected Topic:{" "}
              <span className="text-primary font-bold">
                {postDetails.topicName}
              </span>
            </p>
          )}
          {showResults && (
            <ul
              className="overflow-y-scroll bg-white rounded-lg mt-3 h-[100px] shadow-sm"
              style={{ scrollbarWidth: "none" }}
            >
              {loading ? (
                <li className="h-[100px] grid place-items-center p-2">
                  <SpinnerPrimary />
                </li>
              ) : results.length > 0 ? (
                results.map((item: QueryResult, index: number) => {
                  const topic = item as Topic;
                  return (
                    <li
                      onClick={() => {
                        setPostDetails({
                          ...postDetails,
                          topic: topic.id,
                          topicName: topic.topic_name,
                        });
                        setShowResults(false);
                        setQuery(topic.topic_name);
                      }}
                      key={index}
                      className="text-sm p-2 border-b border-gray-light hover:bg-fine-print/25 cursor-pointer text-gray-dark"
                    >
                      {topic.topic_name}
                      <p className="fine-print custom text-xs">
                        {topic.username === "admin"
                          ? "FREE TOPICS"
                          : `Created by ${topic.username}`}
                      </p>
                    </li>
                  );
                })
              ) : (
                <li className="text-sm text-fine-print text-center h-[100px] grid place-items-center">
                  {query.length > 0
                    ? "Hmm, no results were found. Try another keyword."
                    : "Search for a topic."}
                </li>
              )}
            </ul>
          )}
        </div>
      )}
      {curPost ? (
        <PrimaryButton disabled={disabled} className="self-end" type="submit">
          {postLoad ? <SpinnerSecondary /> : "Save Changes"}
        </PrimaryButton>
      ) : (
        <PrimaryButton disabled={disabled} className="self-end" type="submit">
          {postLoad ? <SpinnerSecondary /> : "Create Post"}
        </PrimaryButton>
      )}
    </form>
  );
}
