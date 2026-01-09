import NavSection from "../components/nav/NavSection";
import PostsFeed from "../components/posts/PostsFeed";
import TopicsSection from "../components/topics/TopicsSection";

export default function TrendingPostsPage() {
  return (
    <NavSection>
      <TopicsSection />
      <h2 className="pb-3 w-full border-b border-gray-dark/20 flex items-center justify-start gap-1 mt-6 mb-4">
        Trending Posts
        <img
          src="/icons/posts/icon_hot.svg"
          alt="Trending"
          width={30}
          height={30}
        />
      </h2>
      <PostsFeed type="trending" />
    </NavSection>
  );
}
