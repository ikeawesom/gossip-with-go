import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react'
import { commentsApi } from '../api/comments.api';
import { REQUEST_CURSOR_LIMIT_REPLIES } from '../lib/constants';
import type { ApiError } from '../types/auth';
import type { RepliesResponse } from '../types/comments';
import type { Comment } from "../types/comments"

export default function useShowReplies(id: number) {
    const [limit, setLimit] = useState(REQUEST_CURSOR_LIMIT_REPLIES);
    const [showReplies, setShowReplies] = useState(false);
    const [allLoaded, setAllLoaded] = useState(false);
    const [replies, setReplies] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [offSet, setOffset] = useState(0)

    const fetchReplies = useCallback(async () => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await commentsApi.getReplies(id, limit, offSet);
            const data = response.data as RepliesResponse;

            setReplies((prev) => [...prev, ...data.replies]);

            setHasMore(data.has_more);
            if (!data.has_more) {
                setAllLoaded(true);
                console.log("all replies loaded")
            }
            setOffset((e) => e + limit);
        } catch (err: any) {
            const error = AxiosError<ApiError>;
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [offSet, hasMore, limit]);

    const handleHideAllReplies = () => {
        setShowReplies(false);
        setOffset(0);
        setLimit(replies.length)
        setReplies([])
        setAllLoaded(false);
    }

    useEffect(() => {
        if (allLoaded) {
            setShowReplies(true);
        }
    }, [allLoaded])

    // load more replies
    const loadMore = useCallback(() => {
        setShowReplies(true)
        fetchReplies();
        console.log("fetching new replies...")
    }, [fetchReplies]);

    return {
        replies, loadMore, showReplies, allLoaded, handleHideAllReplies, loading
    };
}
