import { useState, useEffect, useCallback, useRef } from 'react';
import { postApi } from '../api/posts.api';
import type { PostType, TrendingPostsResponse } from '../types/post';
import { REQUEST_CURSOR_LIMIT } from '../lib/constants';

export function usePagination(limit: number = REQUEST_CURSOR_LIMIT) {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [cursor, setCursor] = useState<number | null>(null);

    const isLoadingRef = useRef(false);

    const fetchPosts = useCallback(async (isRefresh: boolean = false) => {
        if (isLoadingRef.current) return;

        if (!isRefresh && !hasMore) return;

        isLoadingRef.current = true;
        setLoading(true);
        setError(null);

        try {
            const params = { limit, ...(isRefresh ? {} : cursor ? { cursor } : {}) };
            const response = await postApi.getTrendingPosts(params);
            const data = response.data as TrendingPostsResponse;

            if (isRefresh) {
                setPosts(data.posts);
            } else {
                setPosts(prev => [...prev, ...data.posts]);
            }

            // Update cursor and hasMore
            setCursor(data.next_cursor);
            setHasMore(data.has_more);

        } catch (err: any) {
            console.error('Failed to fetch posts:', err);
            setError(err.response?.data?.message || 'Failed to load posts');
        } finally {
            setLoading(false);
            isLoadingRef.current = false;
        }
    }, [cursor, hasMore, limit]);

    // load more posts
    const loadMore = useCallback(() => {
        fetchPosts(false);
    }, [fetchPosts]);

    useEffect(() => {
        fetchPosts(true);
    }, []);

    return {
        posts,
        loading,
        error,
        hasMore,
        loadMore,
    };
};