import NavSection from "../components/nav/NavSection";
import { Link, useParams } from "react-router-dom";
import NotFound from "./NotFound";
import { useEffect, useState } from "react";
import type { PostType } from "../types/post";
import { postApi } from "../api/posts.api";
import SpinnerPrimary from "../components/spinner/SpinnerPrimary";
import PostCard from "../components/posts/PostCard";
import type { Topic } from "../types/topics";
import { topicApi } from "../api/topics.api";
import FollowButton from "../components/profile/follow/FollowButton";
import { useSelector } from "react-redux";
import type { RootState } from "../state/store";
import CreatePostForm from "../components/posts/CreatePostForm";
import PrimaryButton from "../components/utils/PrimaryButton";
import Modal from "../components/utils/Modal";

export default function TopicPage() {
  const { topic_id } = useParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const [topic, setTopic] = useState<Topic>();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [status, setStatus] = useState<"loading" | "invalid" | "success">(
    "loading"
  );
  const [createPost, setCreatePost] = useState(false);

  const [userFollows, setUserFollows] = useState(false);
  const [update, setUpdate] = useState(false);
  const invalid_topic = topic === undefined && status !== "loading";

  const fetchPosts = async () => {
    try {
      if (!topic_id) throw new Error("Invalid topic.");

      const res = await postApi.getPostsByTopic(Number(topic_id));
      const data = res.data.posts;

      if (data.length > 0) {
        setPosts(res.data.posts);
        setStatus("success");
      } else {
        throw new Error("no posts");
      }
    } catch (err: any) {
      console.log(err);
      setStatus("invalid");
    }
  };
  useEffect(() => {
    if (topic) {
      fetchPosts();
    }
  }, [topic, update]);

  const fetchTopic = async (id: number) => {
    try {
      const res = await topicApi.getTopic(id);
      const fetchedTopic = res.data.topic as Topic;
      const { user_has_followed } = fetchedTopic;

      if (user_has_followed) {
        setUserFollows(true);
      } else {
        setUserFollows(false);
      }

      setTopic(fetchedTopic);
      setStatus("success");
    } catch (err: any) {
      console.log(err);
      setStatus("invalid");
    }
  };

  useEffect(() => {
    if (topic_id !== undefined) {
      fetchTopic(parseInt(topic_id));
    }
  }, [topic_id, update]);

  if (invalid_topic)
    return (
      <NavSection>
        <NotFound />
      </NavSection>
    );

  if (topic)
    return (
      <>
        <NavSection>
          <div className="w-full flex flex-col items-start justify-start gap-4">
            <div className="w-full flex flex-col items-start justify-start gap-1 border-b border-gray-dark/20 pb-4">
              <div className="flex md:items-center items-start justify-between gap-3 w-full md:flex-row flex-col">
                <div>
                  <h3 className="custom text-5xl flex-1 line-clamp-3">
                    {topic?.topic_name}
                  </h3>

                  {topic.username === "admin" ? (
                    <p className="custom text-fine-print text-sm mt-2">
                      FREE TOPICS
                    </p>
                  ) : (
                    <p className="custom text-fine-print text-sm mt-2">
                      Created by{" "}
                      <Link
                        className="text-primary hover:opacity-70 duration-150 cursor-pointer"
                        to={`/${topic?.username}`}
                      >
                        {topic?.username}
                      </Link>
                    </p>
                  )}
                </div>
                <div className="flex items-center md:justify-end gap-3 md:w-fit w-full justify-center md:mb-0 mb-3">
                  <FollowButton
                    trigger={setUpdate}
                    triggerBool={update}
                    visitingEntity={topic}
                    currentUser={user}
                    followType="topic"
                  />
                  {userFollows && user && (
                    <PrimaryButton
                      className="md:w-fit w-full"
                      onClick={() => setCreatePost(true)}
                    >
                      Make a Post
                    </PrimaryButton>
                  )}
                </div>
              </div>
              <p className="custom text-sm my-2">{topic?.description}</p>
              <div className="flex items-center justify-start gap-2">
                <p className="custom text-gray-dark text-sm">
                  {topic?.post_count}{" "}
                  {`post${topic?.post_count === 1 ? "" : "s"} `}
                </p>
                <p className="custom text-gray-dark text-sm">•</p>
                <p className="custom text-gray-dark text-sm">
                  {topic?.follower_count} followers
                </p>
              </div>
            </div>
            {status === "loading" ? (
              <SpinnerPrimary />
            ) : status === "success" ? (
              <>
                {posts.map((post: PostType, index: number) => {
                  return <PostCard key={index} post={post} />;
                })}
              </>
            ) : (
              <p className="self-center custom text-sm">
                Oops, nothing to see here!
              </p>
            )}
          </div>
        </NavSection>
        {createPost && (
          <Modal close={() => setCreatePost(false)}>
            <CreatePostForm
              topicName={topic.topic_name}
              close={() => setCreatePost(false)}
              topic={topic.id}
              username={user?.username ?? ""}
            />
          </Modal>
        )}
      </>
    );
}
