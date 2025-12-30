import { useEffect, useRef, useCallback } from "react";
import { usePagination } from "../../hooks/usePagination";
import PostCard from "./PostCard";
import SpinnerPrimary from "../spinner/SpinnerPrimary";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "../../state/store";

export default function TrendingFeed() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { posts, loading, error, hasMore, loadMore } = usePagination(10);

  // ref for the "load more" trigger element
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasMore && !loading && !error) {
        console.log("Loading more posts...");
        loadMore();
      }
    },
    [hasMore, loading, loadMore]
  );

  useEffect(() => {
    if (error) {
      console.log(error);
      toast.error(error);
    }
  }, [error]);

  // setting up intersection observer
  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "100px", // trigger 100px before reaching the element
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleObserver, option);

    // observe the trigger element
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [handleObserver]);

  return (
    <div className="flex items-center justify-center gap-5 flex-col mt-4 border-t border-t-gray-dark/20 pt-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} showTopic />
      ))}
      {!error && loading && (
        <div className="w-full grid place-items-center p-6">
          <SpinnerPrimary size={24} />
        </div>
      )}
      {}

      {!error && !loading && hasMore && (
        <div ref={loadMoreRef} className="w-full grid place-items-center p-6">
          <SpinnerPrimary size={24} />
        </div>
      )}

      {!error && !loading && !hasMore && posts.length > 0 && (
        <p className="text-center py-8 custom text-gray-dark">
          You've reached the end.{" "}
          <span>
            Start sharing{" "}
            <Link
              className="font-bold text-primary"
              to={`/${user ? user.username : "auth/register"}`}
            >
              here
            </Link>{" "}
            today!
          </span>
        </p>
      )}
    </div>
  );
}
