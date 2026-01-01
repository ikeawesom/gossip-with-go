import type { ResponseType } from "../types/res";
import apiClient from "./axios.config";

export const queryApi = {
    query: async (query: string, type: "users" | "posts" | "topics"): Promise<ResponseType> => {
        const response = await apiClient.get("/query", {
            params: { value: query, type }
        })
        console.log("API RESPONSE:", response);
        return response.data as any as ResponseType
    }
}