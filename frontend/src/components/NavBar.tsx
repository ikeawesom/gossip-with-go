import { APP_NAME } from "../constants";
import SearchBar from "./nav/SearchBar";

export default function NavBar() {
  return (
    <div className="flex items-center justify-between fixed top-0 left-0 w-full bg-primary text-white p-4 gap-12 z-10 shadow-md">
      <h1 className="font-bold">{APP_NAME}</h1>
      <SearchBar />
    </div>
  );
}
