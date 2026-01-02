import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import useQuery, { type QueryResult } from "../../hooks/useQuery";
import SpinnerPrimary from "../spinner/SpinnerPrimary";
import type { TopicSearchResult, UserSearchResult } from "../../types/query";
import type { PostType } from "../../types/post";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../lib/helpers";

const queryTypes = ["users", "posts"] as QueryType[];
export type QueryType = "users" | "posts"; // | "topics"

export default function SearchBar() {
  const [showDrop, setShowDrop] = useState(false);
  const [query, setQuery] = useState("");
  const [queryType, setQueryType] = useState<QueryType>("users");
  const { loading, results, resetResults } = useQuery(query, queryType);
  const navigate = useNavigate();

  const searchRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (url: string) => {
    navigate(url);
    setQuery("");
    setQueryType("users");
    setShowDrop(false);
    resetResults();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowDrop(false);
      }
    };

    if (showDrop) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDrop]);

  return (
    <div ref={searchRef} className="w-full relative">
      <input
        onClick={() => setShowDrop(true)}
        onChange={(e) => setQuery(e.target.value)}
        className="relative z-10"
        type="text"
        placeholder="Search"
        value={query}
      />
      {showDrop && (
        <>
          <div className="absolute left-0 top-0 z-0 pt-12 bg-white shadow-md rounded-t-3xl rounded-b-md w-full overflow-hidden">
            <div className="w-full py-2 shadow-xs border-b border-gray-dark/20 flex flex-col items-start justify-center gap-2">
              <div className="flex items-center justify-start px-2 gap-3 w-full">
                {queryTypes.map((type: QueryType, index: number) => (
                  <p
                    key={index}
                    onClick={() => setQueryType(type)}
                    className={twMerge(
                      "cursor-pointer hover:opacity-70 duration-150 custom",
                      queryType === type ? "text-primary" : "text-primary/50"
                    )}
                  >
                    {`${type.substring(0, 1).toUpperCase()}${type.substring(
                      1,
                      type.length
                    )}`}
                  </p>
                ))}
              </div>
              {query.length > 0 && !loading && (
                <p className="custom fine-print text-xs pl-2">
                  {results.length} results
                </p>
              )}
            </div>

            <ul
              className={twMerge(
                "max-h-[50vh] overflow-y-scroll",
                results.length > 0 && "min-h-[100px]"
              )}
            >
              {loading ? (
                <li className="h-[100px] grid place-items-center p-2 border-b border-gray-light">
                  <SpinnerPrimary />
                </li>
              ) : results.length > 0 ? (
                results.map((item: QueryResult, index: number) => {
                  let url: string;

                  if (queryType === "users") {
                    const user = item as UserSearchResult;
                    url = `/${user.username}`;
                    return (
                      <li
                        onClick={() => handleNavigate(url)}
                        key={index}
                        className="p-2 border-b border-gray-light hover:bg-fine-print/25 cursor-pointer text-gray-dark"
                      >
                        {user.username}
                      </li>
                    );
                  } else if (queryType === "posts") {
                    const post = item as PostType;
                    url = `/${post.username}/posts/${post.id}`;
                    return (
                      <li
                        onClick={() => handleNavigate(url)}
                        key={index}
                        className="p-2 border-b border-gray-light hover:bg-fine-print/25 cursor-pointer text-gray-dark"
                      >
                        <div>
                          <div className="flex items-center justify-start gap-2">
                            <h4 className="custom font-bold">{post.title}</h4> •{" "}
                            <p>{post.username}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="line-clamp-3">{post.content}...</p>
                            <p className="fine-print">{post.like_count} ❤︎</p>
                          </div>
                          <p className="fine-print custom text-xs">
                            {
                              formatDate(new Date(post.updated_at).getTime())
                                .time
                            }
                          </p>
                        </div>
                      </li>
                    );
                  } else {
                    const topic = item as TopicSearchResult;
                    url = `/topics/${topic.id}`;
                    return (
                      <li
                        onClick={() => handleNavigate(url)}
                        key={index}
                        className="p-2 border-b border-gray-light hover:bg-fine-print/25 cursor-pointer text-gray-dark"
                      >
                        {}
                      </li>
                    );
                  }
                })
              ) : (
                <li className="h-[100px] grid place-items-center text-fine-print text-center p-2 border-b border-gray-light">
                  {query.length > 0
                    ? "Hmm, no results were found. Try another keyword."
                    : "Search a headline or some key words to get started!"}
                </li>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
