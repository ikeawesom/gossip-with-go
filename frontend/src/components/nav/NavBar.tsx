import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import SecondaryButton from "../utils/SecondaryButton";
import Logo from "../utils/Logo";
import useAuth from "../../hooks/useAuth";

export default function NavBar() {
  const navigate = useNavigate();
  const {user} = useAuth();

  return (
    <nav className="flex items-center justify-between fixed top-0 left-0 w-full bg-primary text-white py-4 px-12 gap-12 z-10 shadow-md">
      <Logo link />
      <SearchBar />
      {user ? 
        <SecondaryButton onClick={() => navigate(`/${user.username}`)} className="whitespace-nowrap hover:opacity-70">My Account</SecondaryButton>
       :<SecondaryButton
        className="whitespace-nowrap"
        onClick={() => navigate("/auth/login")}
      >
        Sign In
      </SecondaryButton>}
    </nav>
  );
}
