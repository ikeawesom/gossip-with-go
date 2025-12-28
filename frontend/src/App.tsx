import NavSection from "./components/nav/NavSection";
import TrendingFeed from "./components/posts/TrendingFeed";
import TopicsSection from "./components/topics/TopicsSection";

function App() {
  return (
    <NavSection className="border border-red-500">
      <TopicsSection />
      <TrendingFeed />
    </NavSection>
  );
}

export default App;
