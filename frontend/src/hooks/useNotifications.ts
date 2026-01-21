import type { AxiosError } from 'axios';
import { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { notificationApi } from '../api/notifications.api';
import { defaultError } from '../lib/constants';
import type { ApiError } from '../types/auth';
import type { NotificationType } from '../types/notification';
import { useSelector } from 'react-redux';
import type { RootState } from '../state/store';

export interface NotificationsRes {
    notifs: NotificationType[];
    unread: NotificationType[];
    toggleView: (index: number) => Promise<void>;
    toggleAllViewed: () => Promise<void>;
}

export default function useNotifications() {
    const [notifs, setNotifs] = useState<NotificationType[]>([]);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth)

    const toggleView = async (index: number) => {
        // optimistic update
        const prev = notifs;
        const newNotif = { ...notifs[index], viewed: true } as NotificationType;

        setNotifs((prev) =>
            prev.map((item: NotificationType, i: number) =>
                i === index ? newNotif : item,
            ),
        );
        try {
            const res = await notificationApi.toggleViewed(newNotif.id);
            const serverViewed = res.data.viewed;

            const serverNotif = {
                ...notifs[index],
                viewed: serverViewed,
            } as NotificationType;

            setNotifs((prev) =>
                prev.map((item: NotificationType, i: number) =>
                    i === index ? serverNotif : item,
                ),
            );
        } catch (err) {
            // get full axios error
            const axiosError = err as AxiosError<ApiError>;
            console.log("[NOTIFS ERROR]:", axiosError.response?.data);

            // toast error or default error
            toast.error(axiosError.response?.data?.message || defaultError.message);

            // rollback
            setNotifs(prev)
        }
    };

    const toggleAlLViewed = async () => {
        const prev = notifs;
        // optimistic update
        setNotifs((prev) =>
            prev.map((item: NotificationType) => ({ ...item, viewed: true })
            ),
        );

        try {
            await notificationApi.toggleAllViewed();
        } catch (err) {
            // get full axios error
            const axiosError = err as AxiosError<ApiError>;
            console.log("[NOTIFS ERROR]:", axiosError.response?.data);

            // toast error or default error
            toast.error(axiosError.response?.data?.message || defaultError.message);

            // rollback
            setNotifs(prev)
        }

    }

    const fetchNotifs = async () => {
        try {
            const res = await notificationApi.getNotifications();
            setNotifs(res.data.notifications);
        } catch (err) {
            // get full axios error
            const axiosError = err as AxiosError<ApiError>;
            console.log("[NOTIFS ERROR]:", axiosError.response?.data);
        }
    };

    const unread = notifs.filter((n: NotificationType) => !n.viewed)

    useEffect(() => {
        if (isAuthenticated) fetchNotifs();
    }, []);

    return { notifs, toggleView, unread, toggleAlLViewed }
}
