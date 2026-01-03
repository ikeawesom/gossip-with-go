import apiClient from "./axios.config"
import type { ResponseType } from "../types/res"
import type { CreateTopicType } from "../components/topics/CreateTopicForm";

export const topicApi = {
    // create topic
    createTopic: async (params: CreateTopicType): Promise<ResponseType> => {
        const response = await apiClient.post("/topics/create", { title: params.title, desc: params.desc, className: params.topicClass })
        console.log("API RESPONSE:", response.data);
        return response.data
    },

    // delete topic
    deleteTopic: async (id: number): Promise<ResponseType> => {
        const response = await apiClient.post(`/topics/delete/${id}`)
        console.log("API RESPONSE:", response.data);
        return response.data
    },

    // fetch topic
    getTopic: async (id: number): Promise<ResponseType> => {
        const response = await apiClient.get(`/topics/${id}`)
        console.log("API RESPONSE:", response.data);
        return response.data;
    },

    // fetch popular topics
    getTrendingTopics: async (): Promise<ResponseType> => {
        const response = await apiClient.get("/topics/trending");
        console.log("API RESPONSE:", response.data);
        return response.data;
    },
}