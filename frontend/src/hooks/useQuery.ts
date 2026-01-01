import { useEffect, useRef, useState } from "react";
import type { TopicSearchResult, UserSearchResult } from "../types/query";
import type { PostType } from "../types/post";
import { queryApi } from "../api/query.api";
import type { QueryType } from "../components/nav/SearchBar";
import { toast } from "sonner";

export type QueryResult = UserSearchResult | TopicSearchResult | PostType
export type QueryResults = UserSearchResult[] | TopicSearchResult[] | PostType[]

const QUERY_DEBOUNCE = 500;

export default function useQuery(searchQuery: string, queryType: QueryType) {
    const [results, setResults] = useState<QueryResults>([]);
    const [loading, setLoading] = useState(false);

    const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

    useEffect(() => {
        if (!searchQuery || searchQuery.trim() === '') {
            setResults([]);
            setLoading(false);
            return;
        }

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        setLoading(true);

        debounceTimerRef.current = setTimeout(async () => {
            try {
                const response = await queryApi.query(searchQuery, queryType);
                const { results } = response.data;
                setResults(results);
            } catch (err: any) {
                toast.error("Search error.")
                console.log(err);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, QUERY_DEBOUNCE);

        // cleanup
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [searchQuery, queryType, QUERY_DEBOUNCE]);

    return {
        results,
        loading,
    };
};