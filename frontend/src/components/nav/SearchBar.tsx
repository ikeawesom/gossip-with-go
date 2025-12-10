import { formatDate } from "../../helpers";
import type { QueryPeek } from "../../types/query";
import { useQuery } from "../../hooks/useQuery";

export default function SearchBar() {
  const { filteredResults, handleQuery, handleRedirect, isLoading, query } =
    useQuery();

  return (
    <div className="w-full relative">
      <input
        onChange={handleQuery}
        className="relative z-10"
        type="text"
        placeholder="Search for topics"
        value={query}
      />
      {query.length > 0 && (
        <div className="absolute left-0 top-0 z-0 pt-12 bg-white shadow-md rounded-t-3xl rounded-b-md w-full">
          <ul className="border-t max-h-[50vh] border-t-fine-print/50 overflow-y-scroll">
            {isLoading ? (
              <li className="h-[100px] grid place-items-center text-fine-print text-center p-2 border-b border-gray-light">
                Loading...
              </li>
            ) : filteredResults.length > 0 ? (
              [...filteredResults]
                .sort((a, b) => b.likes - a.likes)
                .map((result: QueryPeek) => (
                  <li
                    onClick={() => handleRedirect(result)}
                    key={result.id}
                    className="p-2 border-b border-gray-light hover:bg-fine-print/25 cursor-pointer text-gray-dark"
                  >
                    <div>
                      <h3>{result.title}</h3>
                      <p>{result.desc.slice(0, 200)}...</p>
                      <div className="flex w-full items-center justify-between gap-6 ">
                        <p className="fine-print">{result.author_id}</p>
                        <div className="flex items-center justify-center gap-3">
                          <p className="fine-print">{result.likes} ❤︎</p>
                          <p className="fine-print">
                            {formatDate(result.date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
            ) : (
              <li className="h-[100px] grid place-items-center text-fine-print text-center p-2 border-b border-gray-light">
                Hmm, no results were found. Try another keyword.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
