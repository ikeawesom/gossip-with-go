import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import SecondaryButton from "../utils/SecondaryButton";
import Logo from "../utils/Logo";

export default function NavBar() {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between fixed top-0 left-0 w-full bg-primary text-white py-4 px-12 gap-12 z-10 shadow-md">
      <Logo link />
      <SearchBar />
      <SecondaryButton
        className="whitespace-nowrap"
        onClick={() => navigate("/auth/login")}
      >
        Sign In
      </SecondaryButton>
    </nav>
  );
}
