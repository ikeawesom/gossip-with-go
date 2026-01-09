import { useState, useCallback, useRef, useEffect } from 'react';
import { postApi } from '../api/posts.api';
import type { PostType, TrendingPostsResponse } from "../types/post"
import type { ApiError } from '../types/auth';
import { AxiosError } from 'axios';

export type PaginationType = "following" | "trending"

export function usePagination(limit: number, type: PaginationType) {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const isLoadingRef = useRef(false);
    const cursorRef = useRef<number | null>(null);
    const initialLoadRef = useRef(false);

    const fetchPosts = useCallback(async () => {
        if (isLoadingRef.current) return;
        if (!hasMore) return;

        isLoadingRef.current = true;
        setLoading(true);
        setError(null);

        try {
            const params = {
                limit,
                ...(cursorRef.current ? { cursor: cursorRef.current } : {}),
            };

            const response = await postApi.getPaginationPosts(type, params);
            const data = response.data as TrendingPostsResponse;

            setPosts(prev => {
                const existingIds = new Set(prev.map(p => p.id));
                const newPosts = data.posts.filter(p => !existingIds.has(p.id));
                return [...prev, ...newPosts];
            });

            cursorRef.current = data.next_cursor || null;
            setHasMore(data.has_more);

        } catch (err) {
            const axiosError = AxiosError<ApiError>
            setError('Failed to fetch posts.');
            console.log(axiosError);
        } finally {
            setLoading(false);
            isLoadingRef.current = false;
        }
    }, [hasMore, limit]);

    // Load more posts
    const loadMore = useCallback(() => {
        fetchPosts();
    }, [fetchPosts]);

    useEffect(() => {
        if (!initialLoadRef.current) {
            initialLoadRef.current = true;
            fetchPosts();
        }
    }, []);

    return {
        posts,
        loading,
        error,
        hasMore,
        loadMore,
    };
}