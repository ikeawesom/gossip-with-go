import { useState } from "react";
import Modal from "../utils/Modal";
import ModalTitle from "../utils/ModalTitle";
import SignOutButton from "./SignOutButton";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { pages, type PageType } from "../nav/NavBar";
import { twMerge } from "tailwind-merge";
import Logo from "../utils/Logo";
import AuthButtons from "./AuthButtons";
import NotificationsModal from "../profile/notifications/NotificationsModal";

export default function AccountMenu({
  username,
}: {
  username: string | undefined;
}) {
  const [showMenu, setShowMenu] = useState<"none" | "menu" | "notif">("none");
  const navigate = useNavigate();
  const location = useLocation();

  const curPage = location.pathname;

  const viewProfile = () => {
    navigate(`/${username}`, {
      state: { prev_page: location.pathname },
    });
    setShowMenu("none");
  };

  return (
    <>
      <div
        onClick={() => setShowMenu("menu")}
        className="hover:brightness-110 duration-150 cursor-pointer bg-white/60 flex items-center justify-center gap-1 backdrop-blur-md border border-white/20 rounded-full shadow-sm p-3"
      >
        <img alt="Menu" src="/icons/icon_menu.svg" width={30} height={30} />
      </div>
      {showMenu === "menu" && (
        <Modal
          close={() => setShowMenu("none")}
          className="flex flex-col items-start justify-center gap-2 text-sm max-w-[300px] p-4 text-gray-dark"
        >
          <div className="w-full flex-col flex items-center justify-center gap-5 md:hidden mb-1">
            <Logo link color />

            {pages.map((page: PageType, index: number) => (
              <Link
                key={index}
                to={`${page.id}`}
                className={twMerge(
                  "whitespace-nowrap text-base",
                  curPage === page.id
                    ? "font-bold"
                    : "hover:opacity-70 duration-150",
                )}
              >
                {page.title}
              </Link>
            ))}
          </div>
          {username ? (
            <>
              <div className="border-t border-t-gray-dark/20 w-full my-2 md:hidden" />
              <ModalTitle
                className={twMerge(
                  "text-gray-dark text-base font-normal custom",
                  "max-[768px]:border-none max-[768px]:pb-1",
                )}
              >
                Signed in as{" "}
                <span className="text-primary font-bold">{username}</span>
              </ModalTitle>
              <button
                onClick={viewProfile}
                className="flex items-center justify-start gap-4 w-full rounded-md hover:bg-primary/10 duration-150 p-2 text-start cursor-pointer"
              >
                <img src="/icons/icon_user.svg" className="w-4" />
                View my Profile
              </button>
              <button
                onClick={() => setShowMenu("notif")}
                className="flex items-center justify-start gap-4 w-full rounded-md hover:bg-primary/10 duration-150 p-2 text-start cursor-pointer"
              >
                <img src="/icons/icon_notif.svg" className="w-4" />
                Notifications
              </button>
              <SignOutButton />
            </>
          ) : (
            <>
              <div className="border-t border-t-gray-dark/20 w-full my-2 md:hidden" />
              <AuthButtons className="w-full" />
            </>
          )}
        </Modal>
      )}
      {showMenu === "notif" && (
        <NotificationsModal
          back={() => setShowMenu("menu")}
          close={() => setShowMenu("none")}
        />
      )}
    </>
  );
}
