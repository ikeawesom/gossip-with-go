import { twMerge } from "tailwind-merge";
import NavSection from "./components/nav/NavSection";
import TopicsSection from "./components/topics/TopicsSection";
import { DEV_MODE } from "./lib/constants";
import TrendingPostsHori from "./components/posts/TrendingPostsHori";

function App() {
  return (
    <NavSection
      className={twMerge(
        "flex flex-col items-center justify-center w-full gap-4",
        DEV_MODE ? "border border-red-500" : ""
      )}
    >
      <TrendingPostsHori />
      <TopicsSection />
    </NavSection>
  );
}

export default App;
