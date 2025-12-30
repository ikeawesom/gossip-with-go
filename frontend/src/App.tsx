import { twMerge } from "tailwind-merge";
import NavSection from "./components/nav/NavSection";
import TrendingFeed from "./components/posts/TrendingFeed";
import TopicsSection from "./components/topics/TopicsSection";
import { DEV_MODE } from "./lib/constants";

function App() {
  return (
    <NavSection className={twMerge(DEV_MODE ? "border border-red-500" : "")}>
      <TopicsSection />
      <TrendingFeed />
    </NavSection>
  );
}

export default App;
