import type { AxiosError } from 'axios';
import { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { notificationApi } from '../api/notifications.api';
import { defaultError } from '../lib/constants';
import type { ApiError } from '../types/auth';
import type { NotificationType } from '../types/notification';

export default function useNotifications() {
    const [notifs, setNotifs] = useState<NotificationType[]>([]);
    const [loading, setLoading] = useState(true);

    const toggleView = async (index: number) => {
        // optimistic update
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
            console.log("[SIGN OUT ERROR]:", axiosError.response?.data);

            // toast error or default error
            toast.error(axiosError.response?.data?.message || defaultError.message);
        }
    };

    const fetchNotifs = async () => {
        setLoading(true);
        try {
            const res = await notificationApi.getNotifications();
            setNotifs(res.data.notifications);
        } catch (err) {
            // get full axios error
            const axiosError = err as AxiosError<ApiError>;
            console.log("[SIGN OUT ERROR]:", axiosError.response?.data);

            // toast error or default error
            toast.error(axiosError.response?.data?.message || defaultError.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifs();
    }, []);

    return { loading, notifs, toggleView }
}
