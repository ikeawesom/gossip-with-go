import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { searchQueryPeeks } from "../lib/helpers";
import { setQuery, queryAsync, hideResults, showResults } from "../state/search/querySlice";
import type { RootState, AppDispatch } from "../state/store";
import type { QueryPeek } from "../types/query";

export function useQuery() {
    const { query, results, isLoading, isShowResults } = useSelector(
        (state: RootState) => state.query
    );
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const filteredResults = useMemo(() => {
        return searchQueryPeeks(results, query);
    }, [query, results]);

    const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        dispatch(setQuery(value));
        dispatch(queryAsync(query));
    };

    const handleRedirect = (post: QueryPeek) => {
        navigate(`/${post.author_id}/posts/${post.id}`);
        console.log("here");
    };


    return {
        query, isLoading, filteredResults, handleQuery, handleRedirect, isShowResults,
        hideResults: () => dispatch(hideResults()), showResults: () => dispatch(showResults())
    };
}