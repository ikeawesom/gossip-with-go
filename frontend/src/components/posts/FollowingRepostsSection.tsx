import { Link } from "react-router-dom";

export default function FollowingRepostsSection({
  reposters,
}: {
  reposters: string[];
}) {
  return (
    <div className="mb-2 flex items-center gap-1 text-xs text-gray-600">
      <img
        src="/icons/posts/icon_reposted.svg"
        alt="Repost"
        width={16}
        height={16}
        className="opacity-70"
      />
      <span>
        Reposted by{" "}
        {reposters.slice(0, 3).map((username: string, index: number) => {
          return (
            <span key={index}>
              <Link
                to={`/${username}`}
                className="font-bold text-primary hover:opacity-70 duration-150"
              >
                {username}
              </Link>
              {reposters.length < 4 &&
              index === Math.min(reposters.length, 3) - 2
                ? " and "
                : index < Math.min(reposters.length, 3) - 1
                ? ", "
                : ""}
            </span>
          );
        })}
        {reposters.length > 3 && (
          <span className="text-gray-dark">
            {" "}
            and {reposters.length - 3} other
            {reposters.length - 3 > 1 ? "s" : ""}
          </span>
        )}
      </span>
    </div>
  );
}
