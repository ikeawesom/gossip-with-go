import { Link, useLocation } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useSelector } from "react-redux";
import type { RootState } from "../../state/store";
import AccountMenu from "../auth/AccountMenu";
import { twMerge } from "tailwind-merge";
import AuthButtons from "../auth/AuthButtons";
import Logo from "../utils/Logo";

export interface PageType {
  id: string;
  title: string;
}
export const pages = [
  { id: "/trending", title: "Trending" },
  { id: "/following", title: "Following" },
] as PageType[];

export default function NavBar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  const curPage = location.pathname;

  return (
    <nav className="w-full grid place-items-center fixed top-0 left-0 text-white py-4 px-4 md:px-0 z-50">
      {/* responsive navbar */}
      <div className="flex items-center gap-4 md:hidden flex-1 w-full justify-between px-2">
        <SearchBar hideLogo />
        <AccountMenu username={user ? user.username : undefined} />
      </div>

      {/* desktop view */}
      <div className="max-w-3xl hidden md:flex items-center justify-between w-full gap-6">
        <SearchBar />
        <div className="relative p-3 bg-white/60 backdrop-blur-md border border-white/20 rounded-full shadow-sm flex items-center justify-center gap-4 px-6">
          {pages.map((page: PageType, index: number) => (
            <Link
              key={index}
              to={`${page.id}`}
              className={twMerge(
                "whitespace-nowrap text-primary/80 text-sm",
                curPage === page.id
                  ? "font-bold text-primary"
                  : "hover:opacity-70 duration-150"
              )}
            >
              {page.title}
            </Link>
          ))}
        </div>
        {user ? <AccountMenu username={user.username} /> : <AuthButtons />}
      </div>
    </nav>
  );
}
