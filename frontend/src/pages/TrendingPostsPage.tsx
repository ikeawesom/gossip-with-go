import NavSection from "../components/nav/NavSection";
import TrendingFeed from "../components/posts/TrendingFeed";

export default function TrendingPostsPage() {
  return (
    <NavSection>
      <h2 className="pb-3 mb-4 w-full border-b border-gray-dark/20 flex items-center justify-start gap-1">
        Trending Posts
        <img
          src="/icons/posts/icon_hot.svg"
          alt="Trending"
          width={30}
          height={30}
        />
      </h2>
      <TrendingFeed />
    </NavSection>
  );
}
