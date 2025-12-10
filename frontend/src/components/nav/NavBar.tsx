import { useNavigate } from "react-router-dom";
import { APP_NAME } from "../../lib/constants";
import SearchBar from "./SearchBar";
import SecondaryButton from "../utils/SecondaryButton";

export default function NavBar() {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between fixed top-0 left-0 w-full bg-primary text-white py-4 px-12 gap-12 z-10 shadow-md">
      <h1 className="font-bold">{APP_NAME}</h1>
      <SearchBar />
      <SecondaryButton onClick={() => navigate("/auth/login")}>
        Login
      </SecondaryButton>
    </nav>
  );
}
