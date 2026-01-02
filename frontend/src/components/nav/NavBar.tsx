import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import Logo from "../utils/Logo";
import { useSelector } from "react-redux";
import type { RootState } from "../../state/store";
import AccountMenu from "../auth/AccountMenu";

export default function NavBar() {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  const page = location.pathname;

  return (
    <nav className="w-full grid place-items-center fixed top-0 left-0 bg-primary text-white py-4 px-12 z-10 shadow-md">
      <div className="max-w-[1000px] flex items-stretch justify-between w-full gap-6">
        <div className="self-center">
          <Logo link />
        </div>
        <SearchBar />
        {user ? (
          <AccountMenu username={user.username} />
        ) : (
          <button
            className="font-bold text-lg whitespace-nowrap hover:bg-white/15 duration-150 rounded-md px-4 cursor-pointer"
            onClick={() =>
              navigate("/auth/login", {
                state: { prev_page: page },
              })
            }
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
