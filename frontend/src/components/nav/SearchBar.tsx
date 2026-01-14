import { useState } from "react";
import { twMerge } from "tailwind-merge";
import useQuery, { type QueryResult } from "../../hooks/useQuery";
import SpinnerPrimary from "../spinner/SpinnerPrimary";
import type { UserSearchResult } from "../../types/query";
import type { PostType } from "../../types/post";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../lib/helpers";
import Modal from "../utils/Modal";
import Logo from "../utils/Logo";
import type { Topic } from "../../types/topics";
import PfpImg from "../profile/PfpImg";

const queryTypes = ["users", "posts", "topics"] as QueryType[];
export type QueryType = "users" | "posts" | "topics";

export default function SearchBar({ hideLogo }: { hideLogo?: boolean }) {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [queryType, setQueryType] = useState<QueryType>("users");
  const { loading, results, resetResults } = useQuery(query, queryType);
  const navigate = useNavigate();

  const resetQuery = () => {
    setQuery("");
    setQueryType("users");
    setShowSearch(false);
    resetResults();
    setShowSearch(false);
  };

  const handleNavigate = (url: string) => {
    navigate(url);
    resetQuery();
  };

  return (
    <>
      <div
        className={twMerge(
          "w-full relative bg-white/60 backdrop-blur-md border border-white/20 rounded-full p-1 shadow-sm flex items-center justify-start gap-3",
          !hideLogo && "pl-3"
        )}
      >
        {!hideLogo && <Logo small link color />}
        <input
          onClick={() => setShowSearch(true)}
          className="relative z-10 custom bg-white placeholder-fine-print rounded-full px-4 py-2 border focus:shadow-none border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary/80 text-gray-dark w-full"
          type="text"
          placeholder="Search"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
        />
      </div>
      {showSearch && (
        <Modal close={resetQuery}>
          <input
            className="relative z-10 custom bg-white placeholder-fine-print rounded-full px-4 py-2 border focus:shadow-none shadow-sm border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary/80 text-gray-dark w-full mb-2"
            type="text"
            placeholder="Search"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
          <div className="w-full overflow-hidden">
            <div className="w-full py-2 pt-0 shadow-xs border-b border-gray-dark/20 flex flex-col items-start justify-center gap-2">
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
                "max-h-[50vh] overflow-y-scroll bg-white rounded-md mt-3",
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
                        className="text-sm flex items-center justify-start gap-2 px-3 py-4 border-b border-gray-light hover:bg-fine-print/25 cursor-pointer text-gray-dark"
                      >
                        <PfpImg icon pfp={user.pfp} />
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
                        <div className="w-full flex flex-col items-start justify-start gap-1">
                          <p className="flex items-center justify-start gap-1">
                            <PfpImg icon pfp={post.pfp} />
                            {post.username}
                          </p>
                          <h4 className="custom font-bold">{post.title}</h4>
                          <div className="flex items-start justify-between w-full gap-2">
                            <p className="line-clamp-3 flex-1">
                              {post.content}
                            </p>
                            <p className="custom text-sm flex items-center justify-end gap-1">
                              {post.like_count}{" "}
                              <img
                                src="/icons/posts/icon_liked_primary.svg"
                                alt="Likes"
                                width={15}
                                height={15}
                              />
                            </p>
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
                    const topic = item as Topic;
                    const { id, topic_name, username, follower_count } = topic;
                    url = `/topics/${id}`;
                    return (
                      <li
                        onClick={() => handleNavigate(url)}
                        key={index}
                        className="text-sm p-2 border-b border-gray-light hover:bg-fine-print/25 cursor-pointer text-gray-dark"
                      >
                        <span className="flex items-start justify-between gap-4">
                          <h4 className="custom font-bold line-clamp-2 flex-1">
                            {topic_name}
                          </h4>
                          <p className="custom flex text-sm items-center justify-end gap-1">
                            {follower_count}
                            <img
                              src="/icons/icon_user.svg"
                              alt="Followers"
                              width={10}
                              height={10}
                            />
                          </p>
                        </span>
                        <p className="fine-print custom text-xs">
                          {topic.username === "admin"
                            ? "FREE TOPICS"
                            : `Created by ${username}`}
                        </p>
                      </li>
                    );
                  }
                })
              ) : (
                <li className="text-sm md:text-base h-[100px] grid place-items-center text-fine-print text-center p-2 border-b border-gray-light">
                  {query.length > 0
                    ? "Hmm, no results were found. Try another keyword."
                    : "Search a headline or some key words to get started!"}
                </li>
              )}
            </ul>
          </div>
        </Modal>
      )}
    </>
  );
}
