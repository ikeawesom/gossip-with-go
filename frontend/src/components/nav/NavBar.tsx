import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useSelector } from "react-redux";
import type { RootState } from "../../state/store";
import AccountMenu from "../auth/AccountMenu";
import PrimaryButton from "../utils/PrimaryButton";
import SecondaryButton from "../utils/SecondaryButton";
import { twMerge } from "tailwind-merge";

export interface PageType {
  id: string;
  title: string;
}
const pages = [
  { id: "/trending", title: "Trending" },
  { id: "/for-you", title: "For You" },
] as PageType[];

export default function NavBar() {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  const curPage = location.pathname;

  return (
    <nav className="w-full grid place-items-center fixed top-0 left-0 text-white py-4 px-12 z-10">
      <div className="max-w-[1000px] flex items-center justify-between w-full gap-6">
        <SearchBar />
        <div className="relative p-3 bg-white/60 backdrop-blur-md border border-white/20 rounded-full shadow-sm flex items-center justify-center gap-4 px-6">
          {pages.map((page: PageType, index: number) => (
            <Link
              key={index}
              to={`${page.id}`}
              className={twMerge(
                "whitespace-nowrap text-primary/80 text-sm",
                curPage === page.id && "font-bold text-primary"
              )}
            >
              {page.title}
            </Link>
          ))}
        </div>
        {user ? (
          <AccountMenu username={user.username} />
        ) : (
          <div className="bg-white/60 flex items-center justify-center gap-1 backdrop-blur-md border border-white/20 shadow-sm p-1 rounded-full">
            <SecondaryButton
              className="home-sign-in"
              onClick={() =>
                navigate("/auth/login", {
                  state: { prev_page: curPage },
                })
              }
            >
              Sign In
            </SecondaryButton>
            <PrimaryButton
              className="home-sign-up"
              onClick={() =>
                navigate("/auth/register", {
                  state: { prev_page: curPage },
                })
              }
            >
              Get Started
            </PrimaryButton>
          </div>
        )}
      </div>
    </nav>
  );
}
