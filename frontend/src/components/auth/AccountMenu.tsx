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
      <button
        onClick={() => setShowMenu(true)}
        className="flex items-center justify-end gap-2 rounded-md px-2 py-1 hover:bg-white/10 duration-150 cursor-pointer"
      >
        <img alt="Menu" src="/icons/icon_menu.svg" width={50} height={50} />
      </button>
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
