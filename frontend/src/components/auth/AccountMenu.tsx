import { useState } from "react";
import Modal from "../utils/Modal";
import ModalTitle from "../utils/ModalTitle";
import SignOutButton from "./SignOutButton";
import { useLocation, useNavigate } from "react-router-dom";

export default function AccountMenu({ username }: { username: string }) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const viewProfile = () => {
    navigate(`/${username}`, {
      state: { prev_page: location.pathname },
    });
    setShowMenu(false);
  };

  return (
    <>
      <div
        onClick={() => setShowMenu(true)}
        className="hover:brightness-110 duration-150 cursor-pointer bg-white/60 flex items-center justify-center gap-1 backdrop-blur-md border border-white/20 rounded-full shadow-sm p-2"
      >
        <img alt="Menu" src="/icons/icon_menu.svg" width={24} height={24} />
      </div>
      {showMenu && (
        <Modal
          close={() => setShowMenu(false)}
          className="flex flex-col items-start justify-center gap-2 text-sm max-w-[300px] p-4 text-gray-dark"
        >
          <ModalTitle className="text-gray-dark text-base font-normal custom">
            Signed in as{" "}
            <span className="text-primary font-bold">{username}</span>
          </ModalTitle>
          <button
            onClick={viewProfile}
            className="flex items-center justify-start gap-4 w-full rounded-md hover:bg-primary/10 duration-150 p-2 text-start cursor-pointer"
          >
            <img src="/icons/icon_user.svg" width={15} height={15} />
            View my Profile
          </button>
          <SignOutButton />
        </Modal>
      )}
    </>
  );
}
