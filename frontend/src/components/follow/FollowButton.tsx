import PrimaryButton from "../utils/PrimaryButton";
import type { User } from "../../types/auth";
import { followApi } from "../../api/follow.api";
import { toast } from "sonner";
import { useState } from "react";
import SpinnerSecondary from "../spinner/SpinnerSecondary";
import { useLocation, useNavigate } from "react-router-dom";
import type { StateTriggerType } from "../../types/res";
import type { Topic } from "../../types/topics";
import SecondaryButton from "../utils/SecondaryButton";

interface FollowTrigger extends StateTriggerType {
  visitingEntity: User | Topic;
  currentUser: User | null;
  followType: "user" | "topic";
}

function isUser(entity: User | Topic): entity is User {
  return "user_is_being_followed" in entity;
}

export default function FollowButton({
  currentUser,
  visitingEntity,
  trigger,
  triggerBool,
  followType,
}: FollowTrigger) {
  const { user_has_followed } = visitingEntity;

  const user_is_being_followed = isUser(visitingEntity)
    ? visitingEntity.user_is_being_followed
    : false;

  const [following, setIsFollowing] = useState(user_has_followed);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleFollow = async () => {
    if (!currentUser) {
      toast.info(
        `Please sign in to interact with ${
          followType === "user" ? "users" : "topics"
        }!`
      );
      return navigate("/auth/login", {
        state: { prev_page: location.pathname },
      });
    }
    if (!visitingEntity) return;
    setLoading(true);
    try {
      console.log(visitingEntity.id);
      await followApi.toggleFollow(visitingEntity.id, followType);
      setIsFollowing(!following);
      trigger(!triggerBool);
    } catch (err) {
      console.log(err);
      toast.error("Could not follow. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return following ? (
    <SecondaryButton
      className="md:w-fit w-full"
      disabled={loading}
      onClick={toggleFollow}
    >
      {loading ? <SpinnerSecondary /> : "Unfollow"}
    </SecondaryButton>
  ) : (
    <PrimaryButton
      className="md:w-fit w-full"
      disabled={loading}
      onClick={toggleFollow}
    >
      {loading ? (
        <SpinnerSecondary />
      ) : user_is_being_followed ? (
        "Follow Back"
      ) : (
        "Follow"
      )}
    </PrimaryButton>
  );
}
