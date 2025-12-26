import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import SecondaryButton from "../utils/SecondaryButton";
import Logo from "../utils/Logo";
import { useSelector } from "react-redux";
import type { RootState } from "../../state/store";

export default function NavBar({ showAccount }: { showAccount?: boolean }) {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  showAccount = showAccount ?? true;
  const location = useLocation();

  const page = location.pathname;

  return (
    <nav className="flex items-center justify-between fixed top-0 left-0 w-full bg-primary text-white py-4 px-12 gap-12 z-10 shadow-md">
      <Logo link />
      <SearchBar />
      {showAccount &&
        (user ? (
          <SecondaryButton
            onClick={() =>
              navigate(`/${user.username}`, {
                state: { prev_page: page },
              })
            }
            className="whitespace-nowrap hover:opacity-70"
          >
            My Account
          </SecondaryButton>
        ) : (
          <SecondaryButton
            className="whitespace-nowrap"
            onClick={() =>
              navigate("/auth/login", {
                state: { prev_page: page },
              })
            }
          >
            Sign In
          </SecondaryButton>
        ))}
    </nav>
  );
}
