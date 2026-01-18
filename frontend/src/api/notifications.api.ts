import type { ResponseType } from "../types/res";
import apiClient from "./axios.config";

export const notificationApi = {
    // get notifications from current user
    getNotifications: async (): Promise<ResponseType> => {
        const response = await apiClient.get("/notifications/me")
        return response.data
    },

    // toggle viewed
    toggleViewed: async (notification_id: number): Promise<ResponseType> => {
        const response = await apiClient.post(`/notifications/toggle-view/${notification_id}`)
        return response.data
    }
}