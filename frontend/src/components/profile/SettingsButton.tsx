import { useState } from "react";
import type { User } from "../../types/auth";
import type { StateTriggerType } from "../../types/res";
import SecondaryButton from "../utils/SecondaryButton";
import Modal from "../utils/Modal";
import ModalTitle from "../utils/ModalTitle";
import { toast } from "sonner";
import EditProfileForm from "./EditProfileForm";
import UserLikes from "./UserLikes";
import UserCommentsSection from "./UserCommentsSection";

export interface SettingsInterface extends StateTriggerType {
  user: User;
}

export default function SettingsButton({
  user,
  trigger,
  triggerBool,
}: SettingsInterface) {
  const [show, setShow] = useState<
    "none" | "settings" | "edit" | "likes" | "comments"
  >("none");

  const handleClose = () => {
    setShow("none");
    trigger(!triggerBool);
  };

  const {} = user;
  return (
    <>
      <SecondaryButton
        className="md:w-fit w-full"
        onClick={() => setShow("settings")}
      >
        <span className="flex items-center justify-center gap-1">
          <img
            src="/utils/icon_settings.svg"
            alt="Settings"
            width={20}
            height={20}
          />
          Settings
        </span>
      </SecondaryButton>
      {show !== "none" && (
        <Modal close={handleClose}>
          {show === "settings" && (
            <>
              <ModalTitle>Settings</ModalTitle>
              <button
                onClick={() => setShow("edit")}
                className="flex items-center mt-2 justify-start gap-4 w-full rounded-md hover:bg-primary/10 duration-150 p-2 text-start cursor-pointer"
              >
                <img src="/icons/icon_pencil.svg" width={15} height={15} />
                Edit Profile
              </button>
              <ModalTitle className="custom text-sm mt-3">
                <span className="flex items-center justify-start gap-2">
                  <img
                    src="/icons/icon_chart.svg"
                    width={20}
                    height={20}
                    className="-ml-1"
                  />
                  Your Activity
                </span>
              </ModalTitle>
              <button
                onClick={() => setShow("likes")}
                className="flex items-center justify-start gap-4 w-full rounded-md hover:bg-primary/10 duration-150 p-2 text-start cursor-pointer mt-2"
              >
                <img
                  src="/icons/posts/icon_liked_primary.svg"
                  width={20}
                  height={20}
                  className="-ml-1"
                />
                Likes
              </button>
              <button
                onClick={() => setShow("comments")}
                className="flex items-center justify-start gap-4 w-full rounded-md hover:bg-primary/10 duration-150 p-2 text-start cursor-pointer"
              >
                <img
                  src="/icons/posts/icon_comment_primary.svg"
                  width={20}
                  height={20}
                  className="-ml-1"
                />
                Comments
              </button>
            </>
          )}
          {show === "edit" && (
            <>
              <ModalTitle back={() => setShow("settings")}>
                Edit Profile
              </ModalTitle>
              <div className="flex w-full flex-col items-start justify-start gap-2 mt-2">
                <div className="w-full flex items-center justify-between">
                  <p className="custom text-sm">Email Address</p>
                  <p
                    onClick={() =>
                      toast.error("Your email address cannot be changed!")
                    }
                    className="custom text-sm font-bold cursor-not-allowed"
                  >
                    {user.email}
                  </p>
                </div>
                <EditProfileForm close={handleClose} user={user} />
              </div>
            </>
          )}
          {show === "likes" && (
            <>
              <ModalTitle back={() => setShow("settings")}>
                <span className="flex items-center justify-start gap-2">
                  Likes
                </span>
              </ModalTitle>
              <UserLikes id={user.id} />
            </>
          )}
          {show === "comments" && (
            <>
              <ModalTitle back={() => setShow("settings")}>
                <span className="flex items-center justify-start gap-2">
                  Comments
                </span>
              </ModalTitle>
              <UserCommentsSection id={user.id} />
            </>
          )}
        </Modal>
      )}
    </>
  );
}
