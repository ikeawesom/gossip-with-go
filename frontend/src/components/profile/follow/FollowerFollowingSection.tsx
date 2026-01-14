import { useEffect, useState } from "react";
import type { ApiError, User } from "../../../types/auth";
import Modal from "../../utils/Modal";
import { toast } from "sonner";
import SpinnerPrimary from "../../spinner/SpinnerPrimary";
import { userApi } from "../../../api/user.api";
import { useNavigate } from "react-router-dom";
import ModalTitle from "../../utils/ModalTitle";
import type { AxiosError } from "axios";
import { defaultError } from "../../../lib/constants";
import PfpImg from "../PfpImg";

interface FollowResponse {
  id: number;
  username: string;
  pfp: string;
}

export default function FollowerFollowingSection({
  visitingUser,
}: {
  visitingUser: User;
}) {
  const { follower_count, following_count, username } = visitingUser;
  const [showFollows, setShowFollows] = useState(false);
  const [showFollowings, setShowFollowings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<FollowResponse[]>([]);
  const navigate = useNavigate();

  const handleClick = (username: string) => {
    setShowFollowings(false);
    setShowFollows(false);
    navigate(`/${username}`);
  };

  const fetchFollowers = async () => {
    setLoading(true);
    try {
      const res = await userApi.getFollowers(username);
      const followers = res.data.user;
      setList(followers);
    } catch (err) {
      // get full axios error
      const axiosError = err as AxiosError<ApiError>;
      console.log("[FOLLOWERS ERROR]:", axiosError.response?.data);

      // toast error or default error
      toast.error(axiosError.response?.data?.message || defaultError.message);
      setShowFollows(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowings = async () => {
    setLoading(true);
    try {
      const res = await userApi.getFollowings(username);
      const followings = res.data.user;
      setList(followings);
    } catch (err) {
      // get full axios error
      const axiosError = err as AxiosError<ApiError>;
      console.log("[FOLLOWINGS ERROR]:", axiosError.response?.data);

      // toast error or default error
      toast.error(axiosError.response?.data?.message || defaultError.message);
      setShowFollows(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (showFollows) {
      fetchFollowers();
    } else {
      setList([]);
    }
    if (showFollowings) {
      fetchFollowings();
    } else {
      setList([]);
    }
  }, [showFollows, showFollowings]);

  return (
    <>
      <div className="flex items-center justify-start gap-2 pb-2 border-t border-gray-dark/20 pt-3 mt-3">
        <p
          onClick={() => setShowFollows(true)}
          className="custom text-sm cursor-pointer hover:opacity-70 duration-150"
        >
          <span className="font-bold">{follower_count}</span> followers
        </p>
        <p
          onClick={() => setShowFollowings(true)}
          className="custom text-sm cursor-pointer hover:opacity-70 duration-150"
        >
          <span className="font-bold">{following_count}</span> following
        </p>
      </div>
      {showFollows && (
        <Modal close={() => setShowFollows(false)}>
          <ModalTitle>
            <span className="font-bold text-primary">{username}</span> Followers
          </ModalTitle>
          <div className="mt-3 w-full bg-white rounded-md min-h-[200px] overflow-y-scroll">
            {loading ? (
              <div className="w-full h-[200px] grid place-items-center">
                <SpinnerPrimary />
              </div>
            ) : list.length > 0 ? (
              <ul className="w-full">
                {list.map((user: FollowResponse, index: number) => (
                  <li
                    onClick={() => handleClick(user.username)}
                    className="py-3 px-2 flex items-center justify-start gap-1 border-b border-gray-light hover:bg-fine-print/25 cursor-pointer text-gray-dark"
                    key={index}
                  >
                    <PfpImg icon pfp={user.pfp} />
                    {user.username}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="w-full h-[200px] grid place-items-center">
                <p className="fine-print">{username} has no followers</p>
              </div>
            )}
          </div>
        </Modal>
      )}
      {showFollowings && (
        <Modal close={() => setShowFollowings(false)}>
          <ModalTitle>
            <span className="font-bold text-primary">{username}</span>{" "}
            Followings
          </ModalTitle>
          <div className="mt-3 w-full bg-white rounded-md min-h-[200px] overflow-y-scroll overflow-x-hidden hover:bg-gray">
            {loading ? (
              <div className="w-full h-[200px] grid place-items-center">
                <SpinnerPrimary />
              </div>
            ) : list.length > 0 ? (
              <ul className="w-full">
                {list.map((user: FollowResponse, index: number) => (
                  <li
                    onClick={() => handleClick(user.username)}
                    className="py-3 px-2 flex items-center justify-start gap-1 border-b border-gray-light hover:bg-fine-print/25 cursor-pointer text-gray-dark"
                    key={index}
                  >
                    <PfpImg icon pfp={user.pfp} />
                    {user.username}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="w-full h-[200px] grid place-items-center">
                <p className="fine-print">{username} is not following anyone</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
