import { useEffect, useRef, useState } from "react";
import type { UserSearchResult } from "../types/query";
import type { PostType } from "../types/post";
import { queryApi } from "../api/query.api";
import type { QueryType } from "../components/nav/SearchBar";
import { toast } from "sonner";
import type { Topic } from "../types/topics";
import type { AxiosError } from "axios";
import type { ApiError } from "../types/auth";

export type QueryResult = Topic | UserSearchResult | PostType
export type QueryResults = Topic[] | UserSearchResult[] | PostType[]

const QUERY_DEBOUNCE = 500;

export default function useQuery(searchQuery: string, queryType: QueryType) {
    const [results, setResults] = useState<QueryResults>([]);
    const [loading, setLoading] = useState(false);

    const resetResults = () => {
        setResults([]);
        setLoading(false);
    }

    // added debounce to reduce API calls
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
                if (results) {
                    setResults(results);
                } else {
                    throw new Error("invalid")
                }
            } catch (err: any) {
                // get full axios error
                const axiosError = err as AxiosError<ApiError>;
                console.log("[QUERY ERROR]:", axiosError.response?.data);

                // toast error or default error
                toast.error(axiosError.response?.data?.message || "A search error has occurred. Please try again later.");
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
        resetResults
    };
};