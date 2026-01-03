import { useSelector } from "react-redux";
import type { RootState } from "../state/store";
import type { User } from "../types/auth";
import NavSection from "../components/nav/NavSection";
import { formatDate } from "../lib/helpers";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SpinnerPrimary from "../components/spinner/SpinnerPrimary";
import { userApi } from "../api/user.api";
import { postApi } from "../api/posts.api";
import type { PostType } from "../types/post";
import PostCard from "../components/posts/PostCard";
import FollowButton from "../components/follow/FollowButton";
import FollowerFollowingSection from "../components/follow/FollowerFollowingSection";
import CreatePostTopicSection from "./CreatePostTopicSection";

export default function ProfilePage() {
  const { user_id } = useParams<{ user_id: string }>();
  const { user } = useSelector((state: RootState) => state.auth);

  const [userState, setUserState] = useState<"loading" | "success" | "invalid">(
    "loading"
  );
  const [postState, setPostState] = useState<"loading" | "success" | "invalid">(
    "loading"
  );
  const [update, setUpdate] = useState(false);
  const [visitingUser, setVisitingUser] = useState<User>();

  const [userPosts, setUserPosts] = useState<PostType[]>([]);

  useEffect(() => {
    if (!user_id) return;

    const getVisitingUser = async () => {
      try {
        const { data } = await userApi.getVisitingUser(user_id);
        setVisitingUser(data.user);
        setUserState("success");
      } catch (err: any) {
        setUserState("invalid");
      }
    };

    getVisitingUser();
  }, [update, user_id]);

  const getUserPosts = async (username: string) => {
    try {
      const res = await postApi.getPostByUsername(username);
      const posts = res.data.posts as PostType[];
      setUserPosts(posts);
      console.log(posts);
      setPostState("success");
      if (res.data.posts) setPostState("success");
    } catch (err: any) {
      console.log(err);
      setPostState("invalid");
    }
  };

  useEffect(() => {
    if (visitingUser) {
      getUserPosts(visitingUser.username);
    }
  }, [visitingUser]);

  if (userState === "loading")
    return (
      <NavSection>
        <p className="text-center mb-1">Loading user</p>
        <SpinnerPrimary />
      </NavSection>
    );

  const { created_at, username } = visitingUser as User;
  const createdDate = formatDate(new Date(created_at).getTime());

  const isCurrentUser = user?.username === username;

  return (
    <NavSection>
      {userState === "invalid" ? (
        <p className="text-center">User not found.</p>
      ) : (
        <div className="flex items-center justify-between gap-4 border-b border-gray-dark/20 pb-5">
          <div>
            <div className="flex items-center justify-start gap-4">
              <h1 className="mb-1">{username}</h1>
              {!isCurrentUser && visitingUser && (
                <FollowButton
                  followType="user"
                  trigger={setUpdate}
                  triggerBool={update}
                  visitingEntity={visitingUser}
                  currentUser={user}
                />
              )}
            </div>
            {visitingUser && (
              <FollowerFollowingSection visitingUser={visitingUser} />
            )}
            <p className="fine-print">Joined on {createdDate.time}</p>
          </div>
        </div>
      )}
      <div className="flex items-center justify-center w-full flex-col gap-4 py-4">
        {isCurrentUser && (
          <CreatePostTopicSection
            trigger={setUpdate}
            triggerBool={update}
            username={username}
          />
        )}
        {postState === "loading" ? (
          <SpinnerPrimary />
        ) : postState === "invalid" ? (
          <p>{username} has no posts yet.</p>
        ) : userPosts.length > 0 ? (
          <div className="w-full flex flex-col gap-4 items-center justify-center">
            {userPosts.map((post: PostType, index: number) => {
              return (
                <PostCard
                  username={username}
                  post={post}
                  key={index}
                  showTopic
                />
              );
            })}
          </div>
        ) : (
          <p>{username} has no posts yet.</p>
        )}
      </div>
    </NavSection>
  );
}
