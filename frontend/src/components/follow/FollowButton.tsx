import PrimaryButton from "../utils/PrimaryButton";
import type { User } from "../../types/auth";
import { followApi } from "../../api/follow.api";
import { toast } from "sonner";
import { useState } from "react";
import SpinnerSecondary from "../spinner/SpinnerSecondary";
import { useLocation, useNavigate } from "react-router-dom";
import type { StateTriggerType } from "../../types/res";

interface FollowTrigger extends StateTriggerType {
  visitingUser: User;
  currentUser: User | null;
}
export default function FollowButton({
  currentUser,
  visitingUser,
  trigger,
  triggerBool,
}: FollowTrigger) {
  const { user_has_followed, user_is_being_followed } = visitingUser;
  const [following, setIsFollowing] = useState(user_has_followed);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleFollow = async () => {
    if (!currentUser) {
      toast.info("Please sign in to interact with users!");
      return navigate("/auth/login", {
        state: { prev_page: location.pathname },
      });
    }
    if (!visitingUser) return;
    setLoading(true);
    try {
      await followApi.toggleFollow(visitingUser.id);
      setIsFollowing(!following);
      trigger(!triggerBool);
    } catch (err) {
      console.log(err);
      toast.error("Could not follow. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrimaryButton disabled={loading} onClick={toggleFollow}>
      {loading ? (
        <SpinnerSecondary />
      ) : following ? (
        "Unfollow"
      ) : user_is_being_followed ? (
        "Follow Back"
      ) : (
        "Follow"
      )}
    </PrimaryButton>
  );
}
