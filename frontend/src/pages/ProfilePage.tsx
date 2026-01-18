import { useSelector } from "react-redux";
import type { RootState } from "../state/store";
import type { User } from "../types/auth";
import NavSection from "../components/nav/NavSection";
import { formatDate } from "../lib/helpers";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SpinnerPrimary from "../components/spinner/SpinnerPrimary";
import { userApi } from "../api/user.api";
import FollowButton from "../components/profile/follow/FollowButton";
import FollowerFollowingSection from "../components/profile/follow/FollowerFollowingSection";
import BuzzSection from "../components/profile/BuzzSection";
import SettingsButton from "../components/profile/SettingsButton";
import LongContent from "../components/posts/LongContent";
import UserPostsSection from "../components/profile/UserPostsSection";
import { twMerge } from "tailwind-merge";
import PfpModal from "../components/profile/PfpModal";

export type ProfileToggleType = "posts" | "reposts";

interface PageToggleType {
  id: ProfileToggleType;
  title: string;
  src: string;
  size?: number;
}

const pageToggles = [
  {
    id: "posts",
    title: "Gossips",
    src: "icons/posts/icon_comment_primary.svg",
  },
  {
    id: "reposts",
    title: "Reposts",
    src: "icons/posts/icon_reposted.svg",
    size: 20,
  },
] as PageToggleType[];

export default function ProfilePage() {
  const { user_id } = useParams<{ user_id: string }>();
  const { user } = useSelector((state: RootState) => state.auth);

  const [userState, setUserState] = useState<"loading" | "success" | "invalid">(
    "loading"
  );
  const [view, setView] = useState<"posts" | "reposts">("posts");

  const [update, setUpdate] = useState(false);
  const [visitingUser, setVisitingUser] = useState<User>();

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

  if (userState === "loading")
    return (
      <NavSection>
        <p className="text-center mb-2 custom">Loading user...</p>
        <SpinnerPrimary size={25} />
      </NavSection>
    );

  const { created_at, bio, username, buzz, pfp } = visitingUser as User;
  const createdDate = formatDate(new Date(created_at).getTime());

  const isCurrentUser = user?.username === username;

  return (
    <NavSection>
      {userState === "invalid" ? (
        <p className="text-center">User not found.</p>
      ) : (
        <div className="flex items-center justify-between gap-4 border-b border-gray-dark/20 pb-3 w-full">
          <div className="w-full">
            <div className="flex md:flex-row flex-col items-start md:items-center justify-start gap-2 md:gap-4 w-full">
              <div className="flex items-center justify-start gap-4 w-full">
                <PfpModal pfp={pfp} />
                <div>
                  <h1>{username}</h1>
                  {bio && <LongContent className="mt-1" content={bio} />}
                </div>
              </div>
              <div className="w-full flex items-center justify-end gap-2">
                {!isCurrentUser && visitingUser && (
                  <div className="md:w-fit w-full">
                    <FollowButton
                      followType="user"
                      trigger={setUpdate}
                      triggerBool={update}
                      visitingEntity={visitingUser}
                      currentUser={user}
                    />
                  </div>
                )}
                {isCurrentUser && visitingUser && (
                  <div className="md:w-fit w-full">
                    <SettingsButton
                      user={visitingUser}
                      trigger={setUpdate}
                      triggerBool={update}
                    />
                  </div>
                )}
              </div>
            </div>
            {visitingUser && (
              <FollowerFollowingSection visitingUser={visitingUser} />
            )}
            <BuzzSection buzz={buzz} />
            <p className="fine-print">Joined on {createdDate.time}</p>
          </div>
        </div>
      )}
      <div className="w-full flex items-center justify-around gap-4 mt-4">
        {pageToggles.map((page: PageToggleType, index: number) => {
          const { id, title, src, size } = page;
          return (
            <div
              onClick={() => setView(id)}
              key={index}
              className={twMerge(
                "flex-1 flex items-center justify-center gap-1 py-2 hover:bg-gray-dark/10 cursor-pointer rounded-md duration-150",
                view === id &&
                  "from-white/50 to-white shadow-sm bg-linear-to-br"
              )}
            >
              <img
                src={`/${src}`}
                alt={title}
                width={size ?? 25}
                height={size ?? 25}
              />
              <h4 className="custom font-normal">{title}</h4>
            </div>
          );
        })}
      </div>
      {visitingUser &&
        (view === "posts" ? (
          <UserPostsSection view={view} username={visitingUser.username} />
        ) : (
          <UserPostsSection
            view={view}
            id={visitingUser.id}
            username={visitingUser.username}
          />
        ))}
    </NavSection>
  );
}
