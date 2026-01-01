import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../state/store";
import type { User } from "../types/auth";
import NavSection from "../components/nav/NavSection";
import { formatDate } from "../lib/helpers";
import { useParams } from "react-router-dom";
import PrimaryButton from "../components/utils/PrimaryButton";
import { toast } from "sonner";
import { authApi } from "../api/auth.api";
import { useEffect, useState } from "react";
import SpinnerPrimary from "../components/spinner/SpinnerPrimary";
import { userApi } from "../api/user.api";
import { checkAuth } from "../state/auth/authSlice";
import { postApi } from "../api/posts.api";
import type { PostType } from "../types/post";
import CreatePostForm from "../components/posts/CreatePostForm";
import PostCard from "../components/posts/PostCard";
import Modal from "../components/utils/Modal";
import FollowButton from "../components/follow/FollowButton";
import FollowerFollowingSection from "../components/follow/FollowerFollowingSection";

export default function ProfilePage() {
  const { user_id } = useParams<{ user_id: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const [showForm, setShowForm] = useState(false);

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
    const getVisitingUser = async () => {
      try {
        const { data } = await userApi.getVisitingUser(user_id ?? "");
        setVisitingUser(data.user);
        setUserState("success");
      } catch (err: any) {
        setUserState("invalid");
      }
    };

    getVisitingUser();
  }, [update]);

  const getUserPosts = async (username: string) => {
    try {
      const res = await postApi.getPostByUsername(username);
      setUserPosts(res.data.posts);
      setPostState("success");
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

  const handleSignout = async () => {
    try {
      await authApi.logout();
      dispatch(checkAuth());
      toast.success("Signed out successfully");
    } catch (err: any) {
      console.log(err);
      toast.error("Could not sign out. Please try again later.");
    }
  };

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
    <NavSection showAccount={!isCurrentUser}>
      {userState === "invalid" ? (
        <p className="text-center">User not found.</p>
      ) : (
        <div className="flex items-center justify-between gap-4 border-b border-gray-dark/20 pb-5">
          <div>
            <div className="flex items-center justify-start gap-4">
              <h1 className="mb-1">{username}</h1>
              {!isCurrentUser && visitingUser && (
                <FollowButton
                  trigger={setUpdate}
                  triggerBool={update}
                  visitingUser={visitingUser}
                  currentUser={user}
                />
              )}
            </div>
            {visitingUser && (
              <FollowerFollowingSection visitingUser={visitingUser} />
            )}
            <p className="fine-print">Joined on {createdDate.time}</p>
          </div>
          {isCurrentUser && (
            <PrimaryButton onClick={handleSignout} className="bg-red">
              Sign Out
            </PrimaryButton>
          )}
        </div>
      )}
      <div className="flex items-center justify-center w-full flex-col gap-4 py-4">
        {isCurrentUser &&
          (showForm ? (
            <Modal close={() => setShowForm(false)}>
              <CreatePostForm
                close={() => setShowForm(false)}
                reload={getUserPosts}
                username={username}
              />
            </Modal>
          ) : (
            <PrimaryButton onClick={() => setShowForm(true)}>
              Make a Post
            </PrimaryButton>
          ))}
        {postState === "loading" ? (
          <SpinnerPrimary />
        ) : postState === "invalid" ? (
          <p>{username} has no posts yet.</p>
        ) : (
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
        )}
      </div>
    </NavSection>
  );
}
